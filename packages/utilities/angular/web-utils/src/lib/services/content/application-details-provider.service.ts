import { InjectionToken } from '@angular/core';
import { InterceptorService } from '../../service-invoker/interceptor/abstract-interceptor-service';

export interface ApplicationDetailsProviderService {
  /**
   * Provide the details of the application
   */
  getApplicationName(): ApplicationDetails;
}

export interface ApplicationDetails {
  id: string;
  name: string;
}

export const APP_DETAILS_PROVIDER = new InjectionToken<InterceptorService>('APP_DETAILS_PROVIDER');
