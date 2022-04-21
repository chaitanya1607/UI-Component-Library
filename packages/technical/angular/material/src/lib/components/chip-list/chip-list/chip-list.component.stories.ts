import { Story, Meta } from '@storybook/angular/types-6-0';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ChipListComponent } from './chip-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChipItem } from '../chip-list-model';

export default {
  title: 'Chip List',
  component: ChipListComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatChipsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatAutocompleteModule,
      ],
    }),
  ],
} as Meta;

const chipsData: ChipItem[] = [{ value: 'completed' }];
const formGroup = new FormGroup({ chips: new FormControl(chipsData) });

const Template: Story<ChipListComponent> = (args) => ({
  props: { ...args, formGroup, chipsData },
});

export const ReadOnlyChips = Template.bind({});

ReadOnlyChips.args = {
  readonly: true,
  chips: [
    {
      value: 'pending',
    },
    {
      value: 'In-progress',
    },
    {
      value: 'completed',
    },
  ],
  iconName: 'filter_alt',
};

export const ChipsWithSelection = Template.bind({});

ChipsWithSelection.args = {
  readonly: false,
  chips: [
    {
      value: 'completed',
    },
  ],
  options: [
    {
      value: 'pending',
    },
    {
      value: 'In-progress',
    },
    {
      value: 'completed',
    },
  ],
  iconName: 'filter_alt',
};

export const ChipsWithFormControl = Template.bind({});

ChipsWithFormControl.decorators = [
  componentWrapperDecorator(
    (story) =>
      `<form [formGroup]="formGroup">
        <app-chip-list formControlName="chips"  [readonly]="false" iconName="filter_alt" ></app-chip-list>
       </form>`
  ),
];

ChipsWithFormControl.args = {};
