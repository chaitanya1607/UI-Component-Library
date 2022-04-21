import { CheckboxGroupComponent } from './checkbox-group.component';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CheckboxGroup } from '../check-box.model';

export default {
  title: 'Material Checkbox Group',
  component: CheckboxGroupComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [CheckboxGroupComponent],
      imports: [
        MatCheckboxModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }),
  ],
} as Meta;

const basicCheckboxGroup: CheckboxGroup = {
  selectAll: {
    name: 'select All',
    label: 'check boxes',
    checked: false,
    disabled: false,
  },
  items: [
    {
      name: 'check box 1',
      label: 'check boxes',
      checked: false,
      disabled: false,
    },
    {
      name: 'check box 2',
      label: 'check boxes',
      checked: false,
      disabled: false,
    },
    {
      name: 'check box 3',
      label: 'check boxes',
      checked: false,
      disabled: false,
    },
  ],
};

const formGroup = new FormGroup({
  checkbox: new FormControl(basicCheckboxGroup, Validators.required),
});

const Template: Story<CheckboxGroupComponent> = (args) => ({
  props: { ...args, formGroup, basicCheckboxGroup },
});

export const checkBoxGroup = Template.bind({});
checkBoxGroup.args = {
  label: 'Basic Checkbox Group',
  labelPosition: 'after',
  checkboxGroup: basicCheckboxGroup,
};

export const CheckboxFormControl = Template.bind({});
CheckboxFormControl.storyName = 'Associated with Form control';
CheckboxFormControl.decorators = [
  componentWrapperDecorator(
    (story) =>
      `<form [formGroup]="formGroup">
    <app-checkbox-group formControlName="checkbox" label="Basic Checkbox Group Associated with Form control" labelPosiion="before" [checkboxGroup]="basicCheckboxGroup"></app-checkbox-group>
  </form>`
  ),
];
CheckboxFormControl.args = {};
