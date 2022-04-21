export class Email {
  toAdresses?: string[];
  subject: string;
  body: EmailBody;
  /**
   * @description
   * File containing the email addresses data 
   * Can use this to upload bulk data instead of manually entering email addresses
   */
  addressesData?: File;

  constructor() {
    this.toAdresses = [];
    this.body = new EmailBody();
  }
}

export class EmailBody {
  content: string;

  constructor(content?: string) {
    this.content = content;
  }
}

export class EmailConfig {
  /**
   * path for template which can be downloaded by user and modify data and upload using import option
   */
  pathForDownloadTemplate?: string;
  /**
   * @description
   * supported fileTypes for importing data
   */
  fileTypesForImport?: string[];
}
