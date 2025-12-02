import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ControlSchema, createControlSchema } from './control-schema';
import { signal, WritableSignal } from '@angular/core';
import { BaseSchema } from './base-schema';

export type SchemaItem = GroupSchema<Record<string, AbstractControl>> | ControlSchema<unknown>;

export class GroupSchema<T extends Record<string, AbstractControl>> extends BaseSchema {
  readonly #schemaList: Array<SchemaItem> = [];
  readonly schemaObject: Record<string, SchemaItem> = {};

  constructor(
    name: string,
    private readonly control: FormGroup<T>
  ) {
    super(name, 'group');

    Object.entries(control.controls).map(([name, control]) => {
      const schema = control instanceof FormGroup ? new GroupSchema(name, control) : createControlSchema(name, control as FormControl);
      this.#schemaList.push(schema);
      this.schemaObject[name] = schema;
    });
  }

  // Метод для получения массива схем для использования в шаблонах
  schemas(): Array<SchemaItem> {
    return this.#schemaList;
  }

  addControlField(name: string, schema: ControlSchema<any>) {
    if (name in this.schemaObject) {
      console.warn(`Schema with "${name}" name is already exists in root schema`);
      return;
    }

    this.#schemaList.push(schema);

    this.schemaObject[name] = schema;
  }

  /**
   * Рекурсивно уничтожает все вложенные схемы (ControlSchema и GroupSchema)
   * Должен вызываться при уничтожении компонента/сервиса для предотвращения утечек памяти
   */
  destroy(): void {
    this.#schemaList.forEach((schema) => {
      schema.destroy();
    });
  }
}
