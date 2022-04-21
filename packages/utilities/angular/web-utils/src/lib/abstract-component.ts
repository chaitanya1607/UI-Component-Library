import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Directive, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Logger, LoggerUtils, Utils } from '@utilities/angular-utils';
import { isEmpty } from 'lodash';
import { from, Observable } from 'rxjs';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';
import { AnalyticsData, EventType } from './models/anaytics/analytics.model';
import { FeatureConfig, Message, MessageType } from './models/common.model';
import { MessageAlertService } from './services/alert/message-alert.service';
import { AnalyticsService } from './services/analytics/analytics.service';
import { PubSubService } from './services/common/pub-sub.service';
import { ContentService } from './services/content/content.service';
import { LoaderAriaOptions, LoaderService } from './services/loader/loader.service';
import { ExceptionHandlerService } from './utilities/exception/exception-handler.service';
import { ServiceLocator } from './utilities/service.locator';

const ERRORMSG = 'There was an error processing the request, please try again. If the problem persists please contact support.';
const OUTAGEMSG = 'OUTAGEMSG';
export class ServiceDetails {
  serviceName: string;
  featureName: string;
}

/**
 * All the component module should extend this abstract component. This would component,
 * will take care of,
 * 1. Showing the pre conten if available with template reference names as 'pre_content'
 * 2. has the messages object, which would be passed down from the page component.
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class AbstractComponent {

  private _componentLoadComplete = false;
  private messageAlertSvc: MessageAlertService;
  private loaderSvc: LoaderService;
  private exceptionHandlerSvc: ExceptionHandlerService;
  private analyticsSvc: AnalyticsService;

  _router: Router;
  pubSubSubscribe: PubSubService;

  @ViewChild('ariaLiveRegion', { read: ElementRef, static: false }) ariaLiveRegion: ElementRef<HTMLElement>;

  allMessages: Message[];

  messages: {
    [messageKey: string]: string
  } = {};

  labels: any = {};
  infos: any = {};
  errors: any = {};

  __logger: Logger = LoggerUtils.getInstance('AbstractComponent');


  get dataLoaded() {
    return this._componentLoadComplete;
  }

  set dataLoaded(value: boolean) {
    this._componentLoadComplete = value;
  }

  constructor(protected messageService?: ContentService, protected detectChangeRef?: ChangeDetectorRef) {
    if (!isEmpty(this.getRequiredKeysForMessages()) && this.messageService) {
      this.allMessages = this.messageService.getAllMessagesByKeys(this.getRequiredKeysForMessages());
      this.initMessages();
    }

    this.messageAlertSvc = ServiceLocator.injector.get(MessageAlertService);
    this.loaderSvc = ServiceLocator.injector.get(LoaderService);
    this._router = ServiceLocator.injector.get(Router);

    this.exceptionHandlerSvc = ServiceLocator.injector.get(ExceptionHandlerService);
    // this.pubSubSubscribe = ServiceLocator.injector.get(PubSubService);
    this.analyticsSvc = ServiceLocator.injector.get(AnalyticsService);
  }

  private initMessages() {
    if (isEmpty(this.allMessages)) {
      return;
    }
    this.allMessages.forEach(element => {
      if (isEmpty(element)) {
        return;
      }
      const messageKey = element.code;
      const messageText = element.text;
      this.messages[messageKey] = messageText;
    });
  }

  messageFor(key: string, paramsToReplace?: any): string {
    if(!this.messageService){
      throw new Error("Call the super class constructor with message service instance");
    }
    
    const message = this.messageService.getMessage(key);
    return (message) ? (paramsToReplace ? this._getMessageText(message.text, paramsToReplace) : message.text) : '';
  }

  /**
   * Subscribe to the various page events here
   */
  // protected subscribeToPageEvent(eventName: IonicLifeCyleName) {
  //   if (isEmpty(eventName)) {
  //     return;
  //   }

  //   const url = this._router.url;

  //   if (!url) {
  //     // very unlikely case
  //     this.logger.warn('no url available from router');
  //     return;
  //   }

  //   const urlPath = url.split(/[?#]/)[0];

  //   return this.pubSubSubscribe.subscribeTo(`${urlPath}-${eventName}`);
  // }

  getMessageDetails(key: string): Message {
    if(!this.messageService){
      throw new Error("Call the super class constructor with message service instance");
    }
    
    const message = this.messageService.getMessage(key);
    return message;
  }

  // Override this method to give the keys
  getRequiredKeysForMessages(): string[] {
    return [];
  }

  /**
   *
   * @param serviceToInvoke$ : the observable for which the loader and eror alert is added.
   * @param showLoader : set as `false` if the loader need not be shown. By default it's true
   * @param loaderType : two options are there `skeleton-text` OR `fullpage`.
   *  By default `skeleton-text` is used. This is considered only if the
   *  user has enabled the `showLoader`. Else it's not considered
   * @param showErrorMessage : if set to `false` displaying error message is not done here. Default is `true`
   * @param loadingTextKey : The key which is used to get the message to be displayed in case of a full screen load (the loading message)
   * @param liveRegionTextKey : The key for which the text is used to show the `aria-live` update text.
   * Make sure that you add `#ariaLiveRegion` as well on the component
   */
  protected invokeService<T>(serviceToInvoke$: Observable<T>,
                            showLoader = true,
                            loaderOptions: LoaderType | LoaderOption = 'skeleton-text',
                            showErrorMessage = true,
                            loadingTextKey?: string,
                            loaderAriaOptions?: LoaderAriaOptions,
                            serviceDetails?: ServiceDetails): Observable<T> {

    let observableRef: Observable<T>;
    let loaderType: LoaderType = 'skeleton-text';
    let forceDetectChanges = false;

    if (typeof loaderOptions === 'object') {
      loaderType = loaderOptions.loaderType ? loaderOptions.loaderType : loaderType;
      forceDetectChanges = loaderOptions.detectChanges ? loaderOptions.detectChanges : forceDetectChanges;
    } else {
      loaderType = loaderOptions ? loaderOptions : loaderType;
    }
    if (showLoader) {
      observableRef = this._showLoaderAndInvokeService(serviceToInvoke$, loaderType, loadingTextKey, loaderAriaOptions);
    } else {
      // caller mentioned not to use any loader, so we will call the service
      observableRef = serviceToInvoke$;
    }

    return observableRef.pipe(finalize(() => {
      if (showLoader) {
        this._hideLoader(loaderType);
        if (forceDetectChanges && this.detectChangeRef) {
          this.detectChangeRef.detectChanges();
        }
      }
    }), catchError((error) => {
      if (showErrorMessage) {
        this._showErrorAlert(error);
      }
      throw error;
    }));
  }

  protected trackEvent(eventType: EventType, analyticsData: AnalyticsData) {
    this.analyticsSvc.trackEvent(eventType, analyticsData);
  }

  private _isFeatureOut(serviceDetails: ServiceDetails): Observable<FeatureConfig> {
    return new Observable((subscriber) => {
      if (!serviceDetails || !serviceDetails.serviceName || !serviceDetails.featureName) {
        // no service details.. will show the error
        subscriber.next(undefined);
        subscriber.complete();
        return;
      }
    });
  }

  private _showLoaderAndInvokeService<T>(serviceToInvoke$: Observable<any>,
                                        loaderType: LoaderType,
                                        loadingTextKey?: string,
                                        loaderAriaOptions?: LoaderAriaOptions): Observable<T> {

    if (loaderType === 'skeleton-text') {
      this._componentLoadComplete = false;
      return serviceToInvoke$;
    } else {
      const loadingText = (loadingTextKey) ? this.messageFor(loadingTextKey) : undefined;
      return from(this.loaderSvc.open({ ariaOptions: loaderAriaOptions, messageText: loadingText })).pipe(mergeMap(() => serviceToInvoke$));
    }
  }

  protected showAlert(isError: boolean, messageText: string) {
    const message = new Message(messageText, (isError) ? MessageType.ERROR : MessageType.INFO);
    this.messageAlertSvc.showMessage(message);
  }

  // protected isFeatureEnabled(featureId: string): Observable<boolean> {
  //   return this.featureOutageService.isFeatureEnabled(featureId);
  // }

  private _hideLoader(loaderType: LoaderType) {
    if (loaderType === 'skeleton-text') {
      this._componentLoadComplete = true;
    } else {
      this.loaderSvc.close();
    }
  }

  private _addLiveUpdateContent(ariaLiveElement: HTMLElement, text: string) {
    ariaLiveElement.classList.add('visually-hidden');
    ariaLiveElement.innerHTML = text;
  }

  private _showErrorAlert(error: HttpErrorResponse) {
    const url = this._router.url;
    this.exceptionHandlerSvc.invokeHandler(url, error).pipe(
      tap((didHandle) => {
        if (!didHandle) {
          this.showAlert(true, ERRORMSG);
        }
      })
    ).subscribe();
    this.__logger.error('An error occured while for the service ', error);
  }

  private _getMessageText(messageText: string, paramsToReplace: any): string {
    return Utils.replaceVariablesInString(messageText, paramsToReplace);
  }

  scrollToElement(el: HTMLElement) {
    if (!el) {
      this.__logger.error('no element passed to scroll to');
      return;
    }
    if (el.tabIndex < 0) {
      el.tabIndex = -1;
      el.style.outline = 'none';
    }
    el.focus();
  }

}

type LoaderType = 'skeleton-text' | 'fullpage';

export class LoaderOption {
  loaderType: LoaderType;
  detectChanges: boolean;
}
