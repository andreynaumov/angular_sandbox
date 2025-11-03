import { ChangeDetectorRef, Directive, effect, inject, input, untracked } from '@angular/core';
import { FormFieldConfig } from '../types/form-config';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, merge, mergeMap } from 'rxjs';
import { getRootControl } from '../functions/get-root-control';
import { FormModel } from '../types/form-model';

/**
 * Базовый класс для всех компонентов полей формы.
 * Предоставляет общий функционал для управления контролами, конфигурацией и изменениями значений.
 *
 * @template T - Тип контрола формы (FormControl, FormGroup или FormArray)
 */
@Directive()
export abstract class BaseFormField<T extends UntypedFormControl | UntypedFormGroup | UntypedFormArray> {
  protected readonly cdr = inject(ChangeDetectorRef);

  protected readonly control = input.required<T>();
  protected readonly fieldName = input.required<string>();
  protected readonly config = input.required<FormFieldConfig>();
  protected readonly formModel = input.required<FormModel | null | undefined>();
  protected readonly formErrors = input.required<Record<string, string[]> | null | undefined>();

  protected readonly currentControlValue = toSignal(
    merge(
      toObservable(this.control).pipe(map(({ value }) => value)), // Get the initial value when 'control' changes
      toObservable(this.control).pipe(mergeMap(({ valueChanges }) => valueChanges)), // Get the new value when 'control.value' changes
    ),
  );

  /**
   * Эффект, который выполняет пользовательское выражение valueChanges при изменении значения контрола.
   * Полезен для реализации пользовательской логики при изменении значений (например, обновление других полей).
   */
  valueChangeExpressionEffect = effect(() => {
    const valueChangesFn = untracked(this.config).expressions?.valueChanges;

    if (valueChangesFn) {
      valueChangesFn({ form: getRootControl(untracked(this.control)), currentControlValue: this.currentControlValue() });
    }
  });
}
