import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimitiveFormField } from '../shared/abstractions/primitive-form-field';
import { InputOld } from '@ui-old/input/input';

@Component({
  selector: 'app-form-field-input',
  imports: [ReactiveFormsModule, InputOld],
  templateUrl: './form-field-input.html',
  styleUrl: './form-field-input.scss',
})
export class FormFieldInput extends PrimitiveFormField {}
