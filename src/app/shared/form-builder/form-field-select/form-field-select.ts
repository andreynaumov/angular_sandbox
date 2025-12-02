import { Component, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimitiveFormField } from '../shared/abstractions/primitive-form-field';
import { SelectOld } from '@ui-old/select/select';

@Component({
  selector: 'app-form-field-select',
  imports: [ReactiveFormsModule, SelectOld],
  templateUrl: './form-field-select.html',
  styleUrl: './form-field-select.scss',
})
export class FormFieldSelect extends PrimitiveFormField {
  public readonly options = computed(() => {
    return this.config().options?.map((option) => ({ label: option.viewValue, value: option.value })) ?? [];
  });
}
