import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ComponentDialogService {
  constructor(private dialog: MatDialog) {}
  public openComponentDialog(
    componentInstance: any,
    matDialogConfig?: MatDialogConfig<any>
  ): MatDialogRef<any> {
    return this.dialog.open(componentInstance, matDialogConfig);
  }
}
