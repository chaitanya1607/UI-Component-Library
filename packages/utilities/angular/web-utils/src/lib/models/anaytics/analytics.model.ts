import { StatusType } from '../common.model';

export interface AnalyticsData {
  pageName?: string;
  pagePath?: string;
  eventLabel?: string;
  eventAction?: string;
  analyticsError?: AnalyticsError;
  performanceDuration?: number;
  eventCategory?: string;
  customData?: Map<string, string>;
  userId?: string; // use as a custom dimension to verify the user (different from the default property of the analytics to identify user)
  clientId?: string;
  eventValue?: number;
  totalRevenue?: string;
}

export interface AnalyticsAccountDetails {
  accountId: string;
  implementationName: string;
}

export interface WorkflowDetails {
  name: string;
}

export interface StepDetails {
  name: string;
}

export type EventType = 'click' | 'page-view' | 'performance' | 'error' | 'success-events' | 'rating-event' | 'feature-outage'| 'iab' | 'anomaly' | 'auto-correction'| 'revenue-generated';

export type ErrorCategoryType = 'ui-error' | 'service-error';

export interface AnalyticsError {
  errorType: StatusType;
  errorMessage: string;
  errorSource: string; // can be name of service for now
  errorCategory: ErrorCategoryType;
}
