import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ControlSchema } from './control-schema';
import { BaseSchema } from './base-schema';

export type SchemaItem = GroupSchema<Record<string, AbstractControl>> | ControlSchema<unknown>;

export class GroupSchema<T extends Record<string, AbstractControl>> extends BaseSchema {
  readonly #schemaList: Array<SchemaItem> = [];
  readonly schemaObject: Record<string, SchemaItem> = {};

  constructor(name: string, control: FormGroup<T>) {
    super(name, 'group');

    Object.entries(control.controls).map(([name, control]) => {
      let schema: SchemaItem | null = null;

      if (control instanceof FormGroup) {
        schema = new GroupSchema(name, control);
      }

      if (control instanceof FormControl) {
        schema = new ControlSchema(name, control);
      }

      if (!schema) {
        throw new Error(`Unknown control type with name: ${name}`);
      }

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

  runDependencyTracking(): void {
    this.#schemaList.forEach((schema) => {
      schema.runDependencyTracking();
    });
  }

  runDependencies(): void {
    this.#schemaList.forEach((schema) => {
      schema.runDependencies();
    });
  }

  /**
   * Рекурсивно уничтожает все вложенные схемы (ControlSchema и GroupSchema)
   * Должен вызываться при уничтожении компонента/сервиса для предотвращения утечек памяти
   */
  destroyDependencyTracking(): void {
    this.#schemaList.forEach((schema) => {
      schema.destroyDependencyTracking();
    });
  }

  forLog(schemaList: Array<SchemaItem> = this.#schemaList): any {
    return Object.fromEntries(
      schemaList.map((schema) => [
        schema.controlName,
        schema instanceof GroupSchema
          ? this.forLog(schema.#schemaList)
          : { value: schema.value().control.value, isHide: schema.value().isHide() },
      ]),
    );
  }
}
