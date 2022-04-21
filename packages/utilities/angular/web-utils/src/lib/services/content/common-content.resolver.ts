import { Injectable } from '@angular/core';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../../models/common.model';
import { LocaleService } from '../locale/locale.service';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root',
})
export class CommonContentResolverService {
  private logger: Logger = LoggerUtils.getInstance('CommonContentResolverService');

  constructor(private messageService: ContentService, private localeService: LocaleService) {}

  loadCommonContent(appName?: string): Observable<Message[]> {
    this.logger.debug(`loading the common messages. consider app? [${appName}]`);

    return this.messageService.loadMessages(appName ? `common-${appName.toLowerCase()}` : 'common', this.localeService.getLocale()).pipe(
      catchError((error) => {
        this.logger.warn('error while getting the message for app ', appName, error);
        return this.messageService.loadMessages('common', this.localeService.getLocale());
      })
    );
  }
}
