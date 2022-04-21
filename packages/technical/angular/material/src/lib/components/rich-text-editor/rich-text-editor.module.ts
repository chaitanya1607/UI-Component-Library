import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { RichTextEditorComponent } from './rich-text-editor/rich-text-editor.component';

@NgModule({
  declarations: [RichTextEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
  ],
  exports: [RichTextEditorComponent],
})
export class RichTextEditorModule {}
