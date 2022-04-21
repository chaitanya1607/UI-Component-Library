import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatFormFieldModule,
  MatPrefix,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextComponent } from './input-text.component';
import { MatButtonModule } from '@angular/material/button';

describe('InputTextComponent', () => {
  let component: InputTextComponent;
  let fixture: ComponentFixture<InputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputTextComponent],
      imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind value to the input component', () => {
    component.value = 'value';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const inputText = fixture.debugElement.query(By.css('input'))
        .nativeElement.value;
      expect(inputText).toBe('value');
    });
  });

  it('should add label', () => {
    component.label = 'label';
    fixture.detectChanges();
    const labelElement = fixture.debugElement.query(By.css('mat-label'))
      .nativeElement;
    expect(labelElement.innerHTML).toEqual('label');
  });

  it('should add placeholder for input', () => {
    component.placeholder = 'placeholder';
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inputElement = fixture.debugElement.query(By.css('input'))
        .nativeElement as HTMLInputElement;
      expect(inputElement.placeholder).toBe('placeholder');
    });
  });

  it('should add readonly to the input element', () => {
    component.readonly = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inputElement = fixture.debugElement.query(By.css('input'))
        .nativeElement as HTMLInputElement;
      expect(inputElement.readOnly).toBe(true);
    });
  });

  it('should add disabled to the input element', () => {
    component.disabled = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inputElement = fixture.debugElement.query(By.css('input'))
        .nativeElement as HTMLInputElement;
      expect(inputElement.disabled).toBe(true);
    });
  });

  it('should add required to the input element', () => {
    component.required = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inputElement = fixture.debugElement.query(By.css('input'))
        .nativeElement as HTMLInputElement;
      expect(inputElement.required).toBe(true);
    });
  });

  it('should show clear input option and should clear input on click of the same', () => {
    component.value = 'value';
    component.clear = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inputText = fixture.debugElement.query(By.css('input'))
        .nativeElement.value;
      expect(inputText).toBe('value');
    });

    const btnElement = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
    btnElement.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inputText = fixture.debugElement.query(By.css('input'))
        .nativeElement.value;
      expect(inputText).toBe('');
    });
  });

  it('should add input configurations properly', () => {
    component.inputConfig = {
      autocomplete: 'on',
    };
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const inputElement = fixture.debugElement.query(By.css('input'))
        .nativeElement as HTMLInputElement;
      expect(inputElement.autocomplete).toBe('on');
    });
  });

  it('should add prefix and suffix icons if icon names passed as inputs', () => {
    component.prefix = {
      iconName: 'visibility',
    };
    component.suffix = {
      iconName: 'phone',
    };
    fixture.detectChanges();

    const prefix = fixture.debugElement.query(By.directive(MatPrefix))!
      .componentInstance as MatIcon;
    expect(prefix).toBeTruthy();

    const suffixIcon = fixture.debugElement.query(By.directive(MatSuffix))!
      .componentInstance as MatIcon;
    expect(suffixIcon).toBeTruthy();
  });

  it('should add prefix and suffix text if content passed as inputs', () => {
    component.prefix = {
      text: 'prefix',
    };
    component.suffix = {
      text: 'suffix',
    };
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const prefix = fixture.debugElement.query(By.directive(MatPrefix))!
        .componentInstance as HTMLSpanElement;
      expect(prefix).toBeTruthy();

      const suffix = fixture.debugElement.query(By.directive(MatSuffix))!
        .componentInstance as HTMLSpanElement;
      expect(suffix).toBeTruthy();
    });
  });
});
