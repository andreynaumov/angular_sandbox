import { FormFieldConfig, SelectOption } from '../types/form-config';
import { FormFieldSchema, FormSchema } from '../types/form-schema';

/**
 * Построитель схем форм с fluent API.
 * Упрощает создание схем форм с помощью цепочки методов.
 *
 * @example
 * ```typescript
 * const schema = new FormSchemaBuilder()
 *   .addString('email', { label: 'Email', validators: [Validators.required, Validators.email] })
 *   .addSelect('role', { label: 'Роль', options: [...] })
 *   .build();
 * ```
 */
export class FormSchemaBuilder {
  private schema: FormSchema = [];

  /**
   * Добавляет текстовое поле в схему.
   *
   * @param name - Имя поля
   * @param config - Конфигурация поля
   * @returns Текущий экземпляр построителя для цепочки вызовов
   */
  addString(name: string, config: FormFieldConfig): this {
    this.schema.push({ name, type: 'string', config });
    return this;
  }

  /**
   * Добавляет поле выбора даты в схему.
   *
   * @param name - Имя поля
   * @param config - Конфигурация поля
   * @returns Текущий экземпляр построителя для цепочки вызовов
   */
  addDate(name: string, config: FormFieldConfig): this {
    this.schema.push({ name, type: 'date', config });
    return this;
  }

  /**
   * Добавляет выпадающий список в схему.
   *
   * @param name - Имя поля
   * @param config - Конфигурация поля с опциями
   * @returns Текущий экземпляр построителя для цепочки вызовов
   */
  addSelect<T = unknown>(name: string, config: FormFieldConfig<T> & { options: SelectOption<T>[] }): this {
    this.schema.push({ name, type: 'select', config });
    return this;
  }

  /**
   * Добавляет чекбокс в схему.
   *
   * @param name - Имя поля
   * @param config - Конфигурация поля
   * @returns Текущий экземпляр построителя для цепочки вызовов
   */
  addCheckbox(name: string, config: FormFieldConfig): this {
    this.schema.push({ name, type: 'checkbox', config });
    return this;
  }

  /**
   * Добавляет вложенный объект в схему.
   *
   * @param name - Имя поля
   * @param config - Конфигурация поля
   * @param builderFn - Функция для построения вложенной схемы
   * @returns Текущий экземпляр построителя для цепочки вызовов
   *
   * @example
   * ```typescript
   * builder.addObject('address', { label: 'Адрес' }, (nested) =>
   *   nested
   *     .addString('street', { label: 'Улица' })
   *     .addString('city', { label: 'Город' })
   * );
   * ```
   */
  addObject(name: string, config: FormFieldConfig, builderFn: (builder: FormSchemaBuilder) => FormSchemaBuilder): this {
    const nestedBuilder = new FormSchemaBuilder();
    const nestedSchema = builderFn(nestedBuilder).build();

    this.schema.push({ name, type: 'object', config, schema: nestedSchema });
    return this;
  }

  /**
   * Добавляет массив объектов в схему.
   *
   * @param name - Имя поля
   * @param config - Конфигурация поля
   * @param builderFn - Функция для построения схемы элемента массива
   * @returns Текущий экземпляр построителя для цепочки вызовов
   *
   * @example
   * ```typescript
   * builder.addArray('phoneNumbers', { label: 'Телефоны' }, (item) =>
   *   item
   *     .addString('number', { label: 'Номер' })
   *     .addSelect('type', { label: 'Тип', options: [...] })
   * );
   * ```
   */
  addArray(name: string, config: FormFieldConfig, builderFn: (builder: FormSchemaBuilder) => FormSchemaBuilder): this {
    const itemBuilder = new FormSchemaBuilder();
    const itemSchema = builderFn(itemBuilder).build();

    this.schema.push({ name, type: 'array', config, schema: itemSchema });
    return this;
  }

  /**
   * Добавляет произвольное поле в схему.
   * Используйте этот метод для полного контроля над полем.
   *
   * @param field - Схема поля
   * @returns Текущий экземпляр построителя для цепочки вызовов
   */
  addField(field: FormFieldSchema): this {
    this.schema.push(field);
    return this;
  }

