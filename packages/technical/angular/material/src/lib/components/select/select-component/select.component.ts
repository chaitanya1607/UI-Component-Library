import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { List } from 'immutable';
import { Observable, Subject } from 'rxjs';
import { SelectConfig, OptionValue } from '../select.model';
import { isEmpty, map, startWith, takeUntil } from 'rxjs/operators';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { ValueAccessorBase } from '../../core/value-accessor-base';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
})
export class SelectComponent
  extends ValueAccessorBase
  implements OnInit, AfterViewInit, OnDestroy {
  /**
   *  the select configuration
   */
  @Input()
  config: SelectConfig;

  /**
   * @description data that is used to render in the list of items
   */
  @Input()
  dataSource: List<OptionValue>;

  /**
   * @description placeholder for dropdown component
   */
  @Input()
  placeholder: string;

  /**
   * @description enables multible selection
   * dynamic value change is not detected by mat select , can only set on initialisation
   */
  @Input()
  multiple: boolean = false;

  /**
   * @description enables search filter and
   * if virtual scroll is enabled then minimum search value should be 3
   */
  @Input()
  isSearchFilter: boolean = false;

  @Input() noResultsMessage = 'No results found';

  @ViewChild(MatSelect) select: MatSelect;

  @ViewChildren(MatOption) options: QueryList<MatOption>;

  @ViewChild(MatAutocomplete) matAutoComplete: MatAutocomplete;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  /**
   * @description selected control
   */
  selectedControl: FormControl = new FormControl('');

  /**
   * @description control used by search filter
   */
  searchValue: FormControl = new FormControl('');

  /**
   * it is used to add the filtered values
   */
  filteredOptions: Observable<List<OptionValue>>;

  /**
   * scroll index used by virtual scroll
   */
  virtualScrollSelectedIndex: number = 0;

  private destroySubject: Subject<void>;

  constructor(injector: Injector, private cd: ChangeDetectorRef) {
    super(injector);
    this.destroySubject = new Subject();
  }

  ngOnInit(): void {
    this._filterDataSource();
  }

  ngAfterViewInit(): void {
    this._virtualPortScrollToIndex();
    this._setInitialValue();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.destroySubject.next();
  }

  /**
   * check whether the datasource has children,
   * if it has children then it will be in group item
   */
  get isOptionGroupAvailable() {
    const isChildrenAvailable = this.dataSource.find(
      (group) => group?.children?.length > 0
    )
      ? true
      : false;
    return isChildrenAvailable;
  }

  public onSelectionChange(selectChange: MatSelectChange) {
    if (selectChange.value) {
      this.value = selectChange.value;
    }
  }

  public selectedOptionFromFilter(event: MatAutocompleteSelectedEvent) {
    if (event) {
      this.value = event.option.value;
    }
  }

  public displayFn(option: OptionValue): string {
    return option && option.name ? option.name : '';
  }

  /**
   * emits the current scroll index by the cdk virtual view port
   * @param index
   */
  public scrollToSelectedVirtualScrollElement(index: number) {
    if (index > 0 || !this.value) {
      this.virtualScrollSelectedIndex = index;
    } else if (this.value) {
      this.virtualScrollSelectedIndex = this.dataSource.findIndex(
        (data) => data.value === this.value
      );
    }
  }

  /**
   * emits the current scroll index by the cdk virtual view port
   * @param index
   */
  public scrollToSelectedVirtualScrollElementForFilter(index: number) {
    if (index > 0 || !this.value) {
      this.virtualScrollSelectedIndex = 0.5;
    } else if (this.value) {
      this.virtualScrollSelectedIndex = this.dataSource.findIndex(
        (data) => data.value === this.value
      );
    }
  }

  public onBlur(event: FocusEvent) {
    if (this.onTouchedFn) {
      this.onTouchedFn();
    }
  }

  private _setInitialValue() {
    if (this.value && this.select) {
      this.selectedControl.setValue(this.value);
    } else if (this.value && this.matAutoComplete) {
      this.searchValue.setValue(this.value);
    }
  }

  /**
   * used to filter the data from the datasource based on the search input
   */
  private _filterDataSource() {
    this.filteredOptions = this.searchValue.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.dataSource.slice()))
    );
  }

  private _filter(value: string): List<OptionValue> {
    const filterValue = value.toLowerCase();
    return this.dataSource.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  /**
   * if the option is selected and the user opens the panel ,
   * then the cdk virtual view port has to be scrolled to show the selected option in the panel
   */
  private _virtualPortScrollToIndex() {
    if (this.config?.isVirtualScroll && this.select) {
      this.select.openedChange
        .pipe(takeUntil(this.destroySubject.asObservable()))
        .subscribe((opened) => {
          if (opened) {
            this.viewPort.scrollToIndex(this.virtualScrollSelectedIndex);
          }
        });
    } else if (this.config?.isVirtualScroll && this.matAutoComplete) {
      this.matAutoComplete.opened
        .pipe(takeUntil(this.destroySubject.asObservable()))
        .subscribe((opened) => {
          this.viewPort.scrollToIndex(this.virtualScrollSelectedIndex);
        });
    }
  }
}
