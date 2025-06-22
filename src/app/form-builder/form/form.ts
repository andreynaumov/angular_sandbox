import { Component, computed, contentChildren, DestroyRef, effect, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../form-field/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CustomField } from '../shared/custom-field';
import { FormSchema } from '../shared/types/form-schema';
import { FormModel } from '../shared/types/form-model';
import { buildForm } from '../shared/functions/build-form.function';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, FormField, MatButtonModule],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form {
  public readonly formSchema = input.required<FormSchema>();
  public readonly formModel = input<FormModel | null | undefined>(null);

  public readonly submitEvent = output<Record<string, unknown>>();

  public readonly customFields = contentChildren(CustomField);

  public readonly formData = computed(() => buildForm({ schema: this.formSchema(), model: this.formModel() }));
  public readonly form = computed(() => this.formData().form);

  public getCustomField(fieldName: string): CustomField | undefined {
    return this.customFields().find((customField) => customField.name() === fieldName);
  }

  public onSubmit() {
    this.submitEvent.emit(this.form().getRawValue());
  }
}
