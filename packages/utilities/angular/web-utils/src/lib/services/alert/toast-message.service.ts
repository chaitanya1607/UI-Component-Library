import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// TODO We need to have a subscriber for this which shows the toast messages
@Injectable({providedIn:'root'})
export class ToastMessageService {

  dismissSubject: BehaviorSubject<boolean>;
  dismissToast$: Observable<boolean>;

  subject: BehaviorSubject<Toast>;
  toast$: Observable<Toast>;

  constructor() {
    this.subject = new BehaviorSubject<Toast>(null);
    this.toast$ = this.subject.asObservable()
      .pipe(filter(toast => toast !== null));

    this.dismissSubject = new BehaviorSubject<boolean>(null);
    this.dismissToast$ = this.dismissSubject.asObservable().pipe(filter(value => value !== null));
   }

   show(type: ToastType,
		title?: string,
		body?: string,
		delay?: number,
		position?: PositionType,
		isAlert?: boolean,
		delayInAnnounceMessage?: number,
		closeOnNavigation?: boolean ) {
    this.subject.next({ type, title, body, delay, position, isAlert, delayInAnnounceMessage, closeOnNavigation });
  }

  dismiss() {
    this.dismissSubject.next(true);
  }

}


export interface Toast {
  type: ToastType;
  title: string;
  body: string;
  delay: number;
  /**
   * duration to show the toast message in ms
   */
  duration?: number; // TODO discuss if this is same as delay above
  position: PositionType;
  isAlert: boolean;
  delayInAnnounceMessage: number;
  closeOnNavigation: boolean;
}

export type ToastType = 'success' | 'light' | 'warning' | 'primary' | 'dark' | 'medium' | 'danger';

export type PositionType = 'top' | 'bottom' | 'middle';

