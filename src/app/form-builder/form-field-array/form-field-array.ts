import { Component, computed, forwardRef } from '@angular/core';
import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormField } from '../form-field/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { buildForm } from '../shared/functions/build-form.function';
import { CompositeFormField } from '../shared/abstractions/composite-form-field';

@Component({
  selector: 'app-form-field-array',
  imports: [forwardRef(() => FormField), MatButtonModule, MatIconModule],
  templateUrl: './form-field-array.html',
  styleUrl: './form-field-array.scss',
})
export class FormFieldArray extends CompositeFormField<UntypedFormArray> {
  public readonly controls = computed<FormGroup<Record<string, UntypedFormArray | UntypedFormGroup | UntypedFormControl>>[]>(
    () => this.control().controls as FormGroup<Record<string, UntypedFormArray | UntypedFormGroup | UntypedFormControl>>[],
  );

  public addItem() {
    const parentControlArray = this.control();
    const fieldSchema = this.fieldSchema();

    if (!fieldSchema) return;

    const createdControl = buildForm({ schema: fieldSchema, model: null }).form;

    parentControlArray.push(createdControl);
  }

  public removeItem(controlIndex: number) {
    this.control().removeAt(controlIndex);
  }
}
