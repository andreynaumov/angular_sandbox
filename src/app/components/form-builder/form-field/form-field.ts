import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FORM_FIELD_COMPONENTS } from '../shared/constants/form-field-components';
import { FormFieldSchema } from '../shared/types/form-schema';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { CustomField } from '../shared/custom-field';
import { DependencyType } from '../shared/types/form-config';
import { getRootControl } from '../shared/functions/get-root-control';
import { findControlByName } from '../shared/functions/find-control-by-name';

@Component({
  selector: 'app-form-field',
  imports: [NgComponentOutlet, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  host: {
    '[class]': 'cssClasses()',
    '[style]': 'cssStyles()',
  },
})
export class FormField {
  private readonly destroyRef = inject(DestroyRef);

  public readonly fieldName = input.required<string>();
  public readonly fieldSchema = input.required<FormFieldSchema>();
  public readonly control = input.required<UntypedFormControl | UntypedFormGroup | UntypedFormArray>();
  public readonly customFields = input.required<readonly CustomField[]>();

  public readonly isShow = signal(true);
  public readonly isReadonly = signal(false);

  public readonly componentRef = computed(() => FORM_FIELD_COMPONENTS[this.fieldSchema().type]);
  public readonly customField = computed(() => this.customFields()?.find((customField) => customField.name() === this.fieldName()));

  public readonly componentInputs = computed(() => {
    const fieldSchema = this.fieldSchema();

    const commonInputs = {
      control: this.control(),
      fieldName: this.fieldName(),
      config: fieldSchema.config,
    };

    return fieldSchema.type === 'array' || fieldSchema.type === 'object'
      ? { ...commonInputs, fieldSchema: fieldSchema.schema, customFields: this.customFields() }
      : { ...commonInputs, isReadonly: this.isReadonly() };
  });

  public readonly cssClasses = computed(
    () =>
      `${this.fieldSchema().config?.cssClasses?.join(' ') ?? ''} ${this.isShow() ? 'd-block' : 'd-none'} ${this.isReadonly() ? 'readonly' : ''}`,
  );

  public readonly cssStyles = computed(() => this.fieldSchema().config?.cssStyles ?? {});

  constructor() {
    effect(() => {
      const rootControl = getRootControl(this.control());
      const dependencies = this.fieldSchema().config?.dependencies;

      if (!dependencies) return;

      for (const dependency of dependencies) {
        const sourceControl = findControlByName(dependency.sourceField, rootControl);

        if (!sourceControl) {
          throw new Error(`Control with ${dependency.sourceField} is not exists`);
        }

        sourceControl.valueChanges
          .pipe(startWith(sourceControl.value), takeUntilDestroyed(this.destroyRef))
          .subscribe((sourceControlValue) => {
            const result = dependency.when({ form: rootControl, sourceControlValue });

            switch (dependency.type) {
              case DependencyType.Hide: {
                const isShow = !result;

                this.isShow.set(isShow);

                const controlValidators = this.fieldSchema().config?.validators ?? [];

                if (isShow) {
                  this.control().addValidators(controlValidators);
                } else {
                  this.control().removeValidators(controlValidators);
                  this.control().reset();
                }

                this.control().updateValueAndValidity();
                break;
              }

              case DependencyType.Disabled:
                result ? this.control().disable() : this.control().enable();
                break;

              case DependencyType.Readonly:
                this.isReadonly.set(result);
                break;

              case DependencyType.AddValidators:
                result ? this.control().addValidators(dependency.validators) : this.control().removeValidators(dependency.validators);
                this.control().updateValueAndValidity();
                break;
            }
          });
      }
    });
  }
}
