import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from './input-text/input-text.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { FormErrorsModule } from '../form-errors/form-errors.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [InputTextComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    FormErrorsModule,
    MatButtonModule,
  ],
  exports: [InputTextComponent],
})
export class InputTextModule {}
