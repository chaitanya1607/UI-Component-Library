import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  MatChip,
  MatChipInput,
  MatChipInputEvent,
  MatChipList,
  MatChipsModule,
} from '@angular/material/chips';
import {
  MatFormFieldModule,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import exp = require('node:constants');
import { ChipItem } from '../chip-list-model';
import { ChipListComponent } from './chip-list.component';

describe('ChipListComponent', () => {
  let component: ChipListComponent;
  let fixture: ComponentFixture<ChipListComponent>;
  let chipDebugElement: DebugElement;
  let chipListdirective: MatChipList;
  let chipNativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipListComponent],
      imports: [
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatAutocompleteModule,
        MatChipsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipListComponent);
    component = fixture.componentInstance;
    component.readonly = false;
    component.placeholder = 'Add Item';
    component.iconName = 'filter_alt';
    component.chips = [{ value: 'pending' }, { value: 'completed' }];
    fixture.detectChanges();

    chipDebugElement = fixture.debugElement.query(By.directive(MatChipList))!;
    chipListdirective = chipDebugElement.injector.get(MatChipList);
    chipNativeElement = chipDebugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the list of chips items in the mat chip list', () => {
    expect(chipListdirective.chips.length).toBe(2);
  });

  it('should update the chips when it is removed', () => {
    chipListdirective.chips.first.remove();
    fixture.detectChanges();
    expect(chipListdirective.chips.length).toEqual(1);
  });

  it('should suffix icon to the formfield', () => {
    const suffix = fixture.debugElement.query(By.directive(MatSuffix));
    expect(suffix).toBeTruthy();
  });

  it('should be able to add chips item from input', fakeAsync(() => {
    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'success';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    inputElement.nativeElement.dispatchEvent(new Event('blur'));
    flush();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(inputElement.nativeElement.placeholder).toBe('Add Item');
      expect(component.chips.length).toEqual(3);
    });
  }));

  it('should emit onAdd event when the chips are added', fakeAsync(() => {
    component.onAdd.subscribe((chipItem) => {
      expect(chipItem.value).toEqual('success');
    });

    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'success';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    inputElement.nativeElement.dispatchEvent(new Event('blur'));
    flush();
    fixture.detectChanges();
  }));

  it('should emit onRemove event when the chips are removed', () => {
    component.onRemove.subscribe((chipItem) => {
      expect(chipItem.value).toEqual('success');
    });
    chipListdirective.chips.first.remove();
    fixture.detectChanges();
  });
});
