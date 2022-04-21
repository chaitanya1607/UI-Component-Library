import { ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { ChipItem } from '../chip-list-model';
import { map, startWith } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import { InputComponent } from '../../core/input-component';

@Component({
  selector: 'app-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChipListComponent,
      multi: true,
    },
  ],
})
export class ChipListComponent
  extends InputComponent
  implements OnInit, AfterViewInit {
  /**
   * list of chip item that needs to be displayed
   */
  @Input()
  chips: ChipItem[] = [];

  /**
   * this can be used to show the list of items available
   * in the options panel and can be selected
   */
  @Input()
  options: ChipItem[] = [];

  /**
   * suffix to the chip item component
   */
  @Input()
  iconName: string;

  /**
   * specify the color for the chip
   */
  @Input()
  color: ThemePalette;

  /**
   * aria label for the chip list
   */
  @Input()
  ariaLabel: string;

  @Output()
  onAdd: EventEmitter<ChipItem>;

  @Output()
  onRemove: EventEmitter<ChipItem>;

  // used by autocomplete to filter out the options
  public searchCtrl: FormControl = new FormControl('');

  public filteredLists: Observable<ChipItem[]>;

  public readonly separatorKeysCodes = [ENTER] as const;

  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
    this.onAdd = new EventEmitter();
    this.onRemove = new EventEmitter();
  }

  ngOnInit(): void {
    if (this.options?.length > 0) {
      this._filterItems();
    }
  }

  ngAfterViewInit() {
    this._setInitialValues();
  }

  /**
   * Since ngModel binding not updating the value, we are setting the initialvalues after writeValue
   * overidded method
   */
  onValueChange() {
    this._setInitialValues();
  }

  public removeChipItem(item: ChipItem) {
    const index = this.chips.indexOf(item);

    if (index >= 0) {
      this.chips.splice(index, 1);
      this.onRemove.emit(item);
      this.value = this.chips;
      if (this.chips.length === 0) {
        this.cd.detectChanges();
      }
    }
  }

  public addChipItem(matChipInput: MatChipInputEvent) {
    if (matChipInput) {
      this.onBlur();
    }
    const value = (matChipInput.value || '').trim();
    // need to do validation before adding chip to the list
    // Add chip item to chip list
    if (value) {
      this.chips.push({ value: value });
      const chipItem: ChipItem = {
        value: value,
      };
      this.onAdd.emit(chipItem);
      this.value = this.chips;
    }

    // Clear the input value
    matChipInput.chipInput!.clear();
  }

  public selectedOption(valueSelected: MatAutocompleteSelectedEvent) {
    if (valueSelected.option.value) {
      const value = valueSelected.option.value;
      this.chips.push({ value: value });
      this.searchCtrl.setValue('');
      const chipItem: ChipItem = {
        value: value,
      };
      this.onAdd.emit(chipItem);
      this.value = this.chips;
    }
  }

  private _setInitialValues() {
    if (this.value) {
      const chips: ChipItem[] = this.value;
      this.chips = chips;
      this.cd.detectChanges();
    }
  }

  private _filterItems() {
    this.filteredLists = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map((searchValue: string | null) =>
        searchValue ? this._filter(searchValue) : this.options.slice()
      )
    );
  }

  private _filter(filterValue: string): ChipItem[] {
    return this.options.filter(
      (item) => item.value.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
