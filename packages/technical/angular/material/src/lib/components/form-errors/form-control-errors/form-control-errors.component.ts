import { Component, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-form-control-errors',
  templateUrl: './form-control-errors.component.html',
  styleUrls: ['./form-control-errors.component.scss'],
})
export class FormControlErrorsComponent implements OnInit {
  @Input() control: NgControl;

  constructor() {}

  ngOnInit(): void {}
}
