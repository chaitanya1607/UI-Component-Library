import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InformationDialogComponent } from '../information-dialog.component';
import {
  ContentService,
  LocaleService,
  ServiceConfig,
} from '@utilities/angular-web-utils';
import { BaseComponent } from '../../../core/base.component';
import { InformationDialogData } from '../model/information-dialog.model';

@Injectable({
  providedIn: 'root',
})
export class InformationDialogService extends BaseComponent {
  constructor(
    private dialog: MatDialog,
    contentService: ContentService,
    localService: LocaleService,
    svcConfig: ServiceConfig
  ) {
    super(contentService, localService, svcConfig);
  }

  /**
   * @description opens a Information dialog and retuns a observable that emits user action
   * true if user confirmed
   */
  public open(matDialogConfig: MatDialogConfig<InformationDialogData>) {
    matDialogConfig = this.setDialogConfigProperties(matDialogConfig);
    matDialogConfig = this.setDialogDefaultData(matDialogConfig);

    let dialogRef = this.dialog.open(
      InformationDialogComponent,
      matDialogConfig
    );
    return dialogRef.afterClosed();
  }

  /**
   * @description use this method to set the default values for dialog data
   * @returns MatDialogConfig
   */
  private setDialogDefaultData(
    matDialogConfig: MatDialogConfig<InformationDialogData>
  ): MatDialogConfig {
    matDialogConfig.data.closeButtonTextKey = matDialogConfig.data
      .closeButtonTextKey
      ? matDialogConfig.data.closeButtonTextKey
      : 'common.close';

    if (matDialogConfig.data.type == 'Error') {
      matDialogConfig.data.icon = matDialogConfig.data.icon
        ? matDialogConfig.data.icon
        : 'error';
    }

    if (matDialogConfig.data.type == 'Information') {
      matDialogConfig.data.icon = matDialogConfig.data.icon
        ? matDialogConfig.data.icon
        : 'info';
    }

    if (matDialogConfig.data.type == 'Success') {
      matDialogConfig.data.icon = matDialogConfig.data.icon
        ? matDialogConfig.data.icon
        : 'check_circle';
    }

    if (matDialogConfig.data.type == 'Warn') {
      matDialogConfig.data.icon = matDialogConfig.data.icon
        ? matDialogConfig.data.icon
        : 'warning_amber';
    }

    return matDialogConfig;
  }

  /**
   * @description use this method to set the dialog properties using the matDialogConfig model
   * @returns MatDialogConfig
   */
  private setDialogConfigProperties(
    matDialogConfig: MatDialogConfig<InformationDialogData>
  ): MatDialogConfig {
    matDialogConfig.width = '30vw';
    return matDialogConfig;
  }
}
