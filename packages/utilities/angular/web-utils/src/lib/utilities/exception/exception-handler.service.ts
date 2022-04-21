import { Injectable, Type } from '@angular/core';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExceptionHandlerService {
  private logger: Logger = LoggerUtils.getInstance('ExceptionHandlerService');
  private EXCEPTION_HANDLER_CONFIG: Map<string, ExceptionHandlerConfig> = new Map<string, ExceptionHandlerConfig>();

  public registerConfig(exceptionHandlerConfigs: ExceptionHandlerConfig[]) {
    if (isEmpty(exceptionHandlerConfigs)) {
      this.logger.error('exception handler configurations passed to config registry is empty');
      return;
    }

    exceptionHandlerConfigs.forEach((exceptionHandlerConfig) => {
      if (!isEmpty(this.EXCEPTION_HANDLER_CONFIG.get(exceptionHandlerConfig.path))) {
        this.logger.warn('exception handler configuration cofiguration with path [', exceptionHandlerConfig.path, '] ' +
          'is already available in the context. We will override with this new configuration');
      }
      this.EXCEPTION_HANDLER_CONFIG.set(exceptionHandlerConfig.path, exceptionHandlerConfig);
    });
  }

  /**
   * If returns `false` then the custom handler not availble to invoke, otherwise returns `true`.
   * If `false` is returned, use the default handler to handle the exception
   * @param path
   * @param error
   */
  public invokeHandler(path: string, error: any): Observable<boolean> {
    let exceptionHandlerConfig: ExceptionHandlerConfig;

    for (const [key, value] of this.EXCEPTION_HANDLER_CONFIG.entries()) {
      if (path.indexOf(key) > -1) {
        exceptionHandlerConfig = value;
        break;
      }
    }

    if (!exceptionHandlerConfig || !exceptionHandlerConfig.exceptionHandler) {
      // tslint:disable-next-line: deprecation not deprecated actually, bug in tslint
      return of(false);
    }

    const errorHandler: Type<ExceptionHandler> = exceptionHandlerConfig.exceptionHandler;
    const errorHandlerInstance = new errorHandler();
    return errorHandlerInstance.handleError(error);
  }
}

export interface ExceptionHandlerConfig {
  path: string;
  exceptionHandler: Type<ExceptionHandler>;
}

export interface ExceptionHandler {
  handleError(error: any): Observable<boolean>;
}
