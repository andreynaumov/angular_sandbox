import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PrimitiveFormField } from '../shared/abstractions/primitive-form-field';

@Component({
  selector: 'app-form-field-select',
  imports: [ReactiveFormsModule, MatSelectModule],
  templateUrl: './form-field-select.html',
  styleUrl: './form-field-select.scss',
})
export class FormFieldSelect extends PrimitiveFormField {}
