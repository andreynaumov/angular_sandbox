import { Injectable, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ControlSchema } from '@form-builder-v2/control-schema';
import { createFormSchema } from '@form-builder-v2/create-form-schema';

type User = {
  registrationAddress: string | null;
  addressMatches: boolean | null;
  address: string | null;
  birthdate?: string | null;
  age?: string | null;
};

export type UserForm = ToForm<User>;

type ToForm<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? FormGroup<ToForm<T[K]>> : FormControl<T[K]>;
};

@Injectable()
export class FormBuilderV2SandboxService {
  #form = new FormGroup<UserForm>({
    registrationAddress: new FormControl<string | null>(null),
    addressMatches: new FormControl<boolean | null>(null),
    address: new FormControl<string | null>(null),
  });

  get form() {
    return this.#form;
  }

  formSchema = createFormSchema('root', this.#form, (formSchema) => {
    const isValidAddress = (registrationAddress: string | null) => {
      return registrationAddress === 'valid address';
    };

    formSchema.registrationAddress
      .setMeta({ fieldType: 'input', label: 'Registration address', placeholder: 'Input registration address...' })
      .onBlur((value) => {
        console.log('on blur: ', value);
      });

    formSchema.addressMatches
      .setMeta({ fieldType: 'checkbox', label: 'Is match addresses', placeholder: '' })
      .addHideDependency(formSchema.registrationAddress, (value) => !isValidAddress(value));

    formSchema.address
      .setMeta({ fieldType: 'input', label: 'Real estate address', placeholder: 'Input real estate address...' })
      .addHideDependency(formSchema.addressMatches, (value) => value === true);
  });

  user = {
    registrationAddress: 'invalid address',
    addressMatches: true,
    address: 'someaddress',
  };

  updateForm() {
    this.#form.setValue(this.user, { emitEvent: false });
    this.formSchema.executeDependencies();
  }

  addField(params: { name: 'birthdate' | 'age'; label: string; placeholder: string; fieldType: 'date' | 'input' | 'checkbox' }) {
    const { name, label, placeholder, fieldType } = params;

    const control = new FormControl<string | null>(null);
    const controlSchema = new ControlSchema(name, control).setMeta({ fieldType, label, placeholder });

    this.#form.addControl(name, control);
    this.formSchema.addControlField(name, controlSchema);
  }

  submit() {
    console.log(this.#form.getRawValue());
  }
}
