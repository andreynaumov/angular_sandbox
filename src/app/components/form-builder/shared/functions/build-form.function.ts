import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormModel } from '../types/form-model';
import { FormSchema } from '../types/form-schema';

/**
 * Рекурсивно строит структуру формы на основе предоставленной схемы.
 *
 * @param params - Объект конфигурации для построения формы
 * @param params.form - Группа формы для заполнения контролами
 * @param params.schema - Определение схемы, описывающее структуру формы
 * @param params.model - Опциональная модель данных для заполнения формы начальными значениями
 *
 * @example
 * ```typescript
 * const form = new FormGroup({});
 * const schema: FormSchema = [
 *   { name: 'email', type: 'string', config: { label: 'Email' } }
 * ];
 * buildForm({ form, schema, model: { email: 'test@example.com' } });
 * ```
 */
export function buildForm(params: {
  form: FormGroup<Record<string, UntypedFormControl | UntypedFormGroup | UntypedFormArray>>;
  schema: FormSchema;
  model: FormModel | null | undefined;
}): void {
  for (const fieldSchema of params.schema) {
    const validators = fieldSchema.config.validators;
    const subModel = params.model?.[fieldSchema.name];

    let control: UntypedFormControl | UntypedFormArray | UntypedFormGroup = new UntypedFormControl(subModel ?? null);

    if (fieldSchema.type === 'object') {
      const objectSubModel = typeof subModel === 'object' && !Array.isArray(subModel) ? subModel : null;

      control = new UntypedFormGroup({});

      buildForm({ schema: fieldSchema.schema, model: objectSubModel, form: control });
    }

    if (fieldSchema.type === 'array') {
      control = new UntypedFormArray([]);

      const arraySubModel = typeof subModel === 'object' && Array.isArray(subModel) ? subModel : [];

      for (const arraySubModelItem of arraySubModel) {
        const itemControl = new UntypedFormGroup({});

        buildForm({ schema: fieldSchema.schema, model: arraySubModelItem, form: itemControl });

        control.push(itemControl);
      }
    }

    if (validators) {
      control.addValidators(validators);
    }

    params.form.addControl(fieldSchema.name, control, { emitEvent: false });
  }
}
