import { signal } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { BaseSchema } from './base-schema';
import { SelectOption } from '@ui-old/select/select';
import { Dependency } from './dependency';

export type FieldType = 'input' | 'checkbox' | 'date' | 'select';

/**
 * Схема для отдельных элементов управления формы с реактивными возможностями и управлением зависимостями.
 * Предоставляет fluent API для конфигурации и автоматическое управление жизненным циклом.
 */
export class ControlSchema<T> extends BaseSchema {
  readonly #isHide = signal(false);
  readonly #label = signal<string>('[null]');
  readonly #placeholder = signal<string>('[null]');
  readonly #fieldType = signal<FieldType>('input');
  readonly #options = signal<SelectOption<T>[]>([]);

  readonly #dependencies: Dependency<any>[] = [];

  #blurHandler: (value: T) => void = () => undefined;

  constructor(
    name: string,
    private readonly control: FormControl<T>,
  ) {
    super(name, 'control');
  }

  /**
   * Возвращает метаданные для отображения в шаблоне
   */
  meta() {
    return {
      name: this.controlName,
      type: this.#fieldType,
      label: this.#label,
      placeholder: this.#placeholder,
      options: this.#options,
      blurFn: this.#blurHandler,
    };
  }

  /**
   * Возвращает реактивные значения для привязки к шаблону
   */
  value() {
    return {
      control: this.control,
      isHide: this.#isHide,
    };
  }

  /**
   * Устанавливает тип поля
   */
  setFieldType(fieldType: FieldType): this {
    this.#fieldType.set(fieldType);
    return this;
  }

  /**
   * Устанавливает подпись поля
   */
  setLabel(label: string): this {
    this.#label.set(label);
    return this;
  }

  /**
   * Устанавливает placeholder поля
   */
  setPlaceholder(placeholder: string): this {
    this.#placeholder.set(placeholder);
    return this;
  }

  /**
   * Устанавливает полные метаданные поля за один вызов
   */
  setMeta(params: { fieldType: FieldType; label: string; placeholder: string }): this {
    const { fieldType, label, placeholder } = params;
    this.#fieldType.set(fieldType);
    this.#label.set(label);
    this.#placeholder.set(placeholder);
    return this;
  }

  /**
   * Устанавливает обработчик события blur
   */
  onBlur(handler: (value: T) => void): this {
    this.#blurHandler = handler;
    return this;
  }

  /**
   * Добавляет опции для полей типа select
   * Примечание: Этот метод должен использоваться только для полей типа 'select'
   */
  addOptions(options: SelectOption<T>[]): this {
    if (this.#fieldType() !== 'select') {
      console.warn(`Опции могут быть установлены только для типа поля 'select'. Текущий тип: ${this.#fieldType()}`);
    }
    this.#options.set(options);
    return this;
  }

  /**
   * Добавляет валидаторы к элементу управления формы
   */
  addValidators(validators: ValidatorFn[]): this {
    this.control.addValidators(validators);
    return this;
  }

  /**
   * Добавляет зависимость скрытия от другого контрола
   * @param sourceControlSchema - Исходный контрол для зависимости
   * @param predicate - Функция, возвращающая true, когда это поле должно быть скрыто
   */
  addHideDependency<R>(sourceControlSchema: ControlSchema<R>, predicate: (value: R) => boolean): this {
    this.#addDependency(sourceControlSchema, (result) => {
      const shouldHide = predicate(result);

      if (shouldHide) {
        this.control.reset();
      }

      this.#isHide.set(shouldHide);
    });

    return this;
  }

  /**
   * Добавляет зависимость отключения от другого контрола
   * @param sourceControlSchema - Исходный контрол для зависимости
   * @param predicate - Функция, возвращающая true, когда это поле должно быть отключено
   */
  addDisableDependency<R>(sourceControlSchema: ControlSchema<R>, predicate: (value: R) => boolean): this {
    this.#addDependency(sourceControlSchema, (result) => {
      if (predicate(result)) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    });

    return this;
  }

  /**
   * Добавляет условные валидаторы на основе значения другого контрола
   * @param sourceControlSchema - Исходный контрол для зависимости
   * @param validators - Валидаторы для условного добавления/удаления
   * @param predicate - Функция, возвращающая true, когда валидаторы должны быть активны
   */
  addValidatorsDependency<R>(sourceControlSchema: ControlSchema<R>, validators: ValidatorFn[], predicate: (value: R) => boolean): this {
    this.#addDependency(sourceControlSchema, (result) => {
      if (predicate(result)) {
        this.control.addValidators(validators);
      } else {
        this.control.removeValidators(validators);
      }
      this.control.updateValueAndValidity();
    });

    return this;
  }

  /**
   * Запускает отслеживание всех зависимостей
   */
  startDependencyTracking(): void {
    this.#dependencies.forEach((dependency) => {
      dependency.subscribe();
    });
  }

  /**
   * Выполняет все зависимости один раз без подписки
   */
  executeDependencies(): void {
    this.#dependencies.forEach((dependency) => {
      dependency.runOnce();
    });
  }

  /**
   * Полностью уничтожает схему и очищает все ресурсы
   * Должен вызываться при уничтожении компонента/сервиса для предотвращения утечек памяти
   */
  destroyDependencyTracking(): void {
    this.#dependencies.forEach((dependency) => {
      dependency.destroy();
    });
    this.#dependencies.length = 0;
  }

  /**
   * Создает и сохраняет отношения зависимости
   * @private
   */
  #addDependency<R>(sourceControlSchema: ControlSchema<R>, callback: (result: R) => void): void {
    const dependency = new Dependency(sourceControlSchema, callback);
    this.#dependencies.push(dependency);
  }
}
