import { SelectComponent } from './select.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OptionValue } from '../select.model';
import { List } from 'immutable';

describe('SelectComponent', () => {
  let component: SelectComponent;
  // let fixture: ComponentFixture<SelectComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  function configureMatSelectTestingModule(
    declarations: any[],
    providers: any[]
  ) {
    TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: declarations,
      providers: [...providers],
    }).compileComponents();

    inject(
      [OverlayContainer, Platform],
      (oc: OverlayContainer, p: Platform) => {
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
        platform = p;
      }
    )();
  }

  beforeEach(
    waitForAsync(() => {
      configureMatSelectTestingModule([SelectComponent], []);
    })
  );

  describe('selection logic', () => {
    let fixture: ComponentFixture<SelectComponent>;
    let trigger: HTMLElement;
    let formField: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectComponent);
      component = fixture.componentInstance;
      fixture.componentInstance.dataSource = dataSource;
      fixture.componentInstance.label = 'Select Item';
      fixture.componentInstance.config = {
        isVirtualScroll: false,
      };
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.mat-select-trigger'))!
        .nativeElement;
      formField = fixture.debugElement.query(By.css('.mat-form-field'))!
        .nativeElement;
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have label', () => {
      let el = fixture.debugElement.query(By.css('label'))!.nativeElement;
      console.log('el', el.textContent);
      expect(el).not.toBeNull();
      expect(el).toBe('Select Item');
    });

    it('should display the data source in the mat option panel', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      let option = overlayContainerElement.querySelectorAll(
        'mat-option'
      ) as NodeListOf<HTMLElement>;
      expect(option[0].textContent.trim()).toEqual('Steak');
      expect(option[1].textContent.trim()).toEqual('Pizza');
      expect(option[2].textContent.trim()).toEqual('Tacos');
    }));

    it('should add placeholder for input', () => {
      component.placeholder = 'placeholder';
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const matSelectElement = fixture.debugElement.query(
          By.css('.mat-select-placeholder')
        ).nativeElement as HTMLInputElement;
        expect(matSelectElement.textContent).toBe('placeholder');
      });
    });

    it('should focus the first option if no option is selected', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();
      expect(
        fixture.componentInstance.select._keyManager.activeItemIndex
      ).toEqual(0);
    }));

    it('should select an option when clicked', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();
      flush();

      let option = overlayContainerElement.querySelectorAll(
        'mat-option'
      ) as NodeListOf<HTMLElement>;
      option[0].click();
      fixture.detectChanges();
      flush();

      console.log('value', fixture.componentInstance.select.value);
      expect(fixture.componentInstance.options.first.selected).toBe(true);
      expect(fixture.componentInstance.select.selected).toBe(
        fixture.componentInstance.options.first
      );
    }));

    it('should focus the selected option', fakeAsync(() => {
      // must wait for initial writeValue promise to finish
      // flush();

      fixture.componentInstance.selectedControl.setValue('pizza-1');
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      flush();

      // must wait for animation to finish
      fixture.detectChanges();
      expect(
        fixture.componentInstance.select._keyManager.activeItemIndex
      ).toEqual(1);
    }));

    it('should not select disabled options', fakeAsync(() => {
      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'mat-option'
      ) as NodeListOf<HTMLElement>;
      options[2].click();
      fixture.detectChanges();

      expect(fixture.componentInstance.select.panelOpen).toBe(true);
      expect(options[2].classList).not.toContain('mat-selected');
      expect(fixture.componentInstance.select.selected).toBeUndefined();
    }));

    it('should take an initial view value with forms', fakeAsync(() => {
      fixture.componentInstance.selectedControl = new FormControl('tacos-2');
      fixture.detectChanges();

      const value = fixture.debugElement.query(By.css('.mat-select-value'))!;
      expect(value.nativeElement.textContent).toContain('Tacos');

      expect(
        fixture.componentInstance.select._keyManager.activeItemIndex
      ).toEqual(2);
    }));

    //ng model
    // validation required

    it('should render virtual scroll when it is enabled', fakeAsync(() => {
      let fixture = TestBed.createComponent(SelectComponent);
      let viewport: CdkVirtualScrollViewport;
      fixture.componentInstance.dataSource = dataSource;
      fixture.componentInstance.config = {
        isVirtualScroll: true,
      };
      fixture.detectChanges();
      let trigger = fixture.debugElement.query(By.css('.mat-select-trigger'))!
        .nativeElement;

      const contentWrapper = document.querySelector(
        '.cdk-overlay-pane .mat-select-panel'
      )!;

      trigger.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.select.panelOpen).toBe(true);
    }));

    it('should be able to select multiple values', fakeAsync(() => {
      let fixture = TestBed.createComponent(SelectComponent);
      fixture.componentInstance.dataSource = dataSource;
      fixture.componentInstance.multiple = true;
      fixture.detectChanges();

      let trigger = fixture.debugElement.query(By.css('.mat-select-trigger'))!
        .nativeElement;

      trigger.click();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'mat-option'
      ) as NodeListOf<HTMLElement>;

      options[0].click();
      options[1].click();

      fixture.detectChanges();
      expect(fixture.componentInstance.selectedControl.value).toEqual([
        'steak-0',
        'pizza-1',
      ]);
    }));
  });
});

const dataSource: List<OptionValue> = List([
  { value: 'steak-0', name: 'Steak' },
  { value: 'pizza-1', name: 'Pizza' },
  { value: 'tacos-2', name: 'Tacos', disable: true },
]);
