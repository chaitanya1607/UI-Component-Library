import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnInit,
  Optional,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputComponent } from '../../core/input-component';
import {
  InputConfig,
  InputSize,
  PrefixOrSuffixContent,
} from '../input-text.model';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputTextComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextComponent extends InputComponent implements OnInit {
  /**
   * @description initialValue for the input
   */
  @Input() initialValue: string;

  /**
   * @description size of the input field
   */
  @Input() size: InputSize;

  /**
   * @description metadata which needs to be passed to the input element
   */
  @Input() inputConfig: InputConfig;

  /**
   * @description text or an icon to be prefixed for input control
   */
  @Input() prefix: PrefixOrSuffixContent;

  /**
   * @description text or icon to be suffixed to inpuut control
   */
  @Input() suffix: PrefixOrSuffixContent;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.value = this.initialValue;
  }
}
