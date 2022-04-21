export type LabelPosition = 'after' | 'before';

/**
 * Data required for the Checkbox are provided.
 */
export class CheckboxGroup {
  /**
   * Details for the select all checkbox item
   */
  selectAll?: CheckboxItem;
  /**
   * array of checkboxes of this group
   */
  items: CheckboxItem[];
}

export class CheckboxItem {
  /**
   * Label to the checkbox
   */
  name: string;

  /**
   * Optional label for the select All component
   */
  label?: string;

  /**
   * is check box selected, defaults to false
   */
  checked?: boolean = false;
  /**
   * is check box disabled, defaults to false
   */
  disabled?: boolean;
}

export class CheckboxGroupChange {
  checkBoxGroup: CheckboxGroup;
}

export interface CheckboxValue {
  /**
   * checkbox name
   */
  name: string;
  /**
   * checkbox value
   */
  value: boolean;
}
