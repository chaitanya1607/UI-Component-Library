import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  IconColor,
  InformationDialogData,
} from './model/information-dialog.model';

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss'],
})
export class InformationDialogComponent implements OnInit {
  iconColor: IconColor;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogData: InformationDialogData,
    public mdDialogRef: MatDialogRef<InformationDialogComponent>
  ) {}

  ngOnInit(): void {
    this.setIconColor();
  }

  public confirm() {
    this.close(true);
  }

  private close(value: boolean) {
    this.mdDialogRef.close(value);
  }
  private setIconColor() {
    if (this.dialogData.type === 'Error' || this.dialogData.type === 'Warn') {
      this.iconColor = 'warn';
    }
    if (this.dialogData.type === 'Success') {
      this.iconColor = 'accent';
    }
    if (this.dialogData.type === 'Information') {
      this.iconColor = 'accent';
    }
  }
}
