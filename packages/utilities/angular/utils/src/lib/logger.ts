export enum LogLevel {
  off,
  Error,
  Warning,
  Info,
  Debug
}

/**
* @usage
*
* ``` typescript
* private _logger: Logger = LoggerUtils.getInstance('Class Name');
*
* someFunction() {
*  logger.debug('Text', Object);
*  logger.info('Text', Object);
*  logger.warn('Text', Object);
*  logger.error('Text', Object);
* }
* ```
*/

export class Logger {
  static level = LogLevel.Debug;

  private source: string;

  constructor (source: string) {
      this.source = source;
  }

  public debug (...objects: any[]): void {
      this.log(console.log, LogLevel.Debug, objects);
  }

  public info (...objects: any[]): void {
      this.log(console.log, LogLevel.Info, objects);
  }

  public warn (...objects: any[]): void {
      this.log(console.warn, LogLevel.Warning, objects);
  }

  public error (...objects: any[]): void {
      this.log(console.error, LogLevel.Error, objects);
  }

  public enabledLogMode (): void {
      if (!this.isLoggerEnabled()) {
          console.log(
              '%c%s',
              `
                  color: #fff;
                  font-size: 6em;
                  font-weight: bold;
                  font-family: Helvetica;
                  text-shadow: 0 1px 0 #CCCCCC,
                  0 2px 0 #c9c9c9,
                  0 3px 0 #bbb,
                  0 4px 0 #b9b9b9,
                  0 5px 0 #aaa,
                  0 6px 1px rgba(0,0,0,.1),
                  0 0 5px rgba(0,0,0,.1),
                  0 1px 3px rgba(0,0,0,.3),
                  0 3px 5px rgba(0,0,0,.2),
                  0 5px 10px rgba(0,0,0,.25),
                  0 10px 10px rgba(0,0,0,.2),
                  0 20px 20px rgba(0,0,0,.15),
                  0px 13px 11px rgba(7,23,23,0.55);
              `,
              'Devmode On!'
          );
      } else if (this.isLoggerEnabled()) {
          console.log(
              `
                  %c
                      Warning!
                  %c
                      Are you sure, that you want to use the console? It could be dangerous you know.
                  %c
                      Scam Warning: Take care when pasting things you don’t understand.
                      This could allow attackers to steal your identity or take control of your computer.
                  `,
              `
                      color: #bc2e1e;
                      font-size: 6em;
                      font-weight: bold;
                      font-family: Helvetica;
                      text-shadow: 0 1px 0px #378ab4,
                      1px 0 0px #5dabcd,
                      1px 2px 1px #378ab4,
                      2px 1px 1px #5dabcd,
                      2px 3px 2px #378ab4,
                      3px 2px 2px #5dabcd,
                      3px 4px 2px #378ab4,
                      4px 3px 3px #5dabcd,
                      4px 5px 3px #378ab4,
                      5px 4px 2px #5dabcd,
                      5px 6px 2px #378ab4,
                      6px 5px 2px #5dabcd,
                      6px 7px 1px #378ab4,
                      7px 6px 1px #5dabcd,
                      7px 8px 0px #378ab4,
                      8px 7px 0px #5dabcd,
                      5px 2px 9px rgba(186,186,186,0);
                  `,
              `
                      color: grey;
                      font-size: 1.5em;
                      font-style: italic;
                  `,
              `
                      color: red;
                      font-size: 1.5em;
                      font-style: italic;
                  `
          );
      }
  }

/**
 * Logger is enabled only if specifically mentioned in the local storage.
 */
  private isLoggerEnabled (): boolean {
      // if (typeof window === 'undefined') {
      //     return true;
      // }
      // const enableLogger: string = window.parent.localStorage.getItem('enableLogger');
      // return (enableLogger && enableLogger === 'true');
      return true;
  }



  private log (func: any, level: LogLevel, objects: any[]) {
      if (level <= Logger.level) {
          const log = this.source ? ['[' + this.source + ']'].concat(objects) : objects;
          if (this.isLoggerEnabled()) {
              func.apply(console, log);
          }
      }
  }

}

export const LoggerUtils = {
  getInstance (className: string): Logger {
      return new Logger(className);
  }
};
