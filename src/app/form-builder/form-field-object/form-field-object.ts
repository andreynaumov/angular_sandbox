import { Component, forwardRef } from '@angular/core';
import { FormField } from '../form-field/form-field';
import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { CompositeFormField } from '../shared/abstractions/composite-form-field';

@Component({
  selector: 'app-form-field-object',
  imports: [forwardRef(() => FormField)],
  templateUrl: './form-field-object.html',
  styleUrl: './form-field-object.scss',
})
export class FormFieldObject extends CompositeFormField<
  FormGroup<Record<string, UntypedFormArray | UntypedFormGroup | UntypedFormControl>>
> {}
