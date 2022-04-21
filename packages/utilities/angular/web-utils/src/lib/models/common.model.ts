import { isEmpty } from 'lodash';
export class Amount {
  constructor() {
    this.currency = new Currency();
  }
  currency: Currency;
  value: string;

  public add(amount: Amount): Amount {
    // TODO check for currency equality
    const sum = new Amount();
    sum.value = parseFloat(this.value ?? '0') + parseFloat(amount.value ?? '0') + '';
    return sum;
  }
}

export class Currency {
  code: string;
}

export class ReferenceData {
  name: string;
  value: string;
  description?: string;
}

export class State {
  code: string;
  name: string;
  id: string;
}

export class Coverage {
  coverageId: string;
  coverageName: string;
}

export class Account {
  accountName: string;
}

export class Party {
  userId?: number;
  firstName: string;
  middleName?: string;
  suffix: string;
  lastName?: string;
  isRegistered?: boolean;
  email?: string;
  dateOfBirth?: string;
  genderCode: string;
  gender: string;
  cif: string;
  relationShip: string;
  student: string;
  handicapped: string;

  static getFullName(party: Party) {
    let fullName = '';
    if (!isEmpty(party.firstName)) {
      fullName += party.firstName + ' ';
    }
    if (!isEmpty(party.middleName)) {
      fullName += party.middleName + ' ';
    }
    if (!isEmpty(party.lastName)) {
      fullName += party.lastName + ' ';
    }
    if (!isEmpty(party.suffix)) {
      fullName += party.suffix;
    }
    return fullName;
  }

  static getDob(party: Party) {
    return party.dateOfBirth;
  }
}

export class Comment {
  constructor(public text: string) { }
}

export interface BaseServiceResponse<T> {
  status?: ResponseStatusType;
  result?: T;
  messages?: Message[];
}

export type ResponseStatusType = 'ok' | 'failure';
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export enum Size {
  MB = 'MB',
  KB = 'KB'
}

export class Document {
  document?: File;
  documentName: string;
  documentSizeInBytes: number;
  documentId: string;
  documentPages?: number;
  documentType?: string;
  documentLocation?: string;

  get fileExtension(): string {
    return (!this.documentName) ? ''
      : this.documentName.substr(this.documentName.lastIndexOf('.') + 1).toLowerCase();
  }

  get fileNameWithoutExtension(): string {
    const documentName =  this.fileExtension === 'pdf' || 
                          this.fileExtension === 'png' || 
                          this.fileExtension === 'jpg' || 
                          this.fileExtension === 'jpeg' ?
                          this.documentName.substr(0, this.documentName.lastIndexOf('.')) : this.documentName;
    return documentName;
  }
}

export class AuthToken {
  token: string;
}

export class FeatureConfig {
  featureId: string;
  isEnabled: boolean;
  outageMessage: string;
  shouldShowOutageMessage: boolean;
}

export class MaintenanceStatus {
  constructor() {
    this.lastChecked = new Date(); // when we are creating an instance of this, it means, we are checking the maintenance status
  }
  isUnderMaintenance: boolean;
  lastChecked: Date; // the time when we last checked the maintenance status
}

export interface Preference {
  id: string;
  name: string;
  value: string;
}

export class FeatureOutageStatus extends MaintenanceStatus {
  constructor() {
    super();
  }
  featureOutages: FeatureConfig[];
}

export interface Icon {
  url?: string;
  cssClass?: string;  
  name?:string;
  color?:string;
}

export type StatusType = 'warning' | 'info' | 'error' | 'success' | 'fatal';

export enum MessageType {
  LABEL = 'LABEL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
}

export class Message {
  code: string;
  text: string;
  type: MessageType;

  constructor(text?: string, type?: MessageType) {
    this.text = text;
    this.type = type;
  }
}

export class Locale {
  countryCode: string;
  languageCode: string;
  default?: boolean;

  constructor(countryCode: string, languageCode?: string) {
    this.countryCode = countryCode;
    this.languageCode = languageCode;
  }

  static getLocaleForCode(code: string): Locale {
    const codeArray: string[] = code.split('-');
    if (codeArray.length > 0) {
      return new Locale(codeArray[0], codeArray[1]);
    }
    return new Locale(codeArray[0]);
  }

  getLocaleInString?(): string {
    return this.languageCode + '_' + this.countryCode;
  }

}
