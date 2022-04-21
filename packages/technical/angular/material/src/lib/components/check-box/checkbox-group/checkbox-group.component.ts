import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ValueAccessorBase } from '../../core/value-accessor-base';
import {
  LabelPosition,
  CheckboxGroup,
  CheckboxGroupChange,
  CheckboxValue,
} from '../check-box.model';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxGroupComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupComponent
  extends ValueAccessorBase
  implements AfterViewInit {
  /**
   *@description Label bosition to the checkbox "after | before", defaults to after
   */
  @Input() labelPosition?: LabelPosition = 'after';

  /**
   *@description Checkbox group model with list of items
   */
  @Input() checkboxGroup: CheckboxGroup;

  @Output() change: EventEmitter<CheckboxGroupChange>;

  allCheckboxesChecked: boolean;

  selectAllIndeterminate: boolean;

  constructor(injector: Injector) {
    super(injector);
    this.change = new EventEmitter();
  }

  ngAfterViewInit() {
    if (this.value) {
      this.checkboxGroup = this.value;
    }
  }

  public onBlur() {
    if (this.onTouchedFn) {
      this.onTouchedFn();
    }
  }

  ngOnInit(): void {
    super.ngOnInit();
    /**
     * checking whether the selectAll checkbox is by default checked
     */
    this.ifGroupChecked();

    /**
     * checking whether the selectAll checkbox is by default disabled
     */
    this.ifGroupDisabled();
  }

  /**
   * updates the select all checkbox to the checked / indeterminate
   * based on the change in checkbox items state
   */
  updateSelectAllChecked() {
    this.allCheckboxesChecked = this.checkboxGroup.items?.every(
      (checkboxItem) => checkboxItem.checked
    );
    this.isSelectAllIndeterminate();
    this.output();
  }

  selectAll(checked: boolean) {
    this.allCheckboxesChecked = checked;
    this.checkboxGroup.items?.forEach((checkboxItem) => {
      checkboxItem.checked = checked;
    });
    this.isSelectAllIndeterminate();
    this.output();
  }

  /**
   * Marks the items as checked if select all is checked
   */
  private ifGroupChecked() {
    if (this.checkboxGroup.selectAll.checked) {
      this.selectAll(this.checkboxGroup.selectAll.checked);
    }
  }

  /**
   * Marks the items as disabled if select all is disabled
   */
  private ifGroupDisabled() {
    if (this.checkboxGroup.selectAll.disabled) {
      this.checkboxGroup.items.forEach((checkboxItem) => {
        checkboxItem.disabled = this.checkboxGroup.selectAll.disabled;
      });
      this.value = this.checkboxGroup;
    }
  }

  /**
   * Determinates indeterminate state of the checkbox group
   */
  private isSelectAllIndeterminate() {
    if (
      this.checkboxGroup.items?.find((checkboxItem) => checkboxItem.checked) &&
      !this.allCheckboxesChecked
    ) {
      this.selectAllIndeterminate = true;
    } else {
      this.selectAllIndeterminate = false;
    }
  }

  private output() {
    let checkBoxGroupChange = new CheckboxGroupChange();
    checkBoxGroupChange.checkBoxGroup = this.checkboxGroup;
    this.change.emit(checkBoxGroupChange);
    let checkboxValue: CheckboxValue[] = this.getCheckBoxes();
    this.value = checkboxValue;
  }

  /**
   * Maps the output as name and value of the checkbox for the formControl
   */
  private getCheckBoxes(): CheckboxValue[] {
    let checkboxesValue: CheckboxValue[] = [];
    checkboxesValue.push({
      name: this.checkboxGroup.selectAll.name,
      value: this.checkboxGroup.selectAll.checked,
    });
    this.checkboxGroup.items.forEach((item) => {
      checkboxesValue.push({ name: item.name, value: item.checked });
    });
    return checkboxesValue;
  }
}
