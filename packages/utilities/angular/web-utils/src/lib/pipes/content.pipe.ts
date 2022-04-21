import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '@utilities/angular-utils';
import { ContentService } from '@utilities/angular-web-utils';

@Pipe({
  name: 'contentFor',
})
export class ContentPipe implements PipeTransform {
  constructor(private contentService: ContentService) {}
  transform(value: string, ...args: any[]): string {
    if (value) {
      const message = this.contentService.getMessage(value);
      if (message) {
        if (args && args.length > 0) {
          message.text = this.replaceAllParams(message.text, args);
        }
        return message.text;
      } else {
        return '';
      }
    }
  }

  replaceAllParams(messageText: string, params: any[]): string {
    params.forEach((param) => {
      messageText = Utils.replaceVariablesInString(messageText, param);
    });
    return messageText;
  }
}
