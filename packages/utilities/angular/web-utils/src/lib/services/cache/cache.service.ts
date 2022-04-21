import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CacheService {
	private _storage: Storage | null = null;

	constructor(private storage: Storage) { 
		this.init();
	}

	
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

	getCacheData<T>(key: string): Observable<T> {
		const resultAsString = from(this._storage.get(key));
		return resultAsString.pipe(map(data=>(data) ? JSON.parse(data) : null))
	}

	// TODO we will add the code to consider cachePolicy
	storeCacheObjectData(key: string, value: any, cachePolicy: CachePolicy = 'expire-after-session') {
		if (!value) {
			return Promise.resolve();
		}
		return this.storeCacheData(key, JSON.stringify(value));
	}

	storeCacheData(key: string, value: string | any) {
		if (!value) {
			return;
		}

		typeof value === 'string' ? this._storage.set(key, value) : this._storage.set(key, JSON.stringify(value));
	}

	removeCacheData(key: string) {
		this._storage.remove(key);
	}
}

export type CachePolicy = 'expire-after-session' | 'no-expire';
