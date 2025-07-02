import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormModel } from '../types/form-model';
import { FormSchema } from '../types/form-schema';

export function buildForm({ schema, model }: { schema: FormSchema; model: FormModel | null | undefined }): {
  form: FormGroup<Record<string, UntypedFormControl | UntypedFormGroup | UntypedFormArray>>;
} {
  const form = new FormGroup<Record<string, UntypedFormControl | UntypedFormGroup | UntypedFormArray>>({});

  for (const fieldSchema of schema) {
    const validators = fieldSchema.config?.validators;
    const subModel = model?.[fieldSchema.name];

    let control: UntypedFormControl | UntypedFormArray | UntypedFormGroup = new UntypedFormControl(subModel ?? null);

    if (fieldSchema.type === 'object') {
      const objectSubModel = typeof subModel === 'object' && !Array.isArray(subModel) ? subModel : null;

      control = buildForm({ schema: fieldSchema.schema, model: objectSubModel }).form;
    }

    if (fieldSchema.type === 'array') {
      control = new UntypedFormArray([]);

      const arraySubModel = typeof subModel === 'object' && Array.isArray(subModel) ? subModel : [];

      for (const arraySubModelItem of arraySubModel) {
        control.push(buildForm({ schema: fieldSchema.schema, model: arraySubModelItem }).form);
      }
    }

    if (validators) {
      control.addValidators(validators);
    }

    form.addControl(fieldSchema.name, control);
  }

  return { form };
}
