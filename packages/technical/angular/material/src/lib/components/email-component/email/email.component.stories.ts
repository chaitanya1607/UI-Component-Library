import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { FormErrorsModule } from '../../form-errors/form-errors.module';
import { InputTextModule } from '../../input-text/input-text.module';
import { RichTextEditorModule } from '../../rich-text-editor/rich-text-editor.module';
import { EmailComponent } from './email.component';
import { ChipListModule } from '../../chip-list/chip-list.module';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../../../shared/storybook/shared.module';
import {MatMenuModule} from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

export default {
  title: 'Email Component',
  component: EmailComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [EmailComponent],
      imports: [
        CommonModule,
        FormErrorsModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        RichTextEditorModule,
        MatButtonModule,
        ChipListModule,
        MatIconModule,
        SharedModule,
        MatMenuModule,
        MatDividerModule
      ],
    }),
  ],
} as Meta;

const Template: Story<EmailComponent> = (args) => ({
  props: { ...args },
});

export const Basic = Template.bind({});
Basic.args = {};

export const WithInitialValue = Template.bind({});

WithInitialValue.args = {
  initialValue: {
    toAdresses: ['d@gmail.com', 'p@gmail.com'],
    subject: 'Tetsing',
    body: {
      content: 'Test mail',
    },
  },
  emailInstructions: 'Test instructions',
};
