import { Injectable } from '@angular/core';
import { Logger, LoggerUtils, Utils } from '@utilities/angular-utils';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { CacheService } from '../../services/cache/cache.service';

@Injectable({ providedIn: 'root' })
export class UserStore {

  private logger: Logger = LoggerUtils.getInstance('AuthService');

  private user$ = new BehaviorSubject<User>(null);

  constructor(private cacheService: CacheService) { }

  get userIsAuthenticated() {
    return this.user$.asObservable().pipe(
      map(user => {
        if (user) {
          return true; // !!user.lastAccess;
        } else {
          return false;
        }
      })
    );
  }

  get userIsGuest() {
    return this.user$.asObservable().pipe(
      map (user => {
        return user && user.isGuest;
      })
    );
  }

  get authenticatedUser() {
    return this.user$.asObservable().pipe(
      map(userData => userData)
    );
  }

  publishUserDetails(user: User) {
    this.user$.next(user);
  }

  storeAndPublishUserDetails(user: User, addToCache = false) {
    if (addToCache) {
      this.storeUserInCache(user);
    }
    this.user$.next(user);
  }

  /**
 * A method which can be used to get the user data of the logge in user.
 * This can be used only post login.
 * @param needToModify - `boolean` which tells whether the caller has intent to modify the returned user.
 *                        If intent is there, then a copy will be given to the caller so that the information
 *                        of user here is not mutated.
 */
  authenticatedUserData(needToModify = false): User {
    if (needToModify) {
      return cloneDeep(this.user$.getValue());
    }
    return this.user$.getValue();
  }

  public updateUserDetails(user: User) {
    const updatedDetails = Utils.difference(user, this.user$.getValue());

	this.logger.debug('differences in the user object while updating are ', updatedDetails);

    const currentUserInfo = this.user$.getValue();

    Object.assign(currentUserInfo, user);

    this.storeUserInCache(currentUserInfo);

    this.user$.next(currentUserInfo);
  }

  public getCachedUser(): Observable<User> {
    return from(this.cacheService.getCacheData('authData')).pipe(
      map((storedUserDetails) => {
        if (!storedUserDetails || !storedUserDetails) {
          return;
        }
        const user = Object.assign(new User(), storedUserDetails);

        return user;
      })
    );
  }

  private storeUserInCache(user: User) {
    this.cacheService.storeCacheObjectData('authData', user);
  }

}
