export class ConfirmationDialogData {
  /**
   * @description key to get the title
   */
  titleKey?: string;
  /**
   * @description key to get the message
   */
  messageKey: string;
  /**
   * @description key to get the confirm button text
   */
  confirmButtonTextKey?: string;
  /**
   * @description key to get the cancle button text
   */
  cancelButtonTextKey?: string;
  type: ConfirmationDialogType;
}

export type ConfirmationDialogType = 'Confirmation' | 'Alert';
