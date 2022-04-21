import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from './model/confirmation-dialog.model';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: ConfirmationDialogData,
    public mdDialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  ngOnInit(): void {}

  public cancel() {
    this.close(false);
  }

  public confirm() {
    this.close(true);
  }
  private close(value: boolean) {
    this.mdDialogRef.close(value);
  }
}
