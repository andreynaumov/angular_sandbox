import { Directive, input } from '@angular/core';
import { BaseFormField } from './base-form-field';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class PrimitiveFormField extends BaseFormField<FormControl> {
  protected readonly isReadonly = input.required<boolean>();
}
