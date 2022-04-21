import { ChangeDetectorRef, Directive, Injector, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/**
 *
 * @description
 * A base value accessor class that helps
 * 1. Handle value accessor implementation in common way accross the control components.
 * 2. Handle the Validation execution in common way.
 * 3. Handle validation error match in common way.
 */
@Directive()
export class ValueAccessorBase implements ControlValueAccessor, OnInit {
  /**
   * is the control required
   */
  @Input() required: boolean;

  /**
   * the label for the control
   */
  @Input() label: string;

  /**
   * @description tells whether the control is disabled
   */
  @Input() disabled: boolean;

  public ngControl: NgControl;

  /**
   * call this method when the form control is touched
   */
  protected onTouchedFn: () => void;

  private _value: any;
  private onChangeFn: (_: any) => void;

  /**
   * @description Set value for control
   */
  set value(value: any) {
    this._value = value;
    if (this.onChangeFn) {
      this.onChangeFn(this._value);
    }
  }

  /**
   * @description read value of the control
   */
  get value() {
    return this._value;
  }

  constructor(private injector: Injector, private changeDetector?: ChangeDetectorRef) {}

  ngOnInit() {
    try {
      this.ngControl = this.injector.get(NgControl);
    } catch (e) {}
  }

  writeValue(value: any): void {
    if (value) {
      this._value = value;
    }
    this.changeDetector?.markForCheck();
    this.onValueChange();
  }

  /**
   * This method can be overrided by the child components
   */
  onValueChange() {}

  registerOnChange(fn: (_: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }
}
