import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

import { CheckBoxComponent } from './checkbox.component';

describe('CheckBoxComponent', () => {
  let component: CheckBoxComponent;
  let fixture: ComponentFixture<CheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('should call onBlur', () => {
    component.onBlur();
    expect(component.onBlur).toBeTruthy();
  });

  it('should bind value to the checkbox component', () => {
    component.value = 'value';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkbox = fixture.debugElement.query(By.css('mat-checkbox'))
        .nativeElement.value;
      expect(checkbox).toBe('value');
    });
  });

  it('should render checkbox name', () => {
    component.label = 'checkbox 1';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      let checkBox = compiled.querySelectorAll('mat-checkbox') as HTMLElement;

      expect(checkBox.textContent.trim()).toEqual(component.label);
    });
  });

  it('should add disabled true to the mat-checkbox element', () => {
    component.disabled = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.disabled).toBe(true);
    });
  });

  it('should add disabled false to the mat-checkbox element', () => {
    component.disabled = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.disabled).toBe(false);
    });
  });

  it('should add checked true to the mat-checkbox element', () => {
    component.checked = true;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.checked).toBe(true);
    });
  });

  it('should add checked false to the mat-checkbox element', () => {
    component.checked = false;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.checked).toBe(false);
    });
  });

  it('should add label position to the mat-checkbox element', () => {
    component.labelPosition = 'after';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const checkboxDebugElement = fixture.debugElement.query(
        By.directive(MatCheckbox)
      );
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.labelPosition).toContain('after');
      component.labelPosition = 'before';
      fixture.detectChanges();
      expect(checkboxInstance.labelPosition).toContain('before');
    });
  });

  it('should update the ngModel value when using the `toggle` method', () => {
    const checkboxDebugElement = fixture.debugElement.query(
      By.directive(MatCheckbox)
    );

    fixture.whenStable().then(() => {
      const checkboxInstance = checkboxDebugElement.componentInstance;
      expect(checkboxInstance.checked).toBe(false);

      checkboxInstance.toggle();
      fixture.detectChanges();

      expect(checkboxInstance.checked).toBe(true);
    });
  });
});
