import { Directive, Input, OnInit } from '@angular/core';
import {
  AbstractComponent,
  ContentService,
  HttpCallType,
  IServiceConfig,
  JSON_CONTENT_TYPE,
  Locale,
  LocaleService,
  ServiceConfig,
} from '@utilities/angular-web-utils';

/**
 *
 * @description
 * A base component class that
 * 1. Extends Abstract component
 * 2. Initializes `ContentService`, `LocaleService`, `ServiceConfig`
 */
@Directive()
export class BaseComponent extends AbstractComponent {
  @Input() locales: Locale[] = [new Locale('US', 'en')];

  @Input() contexts: string[] = ['common'];

  constructor(
    contentService: ContentService,
    private localService: LocaleService,
    private svcConfig: ServiceConfig
  ) {
    super(contentService);
    this._registerServiceConfigurations();
    this._initializeLocaleService();
    this._loadMessages(contentService);
  }

  private _registerServiceConfigurations() {
    this._regsterGetMessagesService();
  }

  private _initializeLocaleService() {
    this.localService.initilize(this.locales);
  }

  private _loadMessages(contentService: ContentService) {
    contentService.loadMessages(null, null, this.contexts).subscribe();
  }

  private _regsterGetMessagesService() {
    const config: IServiceConfig = {
      serviceName: 'get-messages',
      url: '/messages/{jsonFileName}?version={version}',
      baseUrl: 'assets',
      hasPathParams: true,
      headers: JSON_CONTENT_TYPE,
      callType: HttpCallType.GET,
      responseType: 'json',
      isProtected: false,
    };
    this.svcConfig.registerServiceConfiguration([config]);
  }
}
