import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PubSubService {

  private _subject: Subject<any>;

  constructor() {
    this._subject = new Subject();
  }

  publish<T>(topicName: string, data?: T): void {
    this._subject.next({key: topicName, data});
  }

  subscribeTo<T>(topicName: string ): Observable<T> {
    return this._subject.asObservable().pipe(
      filter(event => event.key === topicName),
      map(event =>  event.data as T)
    );
  }

}
