import { AfterViewInit, Injector, ViewChild } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ValueAccessorBase } from '../../core/value-accessor-base';
import { LabelPosition } from '../check-box.model';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckBoxComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckBoxComponent
  extends ValueAccessorBase
  implements AfterViewInit {
  /**
   *@description boolean to specify if checkbox is checked or not,defaults to false
   */
  @Input() checked?: boolean = false;

  /**
   *@description Label bosition to the checkbox "after | before", defaults to after
   */
  @Input() labelPosition?: LabelPosition = 'after';

  /**
   * @description Output's the current checkbox configuration.
   */
  @Output() checkBoxValuesChanged = new EventEmitter<boolean>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    if (this.value) {
      this.checked = this.value;
    }
  }

  public onBlur() {
    if (this.onTouchedFn) {
      this.onTouchedFn();
    }
  }

  /**
   * Oncheckbox change event, detects if checkbox is checked or not and emits the checkboxConfig
   * with label:string, checked:boolean, disabled:boolean
   */
  checkBoxChanged(event: MatCheckboxChange) {
    this.checkBoxValuesChanged.emit(event.checked);
    this.value = event.checked;
  }
}
