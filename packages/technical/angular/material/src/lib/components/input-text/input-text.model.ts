import { MatFormFieldAppearance } from '@angular/material/form-field';

export class InputConfig {
  /**
   * @description autocomplete for input. Supports the values of standard input element.
   */
  autocomplete?: string;
}

export class PrefixOrSuffixContent {
  iconName?: string;
  text?: string;
}

export class UIConfig {
  /**
   * @description If true removes the required indicator
   */
  hideRequiredMarker?: boolean;

  /**
   * @description The form-field appearance style
   */
  formFieldAppearance?: MatFormFieldAppearance;
}

export type InputSize = 'small' | 'medium' | 'large' | 'normal';
