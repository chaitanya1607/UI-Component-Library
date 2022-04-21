import { Component, OnInit } from '@angular/core';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ConfirmationDialogService } from './service/confirmation-dialog.service';
import { ConfirmationDialogData } from './model/confirmation-dialog.model';
import { SharedModule } from '../../../../shared/storybook/shared.module';
import { ContentPipe } from '@utilities/angular-web-utils';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-confirm-dialog',
  template: `<div>
    <button mat-raised-button color="primary" (click)="openConfirmDialog()">
      Open Confirm Dialog
    </button>
  </div>`,
})
class ConfirmDialogStoryBookComponent implements OnInit {
  constructor(private _dialog: ConfirmationDialogService) {}

  ngOnInit() {}

  openConfirmDialog() {
    const options: ConfirmationDialogData = {
      titleKey: 'common.delete.title',
      messageKey: 'common.delete.message',
      type: 'Confirmation',
    };
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = options;

    let dialogAfterClosed = this._dialog.open(matDialogConfig);

    dialogAfterClosed.subscribe((confirmed) => {
      console.log(confirmed);
    });
  }
}

export default {
  title: 'Material Dialog',
  component: ConfirmDialogComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [
        ConfirmDialogComponent,
        ConfirmDialogStoryBookComponent,
        ContentPipe,
      ],
      imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatIconModule,
        SharedModule,
        RouterModule.forRoot([], { useHash: true }),
      ],
      providers: [ConfirmationDialogService, MatIcon],
    }),
  ],
} as Meta;

const Template: Story<ConfirmDialogStoryBookComponent> = (args) => ({
  props: { ...args },
});
export const confirmDialog = Template.bind({});
confirmDialog.storyName = 'Confirm Dialog';
confirmDialog.decorators = [
  componentWrapperDecorator(
    (story) => `<app-test-confirm-dialog></app-test-confirm-dialog>`
  ),
];
confirmDialog.args = {};
