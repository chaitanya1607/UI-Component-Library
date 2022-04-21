/* eslint-disable @typescript-eslint/no-explicit-any */
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RichTextEditorComponent } from './rich-text-editor.component';
import { FormErrorsModule } from '../../form-errors/form-errors.module';

export default {
  title: 'Material Editor',
  component: RichTextEditorComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [RichTextEditorComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        FormErrorsModule,
      ],
    }),
  ],
} as Meta;

const formGroup = new FormGroup({
  input: new FormControl('John Doe', [Validators.required]),
});

const Template: Story<RichTextEditorComponent> = (args) => ({
  props: { ...args, formGroup },
});

export const BasicEditor = Template.bind({});
BasicEditor.args = {
  height: '300px',
  label: 'Sample label',
  required: true,
  initialValue: 'John Doe',
};

export const Formcontrol = Template.bind({});
Formcontrol.decorators = [
  componentWrapperDecorator(
    (story) =>
      `<form [formGroup]="formGroup">
      <app-rich-text-editor required="true" formControlName="input" height="300px"></app-rich-text-editor>
     </form>`
  ),
];
Formcontrol.args = {};
