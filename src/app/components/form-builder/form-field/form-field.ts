import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { FormControl, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FORM_FIELD_COMPONENTS } from '../shared/constants/form-field-components';
import { FormFieldSchema } from '../shared/types/form-schema';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, merge, mergeMap, startWith } from 'rxjs';
import { CustomField } from '../shared/custom-field';
import { DependencyType } from '../shared/types/form-config';

@Component({
  selector: 'app-form-field',
  imports: [NgComponentOutlet, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
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
      config: fieldSchema.config,
    };

    return fieldSchema.type === 'array' || fieldSchema.type === 'object'
      ? { ...commonInputs, fieldSchema: fieldSchema.schema, customFields: this.customFields() }
      : { ...commonInputs, isReadonly: this.isReadonly() };
  });

  private readonly currentControlValue = toSignal(
    merge(
      toObservable(this.control).pipe(map(({ value }) => value)), // Get the initial value when 'control' changes
      toObservable(this.control).pipe(mergeMap(({ valueChanges }) => valueChanges)), // Get the new value when 'control.value' changes
    ),
  );

  constructor() {
    effect(() => {
      const rootControl = this.getRootControl();

      const valueChangesFn = this.fieldSchema().config?.expressions?.valueChanges;

      if (valueChangesFn) {
        valueChangesFn({ form: rootControl, currentControlValue: this.currentControlValue() });
      }
    });

    effect(() => {
      const rootControl = this.getRootControl();
      const dependencies = this.fieldSchema().config?.dependencies;

      if (!dependencies) return;

      for (const dependency of dependencies) {
        const sourceControl = this.findControlByName(dependency.sourceField, rootControl);

        if (!sourceControl) {
          throw new Error(`Control with ${dependency.sourceField} is not exists`);
        }

        sourceControl.valueChanges
          .pipe(startWith(sourceControl.value), takeUntilDestroyed(this.destroyRef))
          .subscribe((sourceControlValue) => {
            const result = dependency.when({ form: rootControl, sourceControlValue });

            switch (dependency.type) {
              case DependencyType.Hide:
                this.isShow.set(!result);
                break;

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

  private getRootControl(): UntypedFormGroup {
    let currentControl = this.control();

    while (currentControl.parent) currentControl = currentControl.parent;

    return currentControl as UntypedFormGroup;
  }

  private findControlByName(controlName: string, rootControl: UntypedFormGroup): FormControl | null {
    let control: null | FormControl = null;

    for (const [currentControlName, currentControl] of Object.entries(rootControl.controls)) {
      if (currentControlName === controlName) {
        // @ts-ignore
        control = currentControl;
      }

      if ('controls' in currentControl && Array.isArray(currentControl.controls)) {
        //
      }

      if ('controls' in currentControl) {
        // @ts-ignore
        control = this.findControlByName(currentControlName, currentControl);
      }
    }

    return control;
  }
}
