import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { isEmpty } from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { filter, mergeAll } from 'rxjs/operators';
import { AnalyticsData, ErrorCategoryType, EventType } from '../../models/anaytics/analytics.model';
import { User } from '../../models/user.model';
import { AnalyticsProvider } from '../../services/analytics/analytics-provider';
import { CacheService } from '../../services/cache/cache.service';
import { UserStore } from '../../services/user/user.store';

export const ANALYTICS_PROVIDERS = new InjectionToken<Array<AnalyticsProvider>>('AnalyticsProviders');
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(
              private userStore: UserStore,
              @Optional() @Inject(ANALYTICS_PROVIDERS) private analyticsProviders: AnalyticsProvider[]) {
  }

  private _logger: Logger = LoggerUtils.getInstance('AnalyticsService');

  /**
   * This method should be called during the start of the application
   */
  public initialize(): Observable<void> {
    const obs = this.analyticsProviders?.map((provider) => {

      // set the userId explicitly only when we have that information, else do not set it
      this.userStore.authenticatedUser.pipe(filter(user => !isEmpty(user)))
        .subscribe((userData) => this._setLoggedInUser(userData));
      return provider.initialize();
    });
    return forkJoin(obs).pipe(mergeAll());

    // perform the other common listening events (like page events, etc, etc)
    // once those events are getting notified, call the trackEvent method with the corresponding one.
  }

  /**
   * Everyone calls this one method from the various sources of event. The sources of even are
   * 1. Page navigation listeners
   * 2. Error handlers
   * 3. Service performance metrics
   * 4. Workflow
   * 5. Other component click events which we need to track
   *
   * Once the information is got in this method, we call the corresponding methods in the analytics provider(s)
   * based on the type of the event.
   * Individual AnalyticsProviders knows how to convert the data to the format based on the type of the event
   */
  public trackEvent(eventType: EventType, analyticsData: AnalyticsData): Observable<void> {
    try {
      const userData: User = this.userStore.authenticatedUserData();

      switch (eventType) {
        case 'page-view':
          this.analyticsProviders.forEach((provider) => {
            this.setUserIdToAnalyticsData(provider.getPublicUserId(), analyticsData, userData);
            provider.trackPageView(analyticsData);
          });
          break;

        case 'performance':
        case 'success-events':
        case 'click':
        case 'rating-event':
        case 'feature-outage':
        case 'iab':
        case 'anomaly':
          this.analyticsProviders.forEach((provider) => {
            this.setUserIdToAnalyticsData(provider.getPublicUserId(), analyticsData, userData);
            provider.trackEvent(eventType, analyticsData, userData);
          });
          break;

        case 'revenue-generated':
          this.analyticsProviders.forEach(provider => {
            this.setUserIdToAnalyticsData(provider.getPublicUserId(), analyticsData, userData);
            provider.totalRevenueGenerated(analyticsData);
          });
          break;

        case 'error':
          this.analyticsProviders.forEach((provider) => {
            this.setUserIdToAnalyticsData(provider.getPublicUserId(), analyticsData, userData);
            provider.trackExceptions(analyticsData, analyticsData.analyticsError, userData);
          });
          break;

        default:
          this._logger.debug('no analytics method for this event type');
          break;
      }
    } catch (e) {
      this._logger.error(e);
    }

    return;
  }

  private _setLoggedInUser(user: User) {
    this._setUser(user?.cif, user);
  }

  private _setUser(userId: string, user?: User) {
    this.analyticsProviders.forEach(provider => provider.setUser(userId, user));
  }

  /**
   * Convenience method to track the errors
   * @param errorSource - The source where the error is from
   * @param errorCategory  - whether it's due to a UI issue or a service issue
   * @param errorMessage - The actual error code or message
   */
  public trackErrorEvent(errorSource: string, errorCategory: ErrorCategoryType, errorMessage: string) {
    const analayticsData: AnalyticsData = {
      analyticsError: {
        errorSource,
        errorMessage,
        errorType: 'error',
        errorCategory
      }
    };
    this.trackEvent('error', analayticsData);
  }

  private setUserIdToAnalyticsData(publicUserId: string = 'NA', analyticsData: AnalyticsData, userData: User) {
    // public user will have only the public user id.
    // loggedin in user will have the CIF & publicUserId
    let userId = (userData && userData.cif) ? `${userData.cif}.${publicUserId}` : publicUserId;

    // prepend with "g-" in the case of guest user
    userId = (userData && userData.isGuest) ? `g-${userId}` : userId;

    this._logger.debug(`user id set to the analyticsData is [${userId}], is public? [${isEmpty(userData)}]`);

    // this should be used as a custom dimension used for debugging purpose.
    analyticsData.userId = userId;

  }

}
