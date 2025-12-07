import { Injectable, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ControlSchema } from '@form-builder-v2/control-schema';
import { createFormSchema } from '@form-builder-v2/create-form-schema';
import { SelectOption } from '@ui-old/select/select';

type User = {
  registrationAddress: string | null;
  realEstate: {
    isMatch: boolean | null;
    address: string | null;
  };
  sex: string | null;
  birthdate?: string | null;
  age?: string | null;
};

export type UserForm = ToForm<User>;

type ToForm<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? FormGroup<ToForm<T[K]>> : FormControl<T[K]>;
};

@Injectable()
export class FormBuilderV2SandboxService implements OnDestroy {
  #form = new FormGroup<UserForm>({
    registrationAddress: new FormControl<string | null>(null),
    realEstate: new FormGroup({
      isMatch: new FormControl<boolean | null>(null),
      address: new FormControl<string | null>(null),
    }),
    sex: new FormControl<string | null>(null),
  });

  get form() {
    return this.#form;
  }

  formSchema = createFormSchema('root', this.#form, (formSchema) => {
    formSchema.registrationAddress
      .addMeta({ fieldType: 'input', label: 'Registration address', placeholder: 'Input registration address...' })
      .onBlur((value) => {
        // console.log('on blur: ', value);
      });

    formSchema.realEstate.isMatch
      .addMeta({ fieldType: 'checkbox', label: 'Is match addresses', placeholder: '' })
      .addHideDependency(formSchema.registrationAddress, (value) => Boolean(value && value.length > 5));

    formSchema.realEstate.address
      .addMeta({ fieldType: 'input', label: 'Real estate address', placeholder: 'Input real estate address...' })
      .addHideDependency(formSchema.realEstate.isMatch, (value) => typeof value === 'boolean' && value);

    formSchema.sex
      .addMeta({ fieldType: 'select', label: 'Sex', placeholder: 'Input sex...' })
      .addHideDependency(formSchema.registrationAddress, (value) => Boolean(value && value.length > 5))
      .addDisableDependency(formSchema.realEstate.isMatch, (value) => typeof value === 'boolean' && value);
  });

  updateSexOptions(options: SelectOption<'male' | 'female'>[]) {
    this.formSchema.sex.addOptions(options);
  }

  user = {
    registrationAddress: 'someaddress',
    realEstate: { isMatch: true, address: 'someaddress' },
    // birthdate: '2020-12-11',
    // age: '24',
    sex: 'male',
  };

  updateForm() {
    this.#form.setValue(this.user, { emitEvent: false });
    this.formSchema.runDependencies();
  }

  addField(params: { name: 'birthdate' | 'age'; label: string; placeholder: string; fieldType: 'date' | 'input' | 'checkbox' }) {
    const { name, label, placeholder, fieldType } = params;

    const control = new FormControl<string | null>(null);
    const controlSchema = new ControlSchema(name, control).addMeta({ fieldType, label, placeholder });

    this.#form.addControl(name, control);
    this.formSchema.addControlField(name, controlSchema);
  }

  submit() {
    console.log(this.#form.getRawValue());
  }

  ngOnDestroy(): void {
    // Очищаем все подписки в схемах для предотвращения утечек памяти
    this.formSchema.destroyDependencyTracking();
  }
}
