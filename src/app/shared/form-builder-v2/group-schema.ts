import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ControlSchema } from './control-schema';
import { BaseSchema } from './base-schema';

export type SchemaItem = GroupSchema<Record<string, AbstractControl>> | ControlSchema<unknown>;

/**
 * Схема для групп форм с поддержкой рекурсивной структуры и автоматическим управлением жизненным циклом.
 * Управляет вложенными схемами и предоставляет унифицированный API для отслеживания зависимостей.
 */
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
        throw new Error(`Неподдерживаемый тип контрола для поля "${name}". Поддерживаются только FormControl и FormGroup.`);
      }

      this.#schemaList.push(schema);
      this.schemaObject[name] = schema;
    });
  }

  /**
   * Возвращает массив схем для итерации в шаблоне
   */
  schemas(): Array<SchemaItem> {
    return this.#schemaList;
  }

  /**
   * Добавляет новую схему контрола в группу
   * @param name - Имя контрола
   * @param schema - Схема контрола для добавления
   */
  addControlField(name: string, schema: ControlSchema<any>): void {
    if (name in this.schemaObject) {
      console.warn(`Схема с именем "${name}" уже существует в группе "${this.controlName}". Пропускаем добавление.`);
      return;
    }

    this.#schemaList.push(schema);
    this.schemaObject[name] = schema;
  }

  /**
   * Запускает отслеживание зависимостей для всех вложенных схем рекурсивно
   */
  startDependencyTracking(): void {
    this.#schemaList.forEach((schema) => {
      schema.startDependencyTracking();
    });
  }

  /**
   * Выполняет все зависимости один раз для всех вложенных схем рекурсивно
   */
  executeDependencies(): void {
    this.#schemaList.forEach((schema) => {
      schema.executeDependencies();
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
    this.#schemaList.length = 0;

    // Очищаем объект схем
    for (const key in this.schemaObject) {
      delete this.schemaObject[key];
    }
  }

  /**
   * Создает отладочное представление дерева схем
   * Полезно для логирования и отладки
   */
  toDebugObject(schemaList: Array<SchemaItem> = this.#schemaList): any {
    return Object.fromEntries(
      schemaList.map((schema) => [
        schema.controlName,
        schema instanceof GroupSchema
          ? this.toDebugObject(schema.#schemaList)
          : {
              value: schema.value().control.value,
              isHide: schema.value().isHide(),
              fieldType: schema.meta().type(),
              label: schema.meta().label(),
            },
      ]),
    );
  }
}
