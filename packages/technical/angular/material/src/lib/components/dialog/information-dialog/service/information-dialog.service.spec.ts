import { TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { of } from 'rxjs';
import { InformationDialogComponent } from '../information-dialog.component';
import { InformationDialogData } from '../model/information-dialog.model';
import { InformationDialogService } from './information-dialog.service';

describe('InformationDialogService', () => {
  let service: InformationDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [InformationDialogService],
    });
    service = TestBed.inject(InformationDialogService);
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
    expect(dialogSpy).toHaveBeenCalledWith(InformationDialogComponent, {
      data: dialogData,
      minHeight: '50%',
      minWidth: '40%',
    });
  });
});

const dialogData: InformationDialogData = {
  icon: 'check_circle',
  messageKey: 'common.success',
  closeButtonTextKey: 'common.close',
  type: 'Success',
};
