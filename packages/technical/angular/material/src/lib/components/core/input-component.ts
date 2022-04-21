import {
  Directive,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UIConfig } from '../input-text/input-text.model';
import { ValueAccessorBase } from './value-accessor-base';

@Directive()
export class InputComponent extends ValueAccessorBase implements OnInit {
  /**
   * @description placeHolder for the input control
   */
  @Input() placeholder: string;

  /**
   * @description tells whether user can edit or only read the value
   */
  @Input() readonly?: boolean;

  /**
   * @description shows a clear icon beside the input field, on the right side, to clear input
   */
  @Input() clear: boolean;

  /**
   * @description Defines the ui configurations for mat form field
   */
  @Input() uiConfig: UIConfig;

  @Output() inputValue: EventEmitter<any>;

  constructor(injector: Injector) {
    super(injector);
    this.inputValue = new EventEmitter<any>();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onBlur(): void {
    if (this.onTouchedFn) {
      this.onTouchedFn();
    }
    this.inputValue.emit(this.value);
  }
}
