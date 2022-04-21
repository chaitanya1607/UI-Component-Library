import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Optional, Type } from '@angular/core';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { isEmpty } from 'lodash';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpCallType } from './http-constants';
import { InterceptorService, SERVICE_INVOKER_INTERCEPTOR } from './interceptor/abstract-interceptor-service';
import { ResponseMapper } from './response-mapper';
import { IHeader, IServiceConfig, IServiceFallbackConfig, ServiceConfig } from './service-config';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ServiceInvoker {
  logger: Logger = LoggerUtils.getInstance('ServiceInvoker');

  constructor(private httpClient: HttpClient,
    private svcConfig: ServiceConfig,
    @Optional() @Inject(SERVICE_INVOKER_INTERCEPTOR) private interceptorService?: InterceptorService) {
  }

  appLevelSvcLoader = new Subject<boolean>();

  /**
     *
     * @param serviceName - name of the service against which the service api is configured in the SVC_CONFIG.
     * @param payload - the payload for the api service call.
     * @param headers - the instance of the HttpHeaders. This will be merged with other headers that are
     *                  mentioned in the configuration (if applicable) AND authorization header (if applicable)
     * @param requestUrlCreator - This is the optional function which could be used to create the request url
     */
  invokeService(serviceName: string, 
                payload?: any, 
                headers?: HttpHeaders, 
                url?: string,
                requestUrlCreator?: (url: string, payload: any) => string): Observable<any> {

    this.logger.debug('Invoking the service [', serviceName, ']');
    const svcConfiguration: IServiceConfig = this.getSvcConfiguration(serviceName);

    if (!svcConfiguration) {
      this.logger.error(`service configuration not avaiable for the service [${serviceName}]`);
      return throwError(`service configuaration is invalid for the service [${serviceName}]. Or it is not configured in the SVC_CONFIG`);
    }

    headers = this.addSvcHttpHeaders(headers, svcConfiguration);

    const responseType = svcConfiguration.responseType || 'json';

    const httpOptions = (responseType) !== undefined ? { headers, responseType } : { headers };

    const responseObs: Observable<any> = this.invokeUsingHttpClient(svcConfiguration, httpOptions, payload, url, requestUrlCreator);
    return responseObs.pipe(
      map(this.validateToken.bind(this)),
      map(this.responseMapper.bind(this, svcConfiguration)),
      catchError(this.handleError.bind(this, svcConfiguration, payload, httpOptions)));
  }

  private getSvcApiUrl(serviceConfiguration: IServiceConfig, payload: any, url: string, requestUrlCreator?: (url: string, payload: any) => string): string {
    // If user has given the requestUrlCreator, that has the higest preference over others
    if (requestUrlCreator) {
      const configuredUrl = url || serviceConfiguration.url;
      const _endPointUrl = requestUrlCreator(configuredUrl, payload);

      this.logger.debug(`The url constructed using requestUrlCreator is [${_endPointUrl}]`);

      return serviceConfiguration.baseUrl + _endPointUrl;
    }

    return isEmpty(url) ? serviceConfiguration.baseUrl + serviceConfiguration.url : serviceConfiguration.baseUrl + url;
  }

  protected invokeUsingHttpClient(svcConfiguration: IServiceConfig,
    httpOptions: any,
    payload: any,
    urlToInvoke?: string,
    requestUrlCreator?: (url: string, payload: any) => string): Observable<any> {

    let url: string = this.getSvcApiUrl(svcConfiguration, payload, urlToInvoke, requestUrlCreator);

    this.logger.debug('Service URL as per configuration [', url, ']');

    const environmentContext = this.getEnvironmentContextData();

    const contextData: any = {};

    Object.assign(contextData, payload, environmentContext);

    if (svcConfiguration.hasPathParams) {
      const pathKeys: string[] = Object.keys(contextData);
      pathKeys.forEach(pathKey => {
        url = url.replace('{' + pathKey + '}', contextData[pathKey]);
      });
    }

    this.logger.debug('Constructed URL with variables replaced [', url, ']');
    switch (svcConfiguration.callType) {
      case HttpCallType.GET:
        return this.httpGetInvoker(url, httpOptions, payload);
      case HttpCallType.POST:
        return this.httpPostInvoker(url, httpOptions, payload);
      case HttpCallType.PUT:
        return this.httpPutInvoker(url, httpOptions, payload);
    }

  }

  private getEnvironmentContextData(): any {
    // TODO For now we will have only the environment value here.
    return {};
  }

  /**
     * Checks if the httpHeader is empty or not. If httpHeaders is undefined, then instance of
     * http header is created and access token is added otherwise token is added to the passed httpHeaders instance itself.
     * @param httpHeaders :
     */
  protected addSvcHttpHeaders(httpHeaders: HttpHeaders, serviceConfiguration: IServiceConfig): HttpHeaders {
    if (!httpHeaders) {
      httpHeaders = new HttpHeaders();
    }

    httpHeaders = this._addHeaders(serviceConfiguration.headers, httpHeaders);

    httpHeaders = this._addCustomHeaders(httpHeaders);
    
    httpHeaders = this._addAuthorizationHeaders(serviceConfiguration, httpHeaders);

    return httpHeaders;
  }

  private _addCustomHeaders(httpHeaders: HttpHeaders): HttpHeaders {
    if(this.interceptorService){
      const headers:IHeader[] = this.interceptorService.getCustomHeaders();
      return this._addHeaders(headers, httpHeaders);
    }
    return httpHeaders;
  }

  private _addHeaders(headers: IHeader[], httpHeaders: HttpHeaders): HttpHeaders {
    if (isEmpty(headers)) { return; }

    headers.forEach(header => {
      if (!httpHeaders.has(header.key)) {
        httpHeaders = httpHeaders.set(header.key, header.value);
      }
    });

    return httpHeaders;
  }

  _addAuthorizationHeaders(serviceConfiguration: IServiceConfig, httpHeaders: HttpHeaders): HttpHeaders {
    // by default if nothing mentioned, then the service is protected
    const isServiceProtected = !(serviceConfiguration.isProtected === false);

    if (isServiceProtected) {
      this.logger.debug(`service ${serviceConfiguration.serviceName} is protected, token will be added`);

      if (this.interceptorService) {
        const authToken = this.interceptorService.getAuthorizationToken();
        if (authToken && authToken.token) {
          httpHeaders = httpHeaders.set('Authorization', authToken.token);
        }
      } else {
        this.logger.warn(`implementation for interceptor service is not provided, make sure that it's define in the main module`);
      }
    } else {
      this.logger.debug(`service ${serviceConfiguration.serviceName} is not protected, no auth-token will be added`);
    }

    return httpHeaders;
  }

  protected getSvcConfiguration(svcName: string): IServiceConfig {
    return this.svcConfig.getSvcConfig(svcName);
  }

  private handleError(svcConfiguration: IServiceConfig, payload: any, httpOptions: any, error: any): Observable<any> {
    this.logger.error('Error while invoking the service ', error);

    // TODO - We need to see the response status code for which fallback needs to be applied.

    // Checking if the FALLBACK property is present on the Configuration
    if (!this.shouldUseFallbackOption(svcConfiguration, error)) {
      this.logger.debug('fallback not supported');
      this.appLevelSvcLoader.next(false);
      return throwError(error);
    }

    const fallbackSvcIndex = 0;

    const responseObs: Observable<any> = this.invokeFallBackService(svcConfiguration, payload, httpOptions, fallbackSvcIndex);
    return responseObs.pipe(map(this.validateToken.bind(this)));
  }

  private shouldUseFallbackOption(svConfiguration: IServiceConfig, error: any) {
    this.logger.debug('Error status: ' + error.status);

    // The response status now is eligible for the fallback logic if service is configured to support it.
    if (svConfiguration.fallBack && svConfiguration.fallBack.enabled) {
      this.logger.debug('fallback is enabled for serviceConfiguration');
      return true;
    } else {
      this.logger.debug('fallback is not enabled for service configuration');
      return false;
    }
  }

  /**
     * Here we can have the code that is common to all of the services in the application.
     */
  protected validateToken(response: Response) {
    this.appLevelSvcLoader.next(false);
    return response;
  }

  private responseMapper(svcConfiguration: IServiceConfig, response: Response) {
    if (svcConfiguration.mapper) {
      const responseMapper: Type<ResponseMapper> = svcConfiguration.mapper;
      const mapperInstance = new responseMapper();
      response = mapperInstance.map(response);
    }
    return response;
  }

  private httpGetInvoker(url: string, httpOptions: any, payload: any): Observable<any> {
    // TODO : NEED TO CHECK ON THIS
    // if (!isEmpty(payload)) {
    //   const params = new HttpParams({
    //     fromObject: payload
    //   });
    //   httpOptions.params = params;
    // }

    return this.httpClient.get(url, httpOptions);
  }

  private httpPostInvoker(url: string, httpOptions: any, payload: any): Observable<any> {
    return this.httpClient.post(url, payload, httpOptions);
  }

  private httpPutInvoker(url: string, httpOptions: any, payload: any): Observable<any> {
    return this.httpClient.put(url, payload, httpOptions);
  }

  /**
   * Invokes the fallback services, if the fallbackService fails,
   * handleFallBackError will take care of calling the next fallback service.
   * @param fallBackServices - the fallbackConfig object
   * @param payload - the payload for the api service call.
   * @param headers - the instance of the HttpHeaders.
   * @param fallBackSvcIndex - index of the fallBackConfig to be invoked
   */
  public invokeFallBackService(svcConfiguration: IServiceConfig,
    payload?: any,
    headers?: HttpHeaders,
    fallBackSvcIndex?: number): Observable<any> {
    const fallbackConfig: IServiceFallbackConfig = svcConfiguration.fallBack;
    const fallBackServices = fallbackConfig.fallBackServices;

    this.logger.debug('fallback service(s) configured is(are) ', fallBackServices);

    const fallBackSvcConfiguration = this.getSvcConfiguration(fallBackServices[fallBackSvcIndex]);

    if (!fallBackSvcConfiguration) {
      this.logger.error(`service configuration not avaiable for the service [${fallBackSvcConfiguration.serviceName}]`);
      // eslint-disable-next-line max-len
      return throwError(`service configuaration is invalid for the service [${fallBackSvcConfiguration.serviceName}]. Or it is not configured in the SVC_CONFIG`);
    }

    headers = this.addSvcHttpHeaders(headers, fallBackSvcConfiguration);
    const httpOptions = headers;

    this.logger.debug('invoking [', fallBackSvcIndex + 1, '] out of [', fallBackServices.length, '].' +
      'Current fallback service to be invoked is [', fallBackServices[fallBackSvcIndex], ']');

    const responseObs: Observable<any> = this.invokeUsingHttpClient(fallBackSvcConfiguration, httpOptions, payload);
    return responseObs
      .pipe(map(this.validateToken.bind(this)),
        catchError(this.handleFallBackError.bind(this,
          fallBackServices,
          payload,
          httpOptions, fallBackSvcIndex + 1))); // fallbackURLIndex is increased by on
  }

  /**
     * Handles the FallBack Error and inovoke FallBackService with different configuration.
     * @param fallBackServices - the fallbackConfig object
     * @param payload - the payload for the api service call.
     * @param headers - the instance of the HttpHeaders.
     * @param fallBackSvcIndex - index of the fallBackConfig which was invoked
     */
  private handleFallBackError(fallBackServices: any, payload: any, httpOptions: any, fallBackSvcIndex: any, error: any) {
    this.logger.error('fallback service [', fallBackServices[fallBackSvcIndex - 1], '] failed with error ', error);

    // check if we have more fallback locations to be invoked.
    if (fallBackSvcIndex < fallBackServices.length) {
      const responseObs: Observable<any> = this.invokeFallBackService(fallBackServices, payload, httpOptions, fallBackSvcIndex);

      return responseObs.pipe(
        map(this.validateToken.bind(this)),
        catchError(this.handleFallBackError.bind(this, fallBackServices, payload, httpOptions, fallBackSvcIndex + 1)));
    } else {
      this.logger.error('all Fallbacks configured for the service failed');
      this.appLevelSvcLoader.next(false);
      return throwError(error);
    }
  }

}
