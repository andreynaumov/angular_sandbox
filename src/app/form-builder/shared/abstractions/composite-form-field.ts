import { Directive, input } from '@angular/core';
import { BaseFormField } from './base-form-field';
import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormSchema } from '../types/form-schema';
import { CustomField } from '../custom-field';

@Directive()
export abstract class CompositeFormField<
  T extends UntypedFormArray | FormGroup<Record<string, UntypedFormArray | UntypedFormGroup | UntypedFormControl>>,
> extends BaseFormField<T> {
  protected readonly fieldSchema = input.required<FormSchema>();
  protected readonly customFields = input.required<readonly CustomField[]>();
}
