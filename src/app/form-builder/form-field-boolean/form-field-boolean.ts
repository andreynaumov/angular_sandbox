import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PrimitiveFormField } from '../shared/abstractions/primitive-form-field';

@Component({
  selector: 'app-form-field-boolean',
  imports: [ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './form-field-boolean.html',
  styleUrl: './form-field-boolean.scss',
})
export class FormFieldBoolean extends PrimitiveFormField {}
