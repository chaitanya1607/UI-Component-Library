import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../models/common.model';
import { ContentService } from '../../services/content/content.service';
import { LocaleService } from '../../services/locale/locale.service';
import { ApplicationDetailsProviderService, APP_DETAILS_PROVIDER } from './application-details-provider.service';

/**
 * A message resolver, that helps to load the labels and error messages needed for a page.
 * All the pages of the applications are configured with this message resolver in the router. The page details are are obtained using
 * the page config service. So configuring the page is mandatory in the page_config .ts file.
 */
@Injectable({
  providedIn: 'root',
})
export class ContentResolver implements Resolve<Observable<Message[]>> {
  private logger: Logger = LoggerUtils.getInstance('ContentResolver');

  constructor(
    private messageService: ContentService,
    private localeService: LocaleService,
    @Optional()
    @Inject(APP_DETAILS_PROVIDER)
    private appDetailsProvider?: ApplicationDetailsProviderService
  ) {}

  resolve(router: ActivatedRouteSnapshot, routerState: RouterStateSnapshot): Observable<Message[]> {
    let moduleName: string = router.data.moduleName;
    let moduleNames: string[] = router.data.moduleNames;
    const appDetails = this.appDetailsProvider?.getApplicationName();

    if (appDetails && appDetails.name) {
      return this.messageService
        .loadMessages(
          `${moduleName}-${appDetails.name.toLowerCase()}`,
          this.localeService.getLocale(),
          moduleNames?.map((name) => `${name}-${appDetails.name.toLowerCase()}`)
        )
        .pipe(
          catchError((error) => {
            this.logger.warn(`error while loading the application from context [${appDetails.name.toLowerCase()}]`, error);
            return this.messageService.loadMessages(moduleName, this.localeService.getLocale(), moduleNames);
          })
        );
    } else {
      return this.messageService.loadMessages(moduleName, this.localeService.getLocale(), moduleNames);
    }
  }
}
