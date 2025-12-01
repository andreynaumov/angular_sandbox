import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimitiveFormField } from '../shared/abstractions/primitive-form-field';
import { CheckboxOld } from '@ui-old/checkbox/checkbox';

@Component({
  selector: 'app-form-field-boolean',
  imports: [ReactiveFormsModule, CheckboxOld],
  templateUrl: './form-field-boolean.html',
  styleUrl: './form-field-boolean.scss',
})
export class FormFieldBoolean extends PrimitiveFormField {}
