import { Injectable } from '@angular/core';
import { LoggerUtils } from '@utilities/angular-utils';
import { Observable, of } from 'rxjs';
import { AnalyticsData } from '../../models';
import { AnalyticsService } from '../analytics/analytics.service';
/**
 * the max amount of time the loader can be shown in seconds. above this we consider it as a special case
 */
const LOADER_SHOW_THRESHOLD = 60;
export class LoaderOptions {
  messageText?: string;
  messageTextkey?: string;
  ariaOptions?: LoaderAriaOptions;
}

export class LoaderAriaOptions {
  announceOpen?= true;
  announceClose?= true;
  openingText?: string;
  closingText?: string;
}

@Injectable({
  providedIn: 'root'
})
export abstract class LoaderService {

  /**
   * @description a variable that keeps track of the number of requests made to show the loader.
   * this variable can be used to see if we need to open or close the loader
   */
  public loaderRequestorCount: number;
  public showingLoader: boolean;
  private loaderTimer: number;
  private loaderStartTime: Date;
  private _logger = LoggerUtils.getInstance('Loader Service');
  private _loaderOptions: LoaderOptions;

  // TODO Need to implement the loading part here properly
  loader: any;

  constructor(
    private analytics: AnalyticsService
  ) {
    this.loaderRequestorCount = 0;
  }

  abstract displayLoader(options?: LoaderOptions): Observable<void>;
  abstract closeLoader(): Observable<void>;

  get loaderOptions() {
    return this._loaderOptions;
  }

  /**
   * Open the loader
   * @param message
   */
  open(options?: LoaderOptions): Observable<void> {
    this.loaderRequestorCount++;
    if (options) {
      this._loaderOptions = options;
    }
    // create a instance only if there isn't one already being shown
    if (this.loaderRequestorCount > 1) {
      // loader already available
      return of(undefined);
    }
    this._logger.debug(`no loader is being shown on screen. new loader will be added`);
    return this.displayLoader(options);
  }

  /**
   * Close the loader
   */
  close() {
    if (this.loaderRequestorCount <= 0) {
      this._logger.warn(`attempting to close the loader without opening it!`);
      return;
    }
    this.loaderRequestorCount--;
    // check if we need to close the loader
    if (this.loaderRequestorCount === 0) {
      this._logger.debug(`all loader requests completed. closing loader`);
      this.closeLoader();
      this.handleLoaderClose();
    }
  }

  private handleLoaderShow() {
    this.initLoaderTracking();
    this.loaderStartTime = new Date();
  }

  private handleLoaderClose() {
    this.clearLoadingTracker();
    if (!this.loaderStartTime) {
      return;
    }
    const loaderShowTime = ((new Date()).getTime() - this.loaderStartTime.getTime()) / 1000;
    if (loaderShowTime < LOADER_SHOW_THRESHOLD) {
      return;
    }
    const analyticsData: AnalyticsData = {
      eventLabel: `loader ${this.loader?.id} was closed after ${loaderShowTime} seconds`,
      eventAction: 'Loader Closed after Fair Duration Exceeded'
    };
    this.analytics.trackEvent('anomaly', analyticsData);
  }

  private initLoaderTracking() {
    this.loaderTimer = window.setTimeout(() => {
      this._logger.warn(`loader has been shown for [${LOADER_SHOW_THRESHOLD}]`);
      const analyticsData: AnalyticsData = {
        eventLabel: `loader ${this.loader?.id} shown for more than ${LOADER_SHOW_THRESHOLD} seconds`,
        eventAction: 'Loader Exceeded Fair Duration'
      };
      this.analytics.trackEvent('anomaly', analyticsData);
    }, LOADER_SHOW_THRESHOLD * 1000);
  }

  private clearLoadingTracker() {
    clearTimeout(this.loaderTimer);
  }

}
