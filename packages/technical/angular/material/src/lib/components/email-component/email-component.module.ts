import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailComponent } from './email/email.component';
import { InputTextModule } from '../input-text/input-text.module';
import { RichTextEditorModule } from '../rich-text-editor/rich-text-editor.module';
import { MatButtonModule } from '@angular/material/button';
import { ChipListModule } from '../chip-list/chip-list.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [EmailComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    RichTextEditorModule,
    MatButtonModule,
    ChipListModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  exports: [EmailComponent],
})
export class EmailModule {
  constructor() {}
}
