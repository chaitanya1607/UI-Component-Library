import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ContentService,
  LocaleService,
  ServiceConfig,
} from '@utilities/angular-web-utils';
import { BaseComponent } from '../../../core/base.component';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { ConfirmationDialogData } from '../model/confirmation-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService extends BaseComponent {
  constructor(
    private dialog: MatDialog,
    contentService: ContentService,
    localService: LocaleService,
    svcConfig: ServiceConfig
  ) {
    super(contentService, localService, svcConfig);
  }
  /**
   * @description opens a confirmation dialog and retuns a observable that emits user action
   * true if user confirmed
   * false in any other case
   */
  public open(matDialogConfig?: MatDialogConfig<ConfirmationDialogData>) {
    matDialogConfig = this.setDialogConfigProperties(matDialogConfig);
    matDialogConfig = this.setDialogDefaultData(matDialogConfig);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, matDialogConfig);
    return dialogRef.afterClosed();
  }

  /**
   * @description use this method to set the default values for dialog data
   * @returns MatDialogConfig
   */
  private setDialogDefaultData(
    matDialogConfig: MatDialogConfig<ConfirmationDialogData>
  ): MatDialogConfig<ConfirmationDialogData> {
    matDialogConfig.data.confirmButtonTextKey = matDialogConfig.data
      .confirmButtonTextKey
      ? matDialogConfig.data.confirmButtonTextKey
      : 'common.confirm';
    matDialogConfig.data.cancelButtonTextKey = matDialogConfig.data
      .cancelButtonTextKey
      ? matDialogConfig.data.cancelButtonTextKey
      : 'common.cancel';
    matDialogConfig.data.titleKey = matDialogConfig.data.titleKey
      ? matDialogConfig.data.titleKey
      : matDialogConfig.data.type;

    return matDialogConfig;
  }

  /**
   * @description use this method to set the dialog properties using the matDialogConfig model
   * @returns MatDialogConfig
   */
  private setDialogConfigProperties(
    matDialogConfig: MatDialogConfig<ConfirmationDialogData>
  ): MatDialogConfig<ConfirmationDialogData> {
    matDialogConfig.width = '35vw';
    return matDialogConfig;
  }
}
