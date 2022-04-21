import { Injectable } from '@angular/core';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { isEmpty } from 'lodash';
import { Locale } from '../../models/common.model';
import { DomUtils } from '../../utilities/dom-utils';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  private _logger: Logger = LoggerUtils.getInstance('LocaleService');
  private _LOCALE_COOKIE_NAME = 'APP_LOCALE';
  private _COOKIE_EXPIRY_IN_DAYS = 5;
  private supportedLocales: Locale[];

  private FALLBACK_LOCALE = 'en_US';

  constructor() { }

  public initilize(supportedLocales: Locale[]) {
    this.supportedLocales = supportedLocales.map(locale => new Locale(locale.countryCode, locale.languageCode));
  }

  public getLocale(): string {
    // TODO This logic needs to be changed when we have multiple locale supports
    if (!isEmpty(this.supportedLocales)) {
      // only one locale so set that as the default locale
      if (this.supportedLocales.length === 1) {
        return this.supportedLocales[0].getLocaleInString();
      } else {
        return this._getActiveLocale();
      }
    } else {
      this._logger.error('locales need to be initialized during the application startup. call initialize() method');
      return;
    }

  }

  private _getActiveLocale(): string {
    const localeFromCookie = DomUtils.readCookie(this._LOCALE_COOKIE_NAME);
    if (isEmpty(localeFromCookie)) {
      return this.supportedLocales[0].getLocaleInString();
    } else {
      return this.FALLBACK_LOCALE;
    }
  }

  public setCurrentLocale(locale: string, subDomain: string) {
    if (!locale) {
      this._logger.error(`no locale provided to set the currentLocale`);
    }

    DomUtils.setCookie(this._LOCALE_COOKIE_NAME, locale, this._COOKIE_EXPIRY_IN_DAYS, subDomain);
    // TODO: NEED TO REVISIT
    // this.caheService.storeCacheData(this._LOCALE_COOKIE_NAME, locale);
  }
}
