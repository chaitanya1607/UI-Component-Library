import { setCompodocJson } from '@storybook/addon-docs/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import docJson from './documentation.json';
// the theme for all stories
import '!style-loader!css-loader!sass-loader!../src/lib/themes/deeppurple-amber.scss';

setCompodocJson(docJson);

export const parameters = {
  actions: {},
  controls: {
    matchers: {},
  },
};

export const decorators = [
  // add a wrapper to set mat-typography
  componentWrapperDecorator(
    (story) => `<div class="mat-typography">${story}</div>`
  ),
];
