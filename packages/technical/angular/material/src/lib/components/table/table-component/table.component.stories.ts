/* eslint-disable @typescript-eslint/no-explicit-any */
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { TableConfig } from '../table.model';
import { TableComponent } from './table.component';
import { moduleMetadata } from '@storybook/angular';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export default {
  title: 'Material Table',
  component: TableComponent,
  argTypes: {
    config: {
      description: 'The configuration for the table',
    },
  },
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        MatSortModule,
        MatTableModule,
        CommonModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<TableComponent<any>> = (args) => ({
  props: args,
});

export const Basic = Template.bind({});
const basicTableConfig: TableConfig = {
  hasPagination: false,
  columns: [
    {
      name: 'serialNumber',
      title: 'SNo',
    },
    {
      name: 'name',
      title: 'Name',
      sortable: true,
    },
  ],
};

Basic.args = {
  title: 'Basic Table',
  caption: 'Basic table with no pagination.',
  config: basicTableConfig,
  data: [
    {
      serialNumber: 1,
      name: 'A',
    },
    {
      serialNumber: 2,
      name: 'B',
    },
    {
      serialNumber: 3,
      name: 'C',
    },
  ],
};
