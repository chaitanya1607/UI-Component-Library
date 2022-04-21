import { MatFormFieldAppearance } from '@angular/material/form-field';

export class OptionValue {
  value: string;
  name: string;
  disable?: boolean;
  children?: OptionValue[];
}

export class SelectConfig {
  /**
   * appearance of the form field
   */
  appearance?: MatFormFieldAppearance;

  /**
   * enable virtual scroll
   */
  isVirtualScroll?: boolean;

  /**
   * if virtual scroll is enabled, size of the items in the list (in pixels).
   */
  itemSize?: number;
}
