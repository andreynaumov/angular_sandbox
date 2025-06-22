import { Directive, input } from '@angular/core';
import { FormFieldConfig } from '../types/form-config';
import { FormControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Directive()
export abstract class BaseFormField<
  T extends FormControl | UntypedFormArray | FormGroup<Record<string, UntypedFormArray | UntypedFormGroup | UntypedFormControl>>,
> {
  protected readonly control = input.required<T>();
  protected readonly config = input<FormFieldConfig>();
}
