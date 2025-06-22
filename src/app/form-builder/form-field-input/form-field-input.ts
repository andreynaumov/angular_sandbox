import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { PrimitiveFormField } from '../shared/abstractions/primitive-form-field';

@Component({
  selector: 'app-form-field-input',
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './form-field-input.html',
  styleUrl: './form-field-input.scss',
})
export class FormFieldInput extends PrimitiveFormField {}
