/* eslint-disable @typescript-eslint/no-explicit-any */
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextComponent } from './input-text.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormErrorsModule } from '../../form-errors/form-errors.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export default {
  title: 'Material Input Text',
  component: InputTextComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [InputTextComponent],
      imports: [
        CommonModule,
        FormErrorsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
      ],
    }),
  ],
} as Meta;

const formGroup = new FormGroup({ input: new FormControl('John Doe') });

const Template: Story<InputTextComponent> = (args) => ({
  props: { ...args, formGroup },
});

export const BasicInput = Template.bind({});
BasicInput.args = {
  label: 'Enter your name',
  placeholder: 'eg: John Doe',
  required: true,
};

export const InputWithPrefixAndSuffixContent = Template.bind({});
InputWithPrefixAndSuffixContent.storyName = 'Prefix and Suffix content';
InputWithPrefixAndSuffixContent.args = {
  ...BasicInput.args,
  prefix: {
    text: 'Mr.',
  },
  suffix: {
    text: '(BA)',
  },
};

export const InputWithPrefixAndSuffixIcon = Template.bind({});
InputWithPrefixAndSuffixIcon.storyName = 'Prefix and Suffix icons';
InputWithPrefixAndSuffixIcon.args = {
  ...BasicInput.args,
  prefix: {
    iconName: 'person_outline',
  },
  suffix: {
    iconName: 'verified',
  },
};

export const InputWithClearOption = Template.bind({});
InputWithClearOption.storyName = 'Clear option';
InputWithClearOption.args = {
  ...BasicInput.args,
  clear: true,
};

export const InputWithReadonlyOption = Template.bind({});
InputWithReadonlyOption.storyName = 'Readonly';
InputWithReadonlyOption.args = {
  ...BasicInput.args,
  value: `Hi! I'm not editable`,
  readonly: true,
};

export const InputWithDisabledOption = Template.bind({});
InputWithDisabledOption.storyName = 'Disabled';
InputWithDisabledOption.args = {
  ...BasicInput.args,
  value: `Hi! I've been disabled`,
  disabled: true,
};

export const InputWithoutRequiredIndicator = Template.bind({});
InputWithoutRequiredIndicator.storyName = 'Without required indicator';
InputWithoutRequiredIndicator.args = {
  ...BasicInput.args,
  uiConfig: {
    hideRequiredMarker: true,
  },
};

export const InputWithOutlineAppearance = Template.bind({});
InputWithOutlineAppearance.storyName = 'Outline appearance';
InputWithOutlineAppearance.args = {
  ...BasicInput.args,
  uiConfig: {
    formFieldAppearance: 'outline',
  },
  initialValue: 'Hi',
};

export const InputWithAutocomplete = Template.bind({});
InputWithAutocomplete.storyName = 'Auto complete';
InputWithAutocomplete.args = {
  ...BasicInput.args,
  inputConfig: {
    autocomplete: 'username',
  },
};

export const InputWithFormControl = Template.bind({});
InputWithFormControl.storyName = 'Associated with Form control';
InputWithFormControl.decorators = [
  componentWrapperDecorator(
    (story) =>
      `<form [formGroup]="formGroup">
      <app-input-text formControlName="input" required="true" label="Username"></app-input-text>
     </form>`
  ),
];
InputWithFormControl.args = {};
