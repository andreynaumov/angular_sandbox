import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ControlSchema } from './control-schema';
import { GroupSchema } from './group-schema';
import { DestroyRef, inject } from '@angular/core';

/**
 * Создает схему формы с автоматическим отслеживанием зависимостей и управлением жизненным циклом.
 * Предоставляет типобезопасный доступ к вложенным схемам и автоматически обрабатывает очистку.
 *
 * @param name - Идентификатор имени для корневой схемы
 * @param form - Angular FormGroup для обертывания
 * @param schemaFn - Функция конфигурации для настройки метаданных полей и зависимостей
 * @returns Типобезопасная схема со свойствами, соответствующими структуре формы
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   name: new FormControl(''),
 *   email: new FormControl(''),
 *   address: new FormGroup({
 *     street: new FormControl(''),
 *     city: new FormControl('')
 *   })
 * });
 *
 * const schema = createFormSchema('userForm', form, (schema) => {
 *   schema.name
 *     .setLabel('Full Name')
 *     .setPlaceholder('Enter your name')
 *     .setFieldType('input');
 *
 *   schema.email
 *     .setLabel('Email Address')
 *     .setFieldType('input')
 *     .addValidators([Validators.email]);
 *
 *   schema.address.street
 *     .addHideDependency(schema.name, (name) => !name);
 * });
 * ```
 */
export function createFormSchema<T extends FormGroup>(
  name: string,
  form: T,
  schemaFn: (form: GroupSchemaWithProperties<T>) => void,
): GroupSchemaWithProperties<T> {
  const destroyRef = inject(DestroyRef);

  const baseSchema = new GroupSchema(name, form);

  // Оборачиваем в Proxy с правильной типизацией для доступа к свойствам
  const formSchema = wrapGroupSchema(baseSchema, form);

  // Конфигурируем схему
  schemaFn(formSchema);

  // Запускаем отслеживание зависимостей
  formSchema.startDependencyTracking();

  // Регистрируем очистку при уничтожении компонента/сервиса
  destroyRef.onDestroy(() => {
    formSchema.destroyDependencyTracking();
  });

  return formSchema;
}

/**
 * Рекурсивно сопоставляет структуру Angular формы с соответствующими типами схем
 */
type FormToSchema<T> =
  T extends FormGroup<infer U>
    ? {
        [K in keyof U]: U[K] extends FormControl<infer V>
          ? ControlSchema<V>
          : U[K] extends FormGroup<infer V>
            ? GroupSchemaWithProperties<U[K]>
            : FormToSchema<U[K]>;
      }
    : never;

/**
 * Объединяет функциональность GroupSchema с типизированным доступом к свойствам для вложенных схем
 */
export type GroupSchemaWithProperties<T extends FormGroup> = GroupSchema<Extract<T['controls'], Record<string, AbstractControl>>> &
  FormToSchema<T>;

/**
 * Оборачивает GroupSchema в Proxy для обеспечения типизированного доступа к вложенным схемам.
 * Это позволяет обращаться к вложенным схемам как `schema.address.street` вместо `schema.schemaObject.address.schemaObject.street`.
 *
 * @param schema - GroupSchema для обертывания
 * @param form - Соответствующая FormGroup для вывода типов
 * @returns Проксированная схема с типизированным доступом к свойствам
 */
function wrapGroupSchema<T extends FormGroup>(schema: GroupSchema<any>, form: T): GroupSchemaWithProperties<T> {
  return new Proxy(schema, {
    get(target, prop: string | symbol) {
      // Если это свойство самой GroupSchema (методы, значения и т.д.)
      if (prop in target) {
        const value = (target as any)[prop];
        // Если это метод, привязываем его к target для сохранения контекста 'this'
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      }

      // Если это свойство из schemaObject (вложенные схемы)
      if (typeof prop === 'string' && prop in target.schemaObject) {
        const schemaItem = target.schemaObject[prop];

        // Если это GroupSchema, оборачиваем его рекурсивно для доступа к вложенным свойствам
        if (schemaItem instanceof GroupSchema) {
          // Находим соответствующую FormGroup в форме
          const formControl = form.controls[prop];
          if (formControl instanceof FormGroup) {
            // Рекурсивно оборачиваем вложенную GroupSchema с правильной типизацией
            return wrapGroupSchema(schemaItem, formControl);
          }
        }

        // Если это ControlSchema, возвращаем как есть
        return schemaItem;
      }

      return undefined;
    },

    // Обеспечиваем правильное перечисление свойств для отладки и итерации
    ownKeys(target) {
      return [...Object.keys(target), ...Object.keys(target.schemaObject)];
    },

    // Делаем свойства перечисляемыми
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'string' && prop in target.schemaObject) {
        return {
          enumerable: true,
          configurable: true,
        };
      }
      return Object.getOwnPropertyDescriptor(target, prop);
    },
  }) as GroupSchemaWithProperties<T>;
}
