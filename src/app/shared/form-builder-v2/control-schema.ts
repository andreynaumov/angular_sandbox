import { signal } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { BaseSchema } from './base-schema';
import { SelectOption } from '@ui-old/select/select';
import { Dependency } from './dependency';

export class ControlSchema<T> extends BaseSchema {
  readonly #isHide = signal(false);
  readonly #label = signal<string>('[null]');
  readonly #placeholder = signal<string>('[null]');
  readonly #fieldType = signal<'input' | 'checkbox' | 'date' | 'select'>('input');
  readonly #options = signal<SelectOption<T>[]>([]);

  readonly #dependencies: Dependency<any>[] = [];

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

  addMeta(params: { fieldType: 'input' | 'checkbox' | 'date' | 'select'; label: string; placeholder: string }): this {
    const { fieldType, label, placeholder } = params;
    this.#fieldType.set(fieldType);
    this.#label.set(label);
    this.#placeholder.set(placeholder);

    return this;
  }

  addOptions(options: SelectOption<T>[]): this {
    this.#options.set(options);
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
    this.#addDependency(sourceControlSchema, (result) => {
      const isHide = logicFn(result);

      if (isHide) {
        this.control.reset();
      }

      this.#isHide.set(isHide);
    });

    return this;
  }

  /**
   * Добавляет зависимость блокировки поля от значения другого контрола
   * @param sourceControlSchema - схема контрола-источника
   * @param logicFn - функция, возвращающая true если поле должно быть заблокировано
   */
  addDisableDependency<R>(sourceControlSchema: ControlSchema<R>, logicFn: (value: R) => boolean): this {
    this.#addDependency(sourceControlSchema, (result) => {
      if (logicFn(result)) {
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
    this.#addDependency(sourceControlSchema, (result) => {
      if (logicFn(result)) {
        this.control.addValidators(validators);
      } else {
        this.control.removeValidators(validators);
      }
      this.control.updateValueAndValidity();
    });

    return this;
  }

  runDependencyTracking(): void {
    this.#dependencies.forEach((dependency) => {
      dependency.subscribe();
    });
  }

  runDependencies(): void {
    this.#dependencies.forEach((dependency) => {
      dependency.runOnce();
    });
  }

  /**
   * Очищает все подписки и помечает схему как уничтоженную
   * Должен вызываться при уничтожении компонента/сервиса для предотвращения утечек памяти
   */
  destroyDependencyTracking(): void {
    this.#dependencies.forEach((dependency) => {
      dependency.unsubscribe();
    });
  }

  /**
   * Общий метод для создания подписки на изменения зависимого контрола
   * @private
   */
  #addDependency<R>(sourceControlSchema: ControlSchema<R>, callback: (result: R) => void): void {
    this.#dependencies.push(new Dependency(sourceControlSchema, callback));
  }
}
