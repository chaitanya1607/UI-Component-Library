import { Component, OnInit } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { of } from 'rxjs';
import { ComponentDialogService } from './component-dialog.service';

@Component({
  selector: 'app-component-dialog',
  template: `<div>
    <h1>Hello I am from component template..!</h1>
    <button mat-raised-button color="primary">I am button</button>
  </div>`,
})
class ComponentDialog implements OnInit {
  constructor() {}

  ngOnInit() {}
}

describe('ComponentDialogService', () => {
  let service: ComponentDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentDialog],
      imports: [MatDialogModule],
      providers: [ComponentDialogService],
    });
    service = TestBed.inject(ComponentDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call open method', () => {
    let dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
      afterClosed: () => of(true),
    });

    let matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.width = '50%';
    service.openComponentDialog(ComponentDialog);

    expect(dialogSpy).toHaveBeenCalledWith(ComponentDialog, matDialogConfig);
  });
});
