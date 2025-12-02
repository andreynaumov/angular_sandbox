import { signal } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { auditTime, distinctUntilChanged, map, startWith, Subscription } from 'rxjs';
import { BaseSchema } from './base-schema';
import { SelectOption } from '@ui-old/select/select';

export function createControlSchema<T>(name: string, control: FormControl<T>) {
  return new ControlSchema(name, control);
}

export class ControlSchema<T> extends BaseSchema {
  readonly #isHide = signal(false);
  readonly #label = signal<string>('[null]');
  readonly #placeholder = signal<string>('[null]');
  readonly #fieldType = signal<'input' | 'checkbox' | 'date' | 'select'>('input');
  readonly #options = signal<SelectOption<T>[]>([]);

  readonly #subscriptions = new Set<Subscription>();
  #isDestroyed = false;

  #blur: (value: T) => void = () => undefined;

  constructor(
    name: string,
    private readonly control: FormControl<T>,
  ) {
    super(name, 'control');
  }

  meta() {
    return {
      name: this.controlName,
      type: this.#fieldType,
      label: this.#label,
      placeholder: this.#placeholder,
      options: this.#options,
      blurFn: this.#blur,
    };
  }

  value() {
    return {
      control: this.control,
      isHide: this.#isHide,
    };
  }

  onBlur(fn: (value: T) => void) {
    this.#blur = fn;
    return this;
  }

  addFieldType(fieldType: 'input' | 'checkbox' | 'date' | 'select'): this {
    this.#fieldType.set(fieldType);
    return this;
  }

  addLabel(label: string): this {
    this.#label.set(label);
    return this;
  }

  addOptions(options: SelectOption<T>[]): this {
    this.#options.set(options);
    return this;
  }

  addPlaceholder(placeholder: string): this {
    this.#placeholder.set(placeholder);
    return this;
  }

  addValidators(validators: ValidatorFn[]): this {
    this.control.addValidators(validators);
    return this;
  }

  /**
   * Добавляет зависимость скрытия поля от значения другого контрола
   * @param sourceControlSchema - схема контрола-источника
   * @param logicFn - функция, возвращающая true если поле должно быть скрыто
   */
  addHideDependency<R>(sourceControlSchema: ControlSchema<R>, logicFn: (value: R) => boolean): this {
    this.#subscribeToDependency(sourceControlSchema, logicFn, (result) => {
      if (result) {
        this.control.reset();
      }

      this.#isHide.set(result);
    });

    return this;
  }

  /**
   * Добавляет зависимость блокировки поля от значения другого контрола
   * @param sourceControlSchema - схема контрола-источника
   * @param logicFn - функция, возвращающая true если поле должно быть заблокировано
   */
  addDisableDependency<R>(sourceControlSchema: ControlSchema<R>, logicFn: (value: R) => boolean): this {
    this.#subscribeToDependency(sourceControlSchema, logicFn, (result) => {
      if (result) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    });

    return this;
  }

  /**
   * Добавляет зависимость валидаторов от значения другого контрола
   * @param sourceControlSchema - схема контрола-источника
   * @param validators - валидаторы, которые будут добавлены/удалены
   * @param logicFn - функция, возвращающая true если валидаторы должны быть активны
   */
  addValidatorsDependency<R>(sourceControlSchema: ControlSchema<R>, validators: ValidatorFn[], logicFn: (value: R) => boolean): this {
    this.#subscribeToDependency(sourceControlSchema, logicFn, (result) => {
      if (result) {
        this.control.addValidators(validators);
      } else {
        this.control.removeValidators(validators);
      }
      this.control.updateValueAndValidity();
    });

    return this;
  }

  /**
   * Общий метод для создания подписки на изменения зависимого контрола
   * @private
   */
  #subscribeToDependency<R>(
    sourceControlSchema: ControlSchema<R>,
    logicFn: (value: R) => boolean,
    callback: (result: boolean) => void,
  ): void {
    if (this.#isDestroyed) {
      console.warn(`Cannot add dependency to destroyed ControlSchema: ${this.controlName}`);
      return;
    }

    const subscription = sourceControlSchema.control.valueChanges
      .pipe(startWith(sourceControlSchema.control.value), map(logicFn), distinctUntilChanged(), auditTime(0))
      .subscribe(callback);

    this.#subscriptions.add(subscription);
  }

  /**
   * Очищает все подписки и помечает схему как уничтоженную
   * Должен вызываться при уничтожении компонента/сервиса для предотвращения утечек памяти
   */
  destroy(): void {
    if (this.#isDestroyed) {
      return;
    }

    this.#subscriptions.forEach((sub) => sub.unsubscribe());
    this.#subscriptions.clear();
    this.#isDestroyed = true;
  }
}
