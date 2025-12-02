import { signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ControlSchema, createControlSchema } from './control-schema';
import { GroupSchema } from './group-schema';

export function createFormSchema<T extends FormGroup>(
  name: string,
  form: T,
  schemaFn: (form: GroupSchemaWithProperties<T>) => void
): WritableSignal<GroupSchemaWithProperties<T>> {
  const baseSchema = new GroupSchema(name, form);

  // Оборачиваем в Proxy с правильной типизацией
  const formSchema = wrapGroupSchema(baseSchema, form);

  schemaFn(formSchema);

  return signal(formSchema);
}

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

export type GroupSchemaWithProperties<T extends FormGroup> = GroupSchema<Extract<T['controls'], Record<string, AbstractControl>>> &
  FormToSchema<T>;

// Вспомогательная функция для оборачивания GroupSchema в Proxy с правильной типизацией
function wrapGroupSchema<T extends FormGroup>(schema: GroupSchema<any>, form: T): GroupSchemaWithProperties<T> {
  return new Proxy(schema, {
    get(target, prop: string | symbol) {
      // Если это свойство самого GroupSchema (методы, value, schemas и т.д.)
      if (prop in target) {
        const value = (target as any)[prop];
        // Если это метод, возвращаем его привязанным к target
        if (typeof value === 'function') {
          return value.bind(target);
        }
        return value;
      }
      // Если это свойство из schemaObject (вложенные схемы)
      if (typeof prop === 'string' && prop in target.schemaObject) {
        const schemaItem = target.schemaObject[prop];
        // Если это GroupSchema, оборачиваем его в Proxy рекурсивно
        if (schemaItem instanceof GroupSchema) {
          // Находим соответствующий FormGroup в форме
          const formControl = (form.controls as any)[prop];
          if (formControl instanceof FormGroup) {
            // Рекурсивно оборачиваем вложенный GroupSchema с правильной типизацией
            // Используем any для рекурсивного вызова, но TypeScript все равно понимает типы через FormToSchema
            return wrapGroupSchema(schemaItem, formControl) as any;
          }
        }
        // Если это ControlSchema, возвращаем как есть
        return schemaItem;
      }
      return undefined;
    },
  }) as GroupSchemaWithProperties<T>;
}
