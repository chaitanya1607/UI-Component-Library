import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipListComponent } from './chip-list/chip-list.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChipListComponent],
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  exports: [ChipListComponent],
})
export class ChipListModule {}
