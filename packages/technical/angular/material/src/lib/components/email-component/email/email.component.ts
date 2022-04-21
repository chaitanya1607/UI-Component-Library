import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UIConfig } from '../../input-text/input-text.model';
import { Email, EmailBody, EmailConfig } from '../email-component.model';
import {
  ContentService,
  LocaleService,
  ServiceConfig,
} from '@utilities/angular-web-utils';
import { ChipItem } from '../../chip-list/chip-list-model';
import { BaseComponent } from '../../core/base.component';

class EmailComponentInput {
  toAddresses?: ChipItem[];
  subject: string;
  body: string;
  addressesData?: File;
}

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailComponent extends BaseComponent implements OnInit {
  /**
   * @description initial value for the component
   */
  @Input() initialValue: Email;

  /**
   * @description configurations for the email
   */
  @Input() emailConfig: EmailConfig;

  /**
   * @description any instructions which needs to be show below the email body field
   */
  @Input() emailInstructions?: string;

  /**
   * @description event which will be emitted on click of send button
   * emits `Email` object
   */
  @Output() sendEvent: EventEmitter<Email>;

  /**
   * @description event which will be emitted on click of cancel button
   */
  @Output() cancelEvent: EventEmitter<string>;

  /**
   * @description
   * event which will be emitted when file is imported
   */
  @Output() fileImportedEvent: EventEmitter<File>;

  public emailInput: EmailComponentInput;

  public importFileErrorMsg: string;

  public readonly acceptedFileTypes = [
    '.csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  constructor(
    contentService: ContentService,
    localService: LocaleService,
    svcConfig: ServiceConfig
  ) {
    super(contentService, localService, svcConfig);
    this.sendEvent = new EventEmitter<Email>();
    this.cancelEvent = new EventEmitter<string>();
    this.fileImportedEvent = new EventEmitter<File>();
  }

  ngOnInit(): void {
    this._setInitialValues();
  } 

  get uiConfigForInputComponent(): UIConfig {
    return {
      formFieldAppearance: 'outline',
    };
  }

  get labelForToField(): string {
    return this.messageFor('email.to');
  }

  get labelForSubjectField(): string {
    return this.messageFor('email.subject');
  }

  get labelForImportDataBtn(): string {
    return this.messageFor('email.importData');
  }

  get labelForDownloadTemplateOption(): string {
    return this.messageFor('email.downloadTemplate');
  }

  get orLabel(): string {
    return this.messageFor('common.or');
  }

  get cancelLabel(): string {
    return this.messageFor('common.cancel');
  }

  get sendLabel(): string {
    return this.messageFor('email.send');
  }

  get importFileInvalidTypeMsg(): string {
    return this.messageFor('email.importData.invalidFileType');
  }

  get acceptedTypes(): string[] {
    if (this.emailConfig?.fileTypesForImport?.length >0) {
      return this.emailConfig.fileTypesForImport;
    }
    return this.acceptedFileTypes;
  }

  /**
   * On upload of a file, this method will be called
   * @param event
   */
  onFileUpload(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.importFileErrorMsg = '';
      this.emailInput.addressesData = null;

      const fileType = file.type;
      if (!this.acceptedTypes.includes(fileType)) {
        this.importFileErrorMsg = this.importFileInvalidTypeMsg;
      } else {
        this.emailInput.addressesData = file;
      }

      this.fileImportedEvent.emit(file);
    }
  }

  /**
   * called when user clears the imported file
   */
  removeImportedDataFile() {
    this.emailInput.addressesData = null;
  }

  /**
   * when send button is clicked, event with email value will be emitted
   */
  sendEmail() {
    const email = this._mapEmailInputToEmail(this.emailInput);
    this.sendEvent.emit(email);
  }

  /**
   * when cancel button is clicked, event with value as `Cancelled` will be emitted
   */
  cancelSendingEmail() {
    this.cancelEvent.emit('cancelled');
  }

  /**
   * Checks whether all the required data is provided or not and returns boolean based on it.
   * @returns `boolean`
   */
  isDataInvalid(): boolean {
    return !(this.emailInput.addressesData || this.emailInput.toAddresses?.length > 0);
  }

  //<--------------------------private methods------------------------>

  /**
   * Initializes the component values
   */
  private _setInitialValues() {
    this.emailInput = new EmailComponentInput();
    if (this.initialValue) {
      this._mapEmailToEmailComponentInput(this.initialValue, this.emailInput);
    }
  }

  /**
   * @description
   * Maps `Email` to `EmailComponentInput` 
   * @param email of type `Email`
   * @param emailInput of type `EmailComponentInput`
   * @returns `EmailComponentInput`
   */
  private _mapEmailToEmailComponentInput(email:Email, emailInput?: EmailComponentInput) {
    emailInput = emailInput || new EmailComponentInput();

    if (!email) {
      return emailInput;
    }
    emailInput.toAddresses = email.toAdresses?.map((address) => new ChipItem(address));
    emailInput.body = email.body?.content;
    emailInput.addressesData = email.addressesData;
    emailInput.subject = email.subject;

    return emailInput;
  }

  /**
   * @description
   * Maps `EmailComponentInput` to `Email`
   * @param emailInput of type `EmailComponentInput`
   * @returns `Email`
   */
  private _mapEmailInputToEmail(emailInput: EmailComponentInput): Email {
    const email = new Email();
    email.addressesData = emailInput.addressesData;
    email.body = new EmailBody(emailInput.body);
    email.subject = emailInput.subject;
    if (!emailInput.addressesData) {
      email.toAdresses = emailInput.toAddresses.map((chipItem) => chipItem.value);
    }

    return email;
  }
}
