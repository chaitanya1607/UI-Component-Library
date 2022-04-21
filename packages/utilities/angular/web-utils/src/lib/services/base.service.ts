import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Logger, LoggerUtils, Utils } from '@utilities/angular-utils';
import { isEmpty } from 'lodash';
import { EMPTY, Observable } from 'rxjs';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';
import { AnalyticsData, EventType } from '../models/anaytics/analytics.model';
import { BaseServiceResponse, Message, MessageType } from '../models/common.model';
import { MessageAlertService } from '../services/alert/message-alert.service';
import { AnalyticsService } from '../services/analytics/analytics.service';
import { ContentService } from '../services/content/content.service';
import { LoaderService } from '../services/loader/loader.service';
import { ExceptionHandlerService } from '../utilities/exception/exception-handler.service';
import { ServiceLocator } from '../utilities/service.locator';


const ERRORMSG = 'There was an error processing the request, please try again. If the problem persists please contact support.';

export class BaseService {

  private _logger$$: Logger = LoggerUtils.getInstance('BaseService');
  protected loaderSvc: LoaderService;
  private exceptionHandlerSvc: ExceptionHandlerService;
  private router: Router;
  private messageAlert: MessageAlertService;
  contentService: ContentService;
  private analyticsSvc: AnalyticsService;

  constructor() {
    this.loaderSvc = ServiceLocator.injector.get(LoaderService);
    this.exceptionHandlerSvc = ServiceLocator.injector.get(ExceptionHandlerService);
    this.router = ServiceLocator.injector.get(Router);
    this.messageAlert = ServiceLocator.injector.get(MessageAlertService);
    this.contentService = ServiceLocator.injector.get(ContentService);
    this.analyticsSvc = ServiceLocator.injector.get(AnalyticsService);
  }

  protected invokeService<T>(observable: Observable<any>,
                            shouldUseLoader = false,
                            shouldShowErrorAlert = true,
                            loadingTextKey?: string): Observable<T> {

    let observableRef = observable;
    if (shouldUseLoader) {
      const loadingText = loadingTextKey ? this.contentService.getMessage(loadingTextKey)?.text : undefined;
      observableRef = this.loaderSvc.open({messageText: loadingText}).pipe(mergeMap(() => observable));
    }
    return observableRef.pipe(finalize(() => {
      if (shouldUseLoader) {
        this.loaderSvc.close();
      }
    }), catchError((error) => {
      if (shouldShowErrorAlert) {
        this._showErrorAlert(error);
      }
      return EMPTY;
    }));
  }

  protected trackEvent(eventType: EventType, analyticsData: AnalyticsData) {
    this.analyticsSvc.trackEvent(eventType, analyticsData);
  }

  private _showErrorAlert(error: HttpErrorResponse) {
    const url = this.router.url;
    this.exceptionHandlerSvc.invokeHandler(url, error).pipe(
      tap((didHandle) => {
        if (!didHandle) {
          this.messageAlert.showMessage(new Message(ERRORMSG, MessageType.ERROR));
        }
      })
    ).subscribe();
    this._logger$$.error('An error occured while for the service ', error);

  }

  /**
   * Returns a url with the params replaced. The params should be mentioned between `{}`.
   * Example `/api/claims/{claimNumber}`
   * objectWithValues should have a key called `claimNumber`, example `{claimNumber:'123456'}`
   * Final url will be `/api/claims/123456
   * @param url
   * @param objectWithValues
   */
  protected getUrlWithParamsReplaced(url: string, objectWithValues: any): string {
    return Utils.replaceVariablesInString(url, objectWithValues);
  }

  protected isResponseValid<T>(responseData: BaseServiceResponse<T>): boolean {
    return !isEmpty(responseData) && responseData.status === 'ok';
  }

  protected handleFileUpload<T>(event: HttpEvent<any>): FileUploadProgress<T> {
    switch (event.type) {
      case HttpEventType.Sent:
        return { status: 'request-sent' };

      case HttpEventType.UploadProgress:
        // eslint-disable-next-line no-case-declarations
        const percentage = Math.round(100 * event.loaded / event.total);
        return { status: 'in-progress', progressPercentage: percentage };

      case HttpEventType.ResponseHeader:
        return { status: 'in-progress', _detailedStatus: 'response-header-received' };

      case HttpEventType.DownloadProgress:
        return { status: 'in-progress', _detailedStatus: 'response-body-download' };

      case HttpEventType.Response:
        return { status: 'completed', data: event.body };

      default:
        return { status: 'error' };
    }
  }

  protected handleError(error): Observable<any> {
    this._logger$$.error(error);
    this.messageAlert.showMessage(new Message(ERRORMSG, MessageType.ERROR));
    return EMPTY;
  }

}

export type UploadProgress = 'request-sent' | 'in-progress' | 'response-header-received' | 'response-body-download' | 'completed' | 'error';
export interface FileUploadProgress<T> {
  status: UploadProgress;
  _detailedStatus?: UploadProgress;
  data?: T;
  errors?: Error[];
  progressPercentage?: number;
}
