import { CheckBoxComponent } from './checkbox.component';
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
export default {
  title: 'Material Checkbox',
  component: CheckBoxComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [CheckBoxComponent],
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

const formGroup = new FormGroup({
  checkbox: new FormControl('', Validators.required),
});

formGroup.get('checkbox').disable();

const Template: Story<CheckBoxComponent> = (args) => ({
  props: { ...args, formGroup },
});

export const checkBox = Template.bind({});
checkBox.args = {
  label: 'check box 1',
  checked: false,
  disabled: true,
  labelPosition: 'after',
};

export const CheckboxFormControl = Template.bind({});
CheckboxFormControl.storyName = 'Associated with Form control';
CheckboxFormControl.decorators = [
  componentWrapperDecorator(
    (story) =>
      `<form [formGroup]="formGroup">
    <app-checkbox formControlName="checkbox" label="Checkbox 1" disabled="false"  labelPosition="before" value="false" checked="true"></app-checkbox>
  </form>`
  ),
];
CheckboxFormControl.args = {};
