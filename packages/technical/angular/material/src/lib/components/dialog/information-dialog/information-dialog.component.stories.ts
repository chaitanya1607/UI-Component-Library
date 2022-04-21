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
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { InformationDialogComponent } from './information-dialog.component';
import { InformationDialogService } from './service/information-dialog.service';
import { InformationDialogData } from './model/information-dialog.model';
import { SharedModule } from '../../../../shared/storybook/shared.module';
import { ContentPipe } from '@utilities/angular-web-utils';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-information-dialog',
  template: `<div>
    <button mat-raised-button color="primary" (click)="openInformtionDialog()">
      Open Informtion Dialog
    </button>
  </div>`,
})
class InformationDialogStoryBookComponent implements OnInit {
  constructor(private _dialog: InformationDialogService) {}

  ngOnInit() {}

  openInformtionDialog() {
    const options: InformationDialogData = {
      icon: 'info',
      messageKey: 'common.info',
      closeButtonTextKey: 'common.close',
      type: 'Information',
    };
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = options;

    let dialogAfterClosed = this._dialog.open(matDialogConfig);

    dialogAfterClosed.subscribe((res) => {
      console.log(res);
    });
  }
}

@Component({
  selector: 'app-test-success-dialog',
  template: `<div>
    <button mat-raised-button color="primary" (click)="openSuccessDialog()">
      Open Success Dialog
    </button>
  </div>`,
})
class SucessDialogStoryBookComponent implements OnInit {
  constructor(private _dialog: InformationDialogService) {}

  ngOnInit() {}

  openSuccessDialog() {
    const options: InformationDialogData = {
      icon: 'check_circle',
      messageKey: 'common.success',
      closeButtonTextKey: 'common.close',
      type: 'Success',
    };

    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = options;

    let dialogAfterClosed = this._dialog.open(matDialogConfig);

    dialogAfterClosed.subscribe((res) => {
      console.log(res);
    });
  }
}

@Component({
  selector: 'app-test-error-dialog',
  template: `<div>
    <button mat-raised-button color="primary" (click)="openErrorDialog()">
      Open Error Dialog
    </button>
  </div>`,
})
class ErrorDialogStoryBookComponent implements OnInit {
  constructor(private _dialog: InformationDialogService) {}

  ngOnInit() {}

  openErrorDialog() {
    const options: InformationDialogData = {
      messageKey: 'common.error',
      type: 'Error',
    };
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = options;

    let dialogAfterClosed = this._dialog.open(matDialogConfig);

    dialogAfterClosed.subscribe((res) => {
      console.log(res);
    });
  }
}

@Component({
  selector: 'app-test-warn-dialog',
  template: `<div>
    <button mat-raised-button color="primary" (click)="openWarnDialog()">
      Open Warn Dialog
    </button>
  </div>`,
})
class WarnDialogStoryBookComponent implements OnInit {
  constructor(private _dialog: InformationDialogService) {}

  ngOnInit() {}

  openWarnDialog() {
    const options: InformationDialogData = {
      messageKey: 'common.warn',
      type: 'Warn',
    };
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = options;

    let dialogAfterClosed = this._dialog.open(matDialogConfig);

    dialogAfterClosed.subscribe((res) => {
      console.log(res);
    });
  }
}

export default {
  title: 'Material Dialog',
  component: InformationDialogComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [
        InformationDialogComponent,
        InformationDialogStoryBookComponent,
        InformationDialogStoryBookComponent,
        SucessDialogStoryBookComponent,
        ErrorDialogStoryBookComponent,
        WarnDialogStoryBookComponent,
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
      providers: [InformationDialogService, MatIcon],
    }),
  ],
} as Meta;

const Template: Story<InformationDialogStoryBookComponent> = (args) => ({
  props: { ...args },
});

export const InformationDialog = Template.bind({});
InformationDialog.storyName = 'information Dialog';
InformationDialog.decorators = [
  componentWrapperDecorator(
    (story) => `<app-test-information-dialog></app-test-information-dialog>`
  ),
];
InformationDialog.args = {};

export const successDialog = Template.bind({});
successDialog.storyName = 'Success Dialog';
successDialog.decorators = [
  componentWrapperDecorator(
    (story) => `<app-test-success-dialog></app-test-success-dialog>`
  ),
];
successDialog.args = {};

export const errorDialog = Template.bind({});
errorDialog.storyName = 'Error Dialog';
errorDialog.decorators = [
  componentWrapperDecorator(
    (story) => `<app-test-error-dialog></app-test-error-dialog>`
  ),
];
errorDialog.args = {};

export const warnDialog = Template.bind({});
warnDialog.storyName = 'Warn Dialog';
warnDialog.decorators = [
  componentWrapperDecorator(
    (story) => `<app-test-warn-dialog></app-test-warn-dialog>`
  ),
];
warnDialog.args = {};
