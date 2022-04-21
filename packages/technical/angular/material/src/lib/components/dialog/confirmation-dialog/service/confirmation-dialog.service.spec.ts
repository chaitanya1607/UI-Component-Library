import { TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { of } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { ConfirmationDialogData } from '../model/confirmation-dialog.model';
import { ConfirmationDialogService } from './confirmation-dialog.service';

describe('ConfirmationDialogService', () => {
  let service: ConfirmationDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MatDialogModule],
      providers: [ConfirmationDialogService],
    });
    service = TestBed.inject(ConfirmationDialogService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call open method', () => {
    let dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
      afterClosed: () => of(true),
    });
    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.data = dialogData;
    service.open(matDialogConfig);

    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: dialogData,
    });
  });
});

const dialogData: ConfirmationDialogData = {
  titleKey: 'common.delete.title',
  messageKey: 'common.delete.message',
  confirmButtonTextKey: 'common.confirm',
  cancelButtonTextKey: 'common.cancel',
  type: 'Confirmation',
};
