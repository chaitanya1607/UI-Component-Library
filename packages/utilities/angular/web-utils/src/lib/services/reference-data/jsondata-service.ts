import { Injectable } from '@angular/core';
import { Logger, LoggerUtils } from '@utilities/angular-utils';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceInvoker } from '../../service-invoker';
import { BaseService } from '../../services/base.service';
import { DomUtils } from '../../utilities/dom-utils';

@Injectable({
  providedIn: 'root'
})
export class JSONDataService extends BaseService {

  private _logger: Logger = LoggerUtils.getInstance('JSONDataService');

  constructor(private serviceInvoker: ServiceInvoker) {
    super();
  }

  /**
   * Get the static JSON file from the `assets/get-staticjson-data` folder.
   * @param pathInAssets  This should be the relative path in the `assets/service-data` folder. For example
   * `claim-document-items/life.json`.
   * @param loadFromRemoteApp Whether the data should be loaded from the remote application. If it's set to `true`,
   *                          we construct a URL to the remote application to load it. It helps to avoid making app releases
   *                          for reference data changes
   */
  getData<T>(pathInAssets: string, loadFromRemoteApp = false): Observable<T> {
    let relativePathInAssets = pathInAssets;
    if (relativePathInAssets.startsWith('/')) {
      relativePathInAssets = relativePathInAssets.substr(1);
    }
    if (!relativePathInAssets.toLowerCase().endsWith('.json')) {
      relativePathInAssets = relativePathInAssets + '.json';
    }

    this._logger.debug(`getting the data from the relative path in assets [${relativePathInAssets}]. 
											Original path provided is [${pathInAssets}]`);

    const data = {
      staicFilePath: relativePathInAssets,
      version: DomUtils.getVersion().buildTS
    };

    const serviceName = loadFromRemoteApp ? 'get-json-data-remote-app' : 'get-json-data';

    return this.serviceInvoker.invokeService(serviceName, data)
															.pipe(
																		map((response) => response),
																		catchError(this.handleError.bind(this)));
  }
}
