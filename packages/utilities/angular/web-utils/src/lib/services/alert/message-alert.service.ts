import { Injectable } from '@angular/core';
import { Message, MessageType } from '../../models/common.model';
import { ToastMessageService, ToastType } from '../../services/alert/toast-message.service';

@Injectable({
  providedIn: 'root'
})
export class MessageAlertService {

  constructor(private toastService: ToastMessageService) { }

  public showMessage(message: Message, 
					title?: string, 
					position?: Position, 
					duration?: number, 
					isAlert?: boolean, 
					delayInAnnounceMessage?: number, 
					closeOnNavigation?: boolean ) {

    duration = duration !== undefined ? duration : 10000;
    duration = duration === 0 ? undefined : duration;
    position = (!position) ? 'bottom' : position;
    title = (!title) ? '' : title;
    isAlert = isAlert === undefined ? true : isAlert;
    closeOnNavigation = closeOnNavigation === undefined ? true : closeOnNavigation;
    delayInAnnounceMessage = delayInAnnounceMessage === undefined ? 0 : delayInAnnounceMessage;
	
    this.toastService.show(this._getColorForMessage(message), 
							title, 
							message.text, 
							duration, 
							position, 
							isAlert, 
							delayInAnnounceMessage, 
							closeOnNavigation);
  }

  public dismissMessage() {
    this.toastService.dismiss();
  }

  private _getColorForMessage(message: Message): ToastType {
    switch (message.type) {
      case MessageType.ERROR:
        return 'danger';

      case MessageType.INFO:
        return 'primary';

      case MessageType.WARNING:
        return 'warning';

      default:
        return 'success';
    }
  }
}

export type Position = 'top' | 'bottom' | 'middle';

export interface ToastHandler {
  side: 'start' | 'end';
  icon: string;
  text: string;
  handler: () => void;
}
