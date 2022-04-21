export class InformationDialogData {
  /**
   * @description takes mat-icon name as string
   */
  icon?: string;

  /**
   * @description key to get the message
   */
  messageKey: string;
  /**
   * @description key to get the close button text
   */
  closeButtonTextKey?: string;
  type: InformationDialogType;
}

export type InformationDialogType =
  | 'Success'
  | 'Error'
  | 'Information'
  | 'Warn';

export type IconColor = 'primary' | 'accent' | 'warn';
