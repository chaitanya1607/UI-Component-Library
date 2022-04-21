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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentPipe } from '@utilities/angular-web-utils';
import { InformationDialogComponent } from './information-dialog.component';
import { InformationDialogData } from './model/information-dialog.model';
describe('InformationDialogComponent', () => {
  let component: InformationDialogComponent;
  let fixture: ComponentFixture<InformationDialogComponent>;

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
      declarations: [InformationDialogComponent, ContentPipe],
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
    fixture = TestBed.createComponent(InformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render icon', () => {
    component.dialogData = dialogData;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('mat-icon').textContent).toContain(
        dialogData.icon
      );
    });
  });

  it('should render message', () => {
    component.dialogData = dialogData;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.info-message').textContent).toContain(
        'success message'
      );
    });
  });

  it('should contain button element', () => {
    let button = fixture.debugElement.nativeElement.querySelector('button');
    fixture.whenStable().then(() => {
      expect(button).toBeTruthy();
    });
  });

  it('should close the dialog when clicked on button', () => {
    let spy = spyOn(component.mdDialogRef, 'close').and.callThrough();
    component.dialogData = dialogData;
    fixture.detectChanges();
    let button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.textContent).toContain('ok');
    button.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith(true);
    });
  });
});

const dialogData: InformationDialogData = {
  icon: 'check_circle',
  messageKey: 'common.success',
  closeButtonTextKey: 'common.close',
  type: 'Success',
};
