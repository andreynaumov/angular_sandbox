import { FormFieldConfig } from './form-config';

export type FormSchema = FormFieldSchema[];

export type FormFieldSchema =
  | PrimitiveFormFieldSchema<'string'>
  | PrimitiveFormFieldSchema<'date'>
  | PrimitiveFormFieldSchema<'select'>
  | PrimitiveFormFieldSchema<'checkbox'>
  | CompositeFormFieldSchema<'object'>
  | CompositeFormFieldSchema<'array'>;

type BaseFormFieldSchema<T extends string> = {
  readonly name: string;
  readonly type: T;
  readonly config: FormFieldConfig;
};

type PrimitiveFormFieldSchema<T extends string> = BaseFormFieldSchema<T>;
type CompositeFormFieldSchema<T extends string> = BaseFormFieldSchema<T> & {
  readonly schema: FormSchema;
};

/**
 * Рекурсивно фильтрует схему формы, удаляя поля и группы по условию.
 *
 * @param {Object} params — Параметры фильтрации
 * @param {Set<string>} params.additionalProperties — Опциональные поля, которые следует удалять, если они не в propertiesToDisplay
 * @param {Set<string>} params.propertiesToDisplay — Свойства из additionalProperties, которые следует сохранять
 * @param {FormSchema} params.schema — Схема для фильтрации
 *
 * @returns {FormSchema} — Отфильтрованная схема формы
 *
 * @example
 * const filteredSchema = filterSchemaRecursively({
 *   additionalProperties: new Set(['rate', 'conclusionDate']),
 *   propertiesToDisplay: new Set(['rate']),
 *   schema: originalSchema,
 * });
 *
 * @description
 * Алгоритм работы:
 * 1. Рекурсивно обходит все уровни вложенности схемы
 * 2. Для составных полей (групп, массивов) рекурсивно фильтрует вложенную схему
 * 3. Если вложенная схема становится пустой — удаляет её полностью
 * 4. Если имя в additionalProperties и в propertiesToDisplay — сохраняет
 * 5. Если имя не в additionalProperties и не в propertiesToDisplay — удаляет
 */

export const filterSchemaRecursively = ({
  additionalProperties,
  propertiesToDisplay,
  schema,
}: {
  additionalProperties: Set<string>;
  propertiesToDisplay: Set<string>;
  schema: FormSchema;
}): FormSchema => {
  return schema
    .map((formFieldSchema) => {
      if (isCompositeFormFieldSchema(formFieldSchema)) {
        const filteredSchema = filterSchemaRecursively({ schema: formFieldSchema.schema, additionalProperties, propertiesToDisplay });
        return filteredSchema.length > 0 ? { ...formFieldSchema, schema: filteredSchema } : null;
      }

      const { name } = formFieldSchema;

      const shouldKeep = !additionalProperties.has(name) || propertiesToDisplay.has(name);

      return shouldKeep ? formFieldSchema : null;
    })
    .filter(Boolean) as FormSchema;
};

const isCompositeFormFieldSchema = (field: FormFieldSchema): field is CompositeFormFieldSchema<'array' | 'object'> => {
  return 'schema' in field;
};
