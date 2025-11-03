import { computed, Directive, effect, input, signal, untracked } from '@angular/core';
import { BaseFormField } from './base-form-field';
import { UntypedFormControl, ValidationErrors } from '@angular/forms';

type FieldError = Record<string, unknown>;

/**
 * Базовый класс для примитивных компонентов полей формы (input, select, checkbox, date и т.д.).
 * Обрабатывает инициализацию значений, пользовательские ошибки и события полей (blur, select).
 */
@Directive()
export abstract class PrimitiveFormField extends BaseFormField<UntypedFormControl> {
  protected readonly isReadonly = input.required<boolean>();

  readonly #customErrors = signal<FieldError | null>(null);

  public readonly validationErrors = computed(() => ({ ...this.config().validationErrors, ...this.#customErrors() }));

  /**
   * Обрабатывает событие blur на поле.
   * Выполняет пользовательское выражение onBlur, если оно указано в конфигурации.
   */
  public onBlurEvent(): void {
    const onBlurExpression = this.config().expressions?.onBlur;

    if (!onBlurExpression) return;

    onBlurExpression({ fieldName: this.fieldName(), fieldValue: this.control().value, status: this.control().status });
  }

  /**
   * Обрабатывает событие select на поле (например, выбор опции в выпадающем списке).
   * Выполняет пользовательское выражение onSelect, если оно указано в конфигурации.
   */
  public onSelectEvent(): void {
    const onSelectExpression = this.config().expressions?.onSelect;

    if (!onSelectExpression) return;

    onSelectExpression({ fieldName: this.fieldName(), fieldValue: this.control().value, status: this.control().status });
  }

  /**
   * Эффект, который применяет пользовательские ошибки из родительской формы (например, ошибки валидации с сервера).
   */
  readonly setCustomErrorsEffect = effect(() => {
    const customControlErrors = this.formErrors()?.[this.fieldName()];

    if (!customControlErrors) return;

    const customErrors: ValidationErrors = {};
    const customErrorsText: FieldError = {};

    customControlErrors.forEach((value, index) => {
      customErrors[index.toString()] = true;
      customErrorsText[index.toString()] = value;
    });

    this.#customErrors.set(customErrorsText);

    this.control().setErrors(customErrors);
    this.control().markAllAsTouched();
  });

  readonly #setControlValueEffect = effect(() => {
    this.#updateControlValue();
  });

  #updateControlValue(): void {
    const control = untracked(this.control);
    const fieldName = untracked(this.fieldName);
    const formModel = this.formModel();

    const model = formModel?.[fieldName];

    if (model === null || model === undefined) return;

    /**
     * Устанавливаем значение только если оно есть в formModel.
     * Используем { emitEvent: false }, чтобы не триггерить valueChanges у контролов.
     * Нам нужно только задать начальное значение для контрола.
     */
    control.setValue(model, { emitEvent: false });

    /**
     * Очищаем effect, так как нам нужно установить значение только один раз.
     */
    this.#setControlValueEffect.destroy();

    /**
     * Оборачиваем в setTimeout для того, чтобы у контролов обновились лейблы
     */
    setTimeout(() => {
      this.cdr.markForCheck();
    }, 100);
  }
}
