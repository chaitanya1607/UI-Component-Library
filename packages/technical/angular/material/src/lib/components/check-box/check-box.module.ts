import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckBoxComponent } from './checkbox/checkbox.component';
import { CheckboxGroupComponent } from './checkbox-group/checkbox-group.component';
import { FormErrorsModule } from '../form-errors/form-errors.module';

@NgModule({
  declarations: [CheckBoxComponent, CheckboxGroupComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
  ],
  exports: [CheckBoxComponent, CheckboxGroupComponent],
})
export class CheckBoxModule {}
