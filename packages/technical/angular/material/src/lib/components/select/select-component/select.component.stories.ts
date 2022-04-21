import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { List } from 'immutable';
import { SelectConfig } from '../select.model';
import { SelectComponent } from './select.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export default {
  title: 'Material Select',
  component: SelectComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [SelectComponent],
      imports: [
        MatSelectModule,
        ScrollingModule,
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        MatAutocompleteModule,
      ],
    }),
  ],
} as Meta;

const data = List([
  { value: 'steak-0', name: 'Steak' },
  { value: 'pizza-1', name: 'Pizza' },
  { value: 'tacos-2', name: 'Tacos' },
  { value: 'steak-01', name: 'Steak1' },
  { value: 'pizza-11', name: 'Pizza1' },
  { value: 'tacos-21', name: 'Tacos1' },
]);
const formGroup = new FormGroup({ select: new FormControl(data.get(0)) });

const Template: Story<SelectComponent> = (args) => ({
  props: { ...args, formGroup, data },
});

export const Basic = Template.bind({});

const dropDownConfig: SelectConfig = {
  appearance: 'outline',
};

Basic.args = {
  placeholder: 'select item',
  label: 'Basic Component',
  config: dropDownConfig,
  dataSource: List([
    { value: 'steak-0', name: 'Steak' },
    { value: 'pizza-1', name: 'Pizza' },
    { value: 'tacos-2', name: 'Tacos' },
    { value: 'steak-01', name: 'Steak1' },
    { value: 'pizza-11', name: 'Pizza1' },
    { value: 'tacos-21', name: 'Tacos1' },
  ]),
  multiple: false,
};

export const OptionGroup = Template.bind({});

const config: SelectConfig = {
  appearance: 'outline',
  isVirtualScroll: false,
};

OptionGroup.args = {
  placeholder: 'select item',
  label: 'Option Group Component',
  config: config,
  dataSource: List([
    {
      value: 'steak-0',
      name: 'Steak',
      children: [
        { value: 'steak-1', name: 'Steak1' },
        { value: 'steak-2', name: 'Steak2' },
      ],
    },
    {
      value: 'pizza-1',
      name: 'Pizza',
      children: [
        { value: 'pizza-11', name: 'Pizza1' },
        { value: 'pizza-2', name: 'Pizza2' },
      ],
    },
    {
      value: 'tacos-2',
      name: 'Tacos',
      children: [
        { value: 'tacos-222', name: 'tacos' },
        { value: 'tacos-23', name: 'tacos' },
      ],
    },
  ]),
  multiple: false,
};

export const VirtualScroll = Template.bind({});

const configVirtual: SelectConfig = {
  appearance: 'outline',
  isVirtualScroll: true,
  itemSize: 30,
};

VirtualScroll.args = {
  placeholder: 'select code',
  label: 'Zip Code',
  config: configVirtual,
  dataSource: List(
    [...Array(1000).keys()].map((val) => {
      return {
        name: val.toString().padStart(4, '0'),
        value: val.toString().padStart(4, '0'),
      };
    })
  ),
  isSearchFilter: false,
};

export const FilterGroup = Template.bind({});

const configFilter: SelectConfig = {
  appearance: 'outline',
  isVirtualScroll: true,
  itemSize: 30,
};

FilterGroup.args = {
  placeholder: 'select item',
  label: 'Search Filter',
  config: configFilter,
  dataSource: List(
    [...Array(1000).keys()].map((val) => {
      return {
        name: val.toString().padStart(4, '0'),
        value: val.toString().padStart(4, '0'),
      };
    })
  ),
  isSearchFilter: true,
};

export const SelectWithFormControl = Template.bind({});
SelectWithFormControl.decorators = [
  componentWrapperDecorator(
    (story) =>
      `<form [formGroup]="formGroup">
        <app-select formControlName="select" [dataSource]="data" required="true" label="Basic Form" placeholder="select item" ></app-select>
      </form>`
  ),
];
SelectWithFormControl.args = {};
