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
import { ComponentDialogService } from './service/component-dialog.service';
import { SharedModule } from '../../../../shared/storybook/shared.module';
import { RouterModule } from '@angular/router';
import { InputTextModule } from '../../input-text/input-text.module';

@Component({
  selector: 'app-test-component-dialog',
  template: `<div>
    <button mat-raised-button color="primary" (click)="openComponent()">
      Open Component Dialog
    </button>
  </div>`,
})
class TestComponentDialog implements OnInit {
  constructor(private _dialog: ComponentDialogService) {}

  ngOnInit() {}

  openComponent() {
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.maxHeight = '90vh';
    let dialogRef = this._dialog.openComponentDialog(
      ComponentDialog,
      matDialogConfig
    );
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
    });
  }
}

@Component({
  selector: 'app-component-dialog',
  template: `<h1>I am from component..!</h1>`,
})
class ComponentDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

export default {
  title: 'Material Dialog',
  component: TestComponentDialog,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [TestComponentDialog, ComponentDialog],
      imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatIconModule,
        SharedModule,
        RouterModule.forRoot([], { useHash: true }),
        InputTextModule,
      ],
      providers: [ComponentDialogService, MatIcon],
    }),
  ],
} as Meta;

const Template: Story<TestComponentDialog> = (args) => ({
  props: { ...args },
});

export const componentDialogTest = Template.bind({});
componentDialogTest.storyName = 'Component Dialog';
componentDialogTest.decorators = [
  componentWrapperDecorator(
    (story) => `<app-test-component-dialog></app-test-component-dialog>`
  ),
];
componentDialogTest.args = {};
