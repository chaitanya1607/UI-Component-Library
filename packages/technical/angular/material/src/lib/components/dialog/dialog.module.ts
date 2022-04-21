import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { InformationDialogComponent } from './information-dialog/information-dialog.component';
import { ConfirmDialogComponent } from './confirmation-dialog/confirm-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/service/confirmation-dialog.service';
import { InformationDialogService } from './information-dialog/service/information-dialog.service';
import { ComponentDialogService } from './component-dialog/service/component-dialog.service';
import { SharedModule } from '../../../shared/storybook/shared.module';
import { ContentPipe } from '@utilities/angular-web-utils';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
    InformationDialogComponent,
    ContentPipe,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    SharedModule,
  ],
  providers: [
    ConfirmationDialogService,
    InformationDialogService,
    ComponentDialogService,
  ],
  exports: [ConfirmDialogComponent, InformationDialogComponent],
  entryComponents: [ConfirmDialogComponent, InformationDialogComponent],
})
export class DialogModule {}