  /**
   * Условно добавляет поле в схему.
   * Поле добавляется только если условие истинно.
   *
   * @param condition - Условие для добавления поля
   * @param callback - Функция добавления поля
   * @returns Текущий экземпляр построителя для цепочки вызовов
   *
   * @example
   * ```typescript
   * builder.addIf(user.isAdmin, (b) => b.addString('adminField', { label: 'Admin' }))
   * ```
   */
  addIf(condition: boolean, callback: (builder: this) => this): this {
    if (condition) {
      callback(this);
    }
    return this;
  }

  /**
   * Добавляет несколько полей за один раз.
   *
   * @param fields - Массив схем полей
   * @returns Текущий экземпляр построителя для цепочки вызовов
   *
   * @example
   * ```typescript
   * builder.addFields([
   *   { name: 'firstName', type: 'string', config: { label: 'Имя' } },
   *   { name: 'lastName', type: 'string', config: { label: 'Фамилия' } }
   * ])
   * ```
   */
  addFields(fields: FormFieldSchema[]): this {
    this.schema.push(...fields);
    return this;
  }

  /**
   * Объединяет текущую схему с другой схемой.
   *
   * @param schema - Схема или построитель для объединения
   * @returns Текущий экземпляр построителя для цепочки вызовов
   *
   * @example
   * ```typescript
   * const contactFields = createFormSchema()
   *   .addString('email', { label: 'Email' })
   *   .addString('phone', { label: 'Телефон' });
   *
   * builder.merge(contactFields);
   * ```
   */
  merge(schema: FormSchema | FormSchemaBuilder): this {
    const fieldsToMerge = schema instanceof FormSchemaBuilder ? schema.build() : schema;
    this.schema.push(...fieldsToMerge);
    return this;
  }

  /**
   * Создает копию текущего построителя.
   *
   * @returns Новый экземпляр построителя с скопированной схемой
   *
   * @example
   * ```typescript
   * const baseForm = createFormSchema().addString('name', { label: 'Имя' });
   * const extendedForm = baseForm.clone().addString('age', { label: 'Возраст' });
   * ```
   */
  clone(): FormSchemaBuilder {
    const cloned = new FormSchemaBuilder();
    cloned.schema = [...this.schema];
    return cloned;
  }

  /**
   * Применяет функцию преобразования к построителю.
   * Полезно для переиспользования логики построения.
   *
   * @param transformer - Функция преобразования
   * @returns Текущий экземпляр построителя для цепочки вызовов
   *
   * @example
   * ```typescript
   * const addContactFields = (b: FormSchemaBuilder) =>
   *   b.addString('email', FieldConfigHelpers.email())
   *    .addString('phone', FieldConfigHelpers.phone());
   *
   * builder.pipe(addContactFields);
   * ```
   */
  pipe(transformer: (builder: this) => this): this {
    return transformer(this);
  }

  /**
   * Удаляет поле по имени из схемы.
   *
   * @param fieldName - Имя поля для удаления
   * @returns Текущий экземпляр построителя для цепочки вызовов
   */
  remove(fieldName: string): this {
    this.schema = this.schema.filter((field) => field.name !== fieldName);
    return this;
  }

  /**
   * Изменяет существующее поле в схеме.
   *
   * @param fieldName - Имя поля для изменения
   * @param modifier - Функция модификации поля
   * @returns Текущий экземпляр построителя для цепочки вызовов
   *
   * @example
   * ```typescript
   * builder.modify('email', (field) => ({
   *   ...field,
   *   config: { ...field.config, label: 'Новый Email' }
   * }))
   * ```
   */
  modify(fieldName: string, modifier: (field: FormFieldSchema) => FormFieldSchema): this {
    const index = this.schema.findIndex((field) => field.name === fieldName);
    if (index !== -1) {
      this.schema[index] = modifier(this.schema[index]);
    }
    return this;
  }

  /**
   * Возвращает построенную схему.
   *
   * @returns Массив схем полей формы
   */
  build(): FormSchema {
    return this.schema;
  }
}
