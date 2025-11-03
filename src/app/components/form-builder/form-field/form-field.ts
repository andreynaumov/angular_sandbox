import { Component, computed, effect, input, OnDestroy, signal, untracked } from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FORM_FIELD_COMPONENTS } from '../shared/constants/form-field-components';
import { FormFieldSchema } from '../shared/types/form-schema';
import { Subscription } from 'rxjs';
import { CustomField } from '../shared/custom-field';
import { Dependency, DependencyType } from '../shared/types/form-config';
import { getRootControl } from '../shared/functions/get-root-control';
import { findControlByName } from '../shared/functions/find-control-by-name';
import { FormModel } from '../shared/types/form-model';

/**
 * Компонент динамического поля формы, который рендерит соответствующий тип поля на основе схемы.
 * Обрабатывает зависимости полей, видимость, валидацию и рендеринг пользовательских полей.
 */
@Component({
  selector: 'app-form-field',
  imports: [NgComponentOutlet, ReactiveFormsModule, NgTemplateOutlet],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
  },
})
export class FormField implements OnDestroy {
  public readonly fieldName = input.required<string>();
  public readonly fieldSchema = input.required<FormFieldSchema>();
  public readonly control = input.required<UntypedFormControl | UntypedFormGroup | UntypedFormArray>();
  public readonly customFields = input.required<readonly CustomField[]>();
  public readonly formModel = input.required<FormModel | null | undefined>();
  public readonly formErrors = input.required<Record<string, string[]> | null | undefined>();

  public readonly isShow = signal(true);
  public readonly isReadonly = signal(false);

  public readonly componentRef = computed(() => FORM_FIELD_COMPONENTS[this.fieldSchema().type]);
  public readonly componentInputs = computed(() => {
    const fieldSchema = this.fieldSchema();

    const commonInputs = {
      control: this.control(),
      fieldName: this.fieldName(),
      config: fieldSchema.config,
      formModel: this.formModel(),
      formErrors: this.formErrors(),
    };

    return fieldSchema.type === 'array' || fieldSchema.type === 'object'
      ? { ...commonInputs, fieldSchema: fieldSchema.schema, customFields: this.customFields() }
      : { ...commonInputs, isReadonly: this.isReadonly() };
  });

  public readonly currentCustomField = computed(
    () => this.customFields()?.find((customField) => customField.name() === this.fieldName())?.templateRef ?? null,
  );

  public readonly hostClasses = computed(
    () =>
      `${this.fieldSchema().config?.cssClasses?.join(' ') ?? ''} ${this.isShow() ? 'd-block' : 'd-none'} ${this.isReadonly() ? 'readonly' : ''}`,
  );

  public readonly hostStyles = computed(() => this.fieldSchema().config?.cssStyles ?? {});

  readonly #valueChangesSubscriptions = new Map<string, Subscription>();

  /**
   * Эффект, который настраивает зависимости полей (hide, disable, readonly, validators).
   * Подписывается на изменения исходного поля и соответственно обновляет текущее поле.
   */
  readonly dependenciesEffect = effect(() => {
    const control = untracked(this.control);
    const fieldSchema = untracked(this.fieldSchema);
    const dependencies = fieldSchema.config.dependencies;

    if (!dependencies) return;

    const rootControl = getRootControl(control);

    for (const dependency of dependencies) {
      const sourceControl = findControlByName(dependency.sourceField, rootControl);

      if (!sourceControl) {
        throw new Error(`Control with ${dependency.sourceField} is not exists`);
      }

      let prevSub = this.#valueChangesSubscriptions.get(dependency.sourceField) ?? null;

      if (prevSub) {
        prevSub.unsubscribe();
      }

      this.#updateDependencies({
        isFirstUpdate: true,
        payload: { dependency, rootControl, sourceControlValue: sourceControl.value, control, fieldSchema },
      });

      prevSub = sourceControl.valueChanges.subscribe((sourceControlValue) => {
        this.#updateDependencies({
          isFirstUpdate: false,
          payload: { dependency, rootControl, sourceControlValue, control, fieldSchema },
        });
      });

      this.#valueChangesSubscriptions.set(dependency.sourceField, prevSub);
    }
  });

  #updateDependencies({
    isFirstUpdate,
    payload,
  }: {
    isFirstUpdate: boolean;
    payload: {
      dependency: Dependency;
      rootControl: UntypedFormGroup;
      sourceControlValue: unknown;
      control: UntypedFormControl | UntypedFormGroup | UntypedFormArray;
      fieldSchema: FormFieldSchema;
    };
  }): void {
    const { dependency, rootControl, sourceControlValue, control, fieldSchema } = payload;

    const result = dependency.when({ form: rootControl, sourceControlValue });

    switch (dependency.type) {
      case DependencyType.Hide: {
        const isShow = !result;

        const controlValidators = fieldSchema.config.validators ?? [];

        if (isShow) {
          control.addValidators(controlValidators);
        } else {
          control.removeValidators(controlValidators);
        }

        if (!isFirstUpdate) {
          control.setValue(null);
        }

        this.isShow.set(isShow);

        break;
      }

      case DependencyType.Disabled:
        if (result) {
          control.disable({ emitEvent: false });
        } else {
          control.enable({ emitEvent: false });
        }

        break;

      case DependencyType.Readonly:
        this.isReadonly.set(result);
        break;

      case DependencyType.AddValidators:
        if (result) {
          control.addValidators(dependency.validators);
        } else {
          control.removeValidators(dependency.validators);
        }

        control.updateValueAndValidity();

        break;
    }
  }

  /**
   * Очистка подписок для предотвращения утечек памяти.
   */
  public ngOnDestroy(): void {
    this.#valueChangesSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.#valueChangesSubscriptions.clear();
  }
}
