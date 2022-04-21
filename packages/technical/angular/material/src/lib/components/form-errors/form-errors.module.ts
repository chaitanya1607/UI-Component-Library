import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormControlErrorsComponent } from './form-control-errors/form-control-errors.component';

@NgModule({
  declarations: [FormControlErrorsComponent],
  imports: [CommonModule],
  exports: [FormControlErrorsComponent],
})
export class FormErrorsModule {}
