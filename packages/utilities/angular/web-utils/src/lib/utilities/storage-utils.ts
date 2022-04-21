
export class StorageUtils {
  private static _storageInstanceMap: Map<string, StorageUtils> = new Map();

  private _storageType: StorageType;

  constructor (storageType: StorageType) {
    (storageType) ? this._storageType = storageType : this._storageType = 'LOCAL';
  }

  static getInstance (storageType: StorageType) {
    let instance = StorageUtils._storageInstanceMap.get(storageType);
    if (instance) {
      return instance;
    }

    instance = new StorageUtils(storageType);

    StorageUtils._storageInstanceMap.set(storageType, instance);

    return instance;
  }

  /**
	 * Store the data for the storage.
	 * @param key
	 * @param data
	 */
  public saveData (key: string, data: any) {
    const stringifiedData = typeof data === 'object' ? JSON.stringify(data) : data;
    this._getStorage().setItem(key, stringifiedData);
  }

  /**
	 * Get the data from the storage.
	 * @param key
	 */
  public getData (key: string): any {
    const stringData = this._getStorage().getItem(key);
    if (!stringData) {
      return null;
    }
    return stringData;
  }

  /**
	 * Clear all the storage data.
	 * @returns
	 */
  public clearAll () {
    return this._getStorage().clear();
  }

  public removeItem (key: string) {
    return this._getStorage().removeItem(key);
  }

  public removeItems (keys: string[]) {
    if (!keys || keys.length === 0) {
      return;
    }
    keys.forEach((key) => this.removeItem(key));
  }

  private _getStorage (): Storage {
    if (this._storageType === 'SESSION') {
      return window.sessionStorage;
    } else if (this._storageType === 'LOCAL' || this._storageType === 'DEFAULT') {
      return window.localStorage;
    }
    return window.localStorage;
  }
}

export type StorageType = 'SESSION' | 'LOCAL' | 'DEFAULT';
