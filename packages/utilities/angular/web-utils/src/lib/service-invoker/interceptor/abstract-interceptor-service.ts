import { HttpResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { AuthToken } from '../../models/common.model';
import { IHeader, IServiceConfig } from '../service-config';

/**
 * Provide the implementation for this interface to handle the authorization needs for the service.
 * If the user is not authorized to invoke a service, user should be redirected to the proper authentication
 * channel.
 */
export interface InterceptorService {
  /**
	 * This is the token that needs to be passed as part of every request which is protected.
	 * Internally the implementation can get this information from `sessionStorage` which is stored
	 * there as part of the authentication process.
	 */
  getAuthorizationToken (): AuthToken;

  getCustomHeaders():IHeader[];
  handle401Code (requestPayload: any, svcConfiguration: IServiceConfig, response: HttpResponse<any>):void;
  handle404Code (requestPayload: any, svcConfiguration: IServiceConfig, response: HttpResponse<any>):void;
  handle400Code (requestPayload: any, svcConfiguration: IServiceConfig, response: HttpResponse<any>):void;
}

export const SERVICE_INVOKER_INTERCEPTOR = new InjectionToken<InterceptorService>('SERVICE_INVOKER_INTERCEPTOR');
