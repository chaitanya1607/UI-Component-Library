import { Observable } from 'rxjs';
import { AnalyticsData, AnalyticsError, EventType, StepDetails, WorkflowDetails } from '../../models/anaytics/analytics.model';
import { User } from '../../models/user.model';

export interface AnalyticsProvider {

  initialize(): Observable<void>;

  setUser(uniqueId: string, user?: User): Observable<void>;

  getPublicUserId(): string;

  trackPageView(analyticsData: AnalyticsData): Observable<void>;

  trackEvent(eventType: EventType, analyticsData: AnalyticsData, user?: User): Observable<void>;

  trackExceptions(analyticsData: AnalyticsData, error: AnalyticsError,  user?: User): Observable<void>;

  trackWorkflow(workflowDetails: WorkflowDetails, currentStep: StepDetails, analyticsData: AnalyticsData): Observable<void>;

  totalRevenueGenerated(analyticsData: AnalyticsData): Observable<void>;

}
