import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormModel } from '../types/form-model';
import { FormSchema } from '../types/form-schema';
import { DestroyRef, signal } from '@angular/core';

export function buildForm({ schema, model }: { schema: FormSchema; model: FormModel | null | undefined }): {
  form: FormGroup<Record<string, UntypedFormControl | UntypedFormGroup | UntypedFormArray>>;
} {
  const form = new FormGroup<Record<string, UntypedFormControl | UntypedFormGroup | UntypedFormArray>>({});
  const f = signal('single');
  const isHide = signal(false);

  for (const fieldSchema of schema) {
    const subModel = model?.[fieldSchema.name];

    if (fieldSchema.type === 'object') {
      const objectSubModel = typeof subModel === 'object' && !Array.isArray(subModel) ? subModel : null;

      form.addControl(fieldSchema.name, buildForm({ schema: fieldSchema.schema, model: objectSubModel }).form);
    }

    if (fieldSchema.type === 'array') {
      const arrayControl = new UntypedFormArray([]);
      const arraySubModel = typeof subModel === 'object' && Array.isArray(subModel) ? subModel : [];

      for (const arraySubModelItem of arraySubModel) {
        arrayControl.push(buildForm({ schema: fieldSchema.schema, model: arraySubModelItem }).form);
      }

      form.addControl(fieldSchema.name, arrayControl);
    }

    const control = new UntypedFormControl(subModel ?? null);

    form.addControl(fieldSchema.name, control);
  }

  return { form };
}
