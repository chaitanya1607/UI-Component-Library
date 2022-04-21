import { Injectable, Type } from '@angular/core';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { isEmpty } from 'lodash';
import { HttpCallType } from './http-constants';
import { ResponseMapper } from './response-mapper';

@Injectable({
  providedIn: 'root'
})
export class ServiceConfig {

  private SVC_CONFIG: Map<string, IServiceConfig> = new Map<string, IServiceConfig>();

  private logger: Logger = LoggerUtils.getInstance('ServiceConfig');

  /**
     * Get the svc configuration from the registered services.
     * @param serviceName
     */
  public getSvcConfig (serviceName: string): IServiceConfig {

    if (isEmpty(this.SVC_CONFIG)) {
      this.logger.error(`no service configurations available.Looks like the service configurations master list is not created yet`);
      return;
    }

    if (isEmpty(serviceName)) {
      this.logger.error(`no service name given`);
      throw new Error(`service name is not provided to get the service`);
    }
    const serviceConfig = this.SVC_CONFIG.get(serviceName);
    return serviceConfig;
  }

  /**
     * @param serviceConfiguration : service configuration can be registered by the modules on the load of the component.
     */
  public registerServiceConfiguration (serviceConfiguration: IServiceConfig[]) {
    if (isEmpty(serviceConfiguration)) {
      this.logger.error('service configurations passed to config registry is empty');
      return;
    }
    serviceConfiguration.forEach((svcConfig) => {
      if (!isEmpty(this.SVC_CONFIG.get(svcConfig.serviceName))) {
        this.logger.error('service cofiguration with service [', svcConfig.serviceName, '] ' +
          'is already available in the context. We will override with this new service config');
      }
      this.SVC_CONFIG.set(svcConfig.serviceName, svcConfig);

    });
  }
}

export interface IServiceConfig {
  serviceName: string;
  url: string;
  hasPathParams?: boolean;
  baseUrl?: string;
  callType: HttpCallType;
  fallBack?: IServiceFallbackConfig;
  headers?: IHeader[];
  responseType?: string; // if not mentioned `json` is used
  mapper?: Type<ResponseMapper>;
  isProtected?: boolean; // by default considered to be `true`
}

export interface IHeader {
  key: string;
  value: string;
}

export interface IServiceFallbackConfig {
  enabled: boolean;
  fallBackServices: string[];
}

