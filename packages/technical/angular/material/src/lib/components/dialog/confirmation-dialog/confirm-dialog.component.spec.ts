import { CommonModule } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule, MAT_ICON_LOCATION } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentPipe } from '@utilities/angular-web-utils';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmationDialogData } from './model/confirmation-dialog.model';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  const dialogMock = {
    close: () => {},
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        BrowserAnimationsModule,
        MatIconModule,
      ],
      declarations: [ConfirmDialogComponent, ContentPipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogMock },
        {
          provide: MAT_ICON_LOCATION,
          useValue: {},
        },
        {
          provide: ErrorHandler,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    component.dialogData = dialogData;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.title h1').textContent).toContain(
        'Delete File'
      );
    });
  });

  it('should render message', () => {
    component.dialogData = dialogData;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.info-message').textContent).toContain(
        'Are you sure you want to delete?'
      );
    });
  });

  it('should cancle and close the dialog when clicked on cancle button', () => {
    let spy = spyOn(component.mdDialogRef, 'close').and.callThrough();
    component.dialogData = dialogData;
    fixture.detectChanges();
    let button = fixture.debugElement.nativeElement.querySelector(
      '.actions .cancle'
    );
    expect(button.textContent).toContain('cancle');
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  it('should confirm and close the dialog when clicked on confirm button', () => {
    let spy = spyOn(component.mdDialogRef, 'close').and.callThrough();
    component.dialogData = dialogData;
    fixture.detectChanges();
    let button = fixture.debugElement.nativeElement.querySelector(
      '.actions .confirm'
    );
    expect(button.textContent).toContain('ok');
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  it('should call confirm method when clicked on confirm button', () => {
    spyOn(component, 'confirm');
    const button = fixture.debugElement.query(By.css('.confirm')).nativeElement;
    button.click();
    fixture.whenStable().then(() => {
      expect(component.confirm).toHaveBeenCalled();
    });
  });

  it('dialog should be closed after confirm()', () => {
    let spy = spyOn(component.mdDialogRef, 'close').and.callThrough();
    component.confirm();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('dialog should be closed after cancle()', () => {
    let spy = spyOn(component.mdDialogRef, 'close').and.callThrough();
    component.cancel();
    expect(spy).toHaveBeenCalledWith(false);
  });
});

const dialogData: ConfirmationDialogData = {
  titleKey: 'common.delete.title',
  messageKey: 'common.delete.message',
  confirmButtonTextKey: 'common.confirm',
  cancelButtonTextKey: 'common.cancel',
  type: 'Confirmation',
};
