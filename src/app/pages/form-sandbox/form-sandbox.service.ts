import { Injectable, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { createControlSchema } from '@form-builder-v2/control-schema';
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
export class FormSandboxService implements OnDestroy {
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
      .addFieldType('input')
      .addLabel('Registration address')
      .addPlaceholder('Input registration address...')
      .onBlur((value) => {
        console.log('on blur: ', value);
      });

    formSchema.realEstate.isMatch
      .addFieldType('checkbox')
      .addLabel('Is match addresses')
      .addHideDependency(formSchema.registrationAddress, (value) => Boolean(value && value.length > 10));

    formSchema.realEstate.address
      .addFieldType('input')
      .addLabel('Address: city, street, house')
      .addPlaceholder('Input address...')
      .addHideDependency(formSchema.realEstate.isMatch, (value) => typeof value === 'boolean' && value);

    formSchema.sex.addFieldType('select').addLabel('Sex').addPlaceholder('Input sex...');
  });

  updateSexOptions(options: SelectOption<'male' | 'female'>[]) {
    this.formSchema().sex.addOptions(options);
  }

  updateForm() {
    const user = {
      registrationAddress: 'someaddress',
      realEstate: { isMatch: true, address: 'someaddress' },
      birthdate: '2020-12-11',
      age: '24',
      sex: 'male',
    };

    this.#form.setValue(user);
  }

  addField(params: { name: 'birthdate' | 'age'; label: string; placeholder: string; fieldType: 'date' | 'input' | 'checkbox' }) {
    const { name, label, placeholder, fieldType } = params;

    const control = new FormControl<string | null>(null);
    const controlSchema = createControlSchema(name, control).addFieldType(fieldType).addLabel(label).addPlaceholder(placeholder);

    this.#form.addControl(name, control);
    this.formSchema().addControlField(name, controlSchema);
  }

  submit() {
    console.log(this.#form.getRawValue());
  }

  ngOnDestroy(): void {
    // Очищаем все подписки в схемах для предотвращения утечек памяти
    this.formSchema().destroy();
  }
}
