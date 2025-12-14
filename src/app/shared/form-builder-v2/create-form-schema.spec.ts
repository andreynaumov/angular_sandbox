import { createFormSchema } from './create-form-schema';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationRef, createEnvironmentInjector, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('createFormSchema', () => {
  const setup = () => ({
    injector: createEnvironmentInjector([], TestBed.inject(EnvironmentInjector)),
    appRef: TestBed.inject(ApplicationRef),
  });

  describe('hide dependency', () => {
    const isValidAddress = (registrationAddress: string | null) => registrationAddress && registrationAddress === 'valid address';

    it('hides addressMatches when registrationAddress is invalid and keeps address visible', () => {
      const { injector } = setup();

      const form = new FormGroup({
        registrationAddress: new FormControl<string | null>(null),
        addressMatches: new FormControl<boolean | null>(null),
        address: new FormControl<string | null>(null),
      });

      const schema = runInInjectionContext(injector, () => {
        return createFormSchema('root', form, (form) => {
          form.addressMatches.addHideDependency(form.registrationAddress, (nameValue) => !isValidAddress(nameValue));
          form.address.addHideDependency(form.addressMatches, (matchesValue) => matchesValue === true);
        });
      });

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      expect(schema.address.value().isHide()).toBe(false);

      injector.destroy();
    });

    it('shows addressMatches when registrationAddress is valid and hides address when addressMatches is true', () => {
      const { injector } = setup();

      const form = new FormGroup({
        registrationAddress: new FormControl<string | null>(null),
        addressMatches: new FormControl<boolean | null>(null),
        address: new FormControl<string | null>(null),
      });

      const schema = runInInjectionContext(injector, () => {
        return createFormSchema('root', form, (form) => {
          form.addressMatches.addHideDependency(form.registrationAddress, (nameValue) => !isValidAddress(nameValue));
          form.address.addHideDependency(form.addressMatches, (matchesValue) => matchesValue === true);
        });
      });
      const formValue = {
        registrationAddress: 'valid address',
        addressMatches: true,
        address: null,
      };

      form.setValue(formValue);
      // form.setValue(formValue, { emitEvent: false });
      // schema.runDependencies();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(false);
      expect(schema.address.value().isHide()).toBe(true);

      injector.destroy();
    });

    it('when registrationAddress is invalid, addressMatches is hidden and address remains visible even if addressMatches is true (manual dependencies)', () => {
      const { injector } = setup();

      const form = new FormGroup({
        registrationAddress: new FormControl<string | null>(null),
        addressMatches: new FormControl<boolean | null>(null),
        address: new FormControl<string | null>(null),
      });

      const schema = runInInjectionContext(injector, () => {
        return createFormSchema('root', form, (form) => {
          form.addressMatches.addHideDependency(form.registrationAddress, (nameValue) => !isValidAddress(nameValue));
          form.address.addHideDependency(form.addressMatches, (matchesValue) => matchesValue === true);
        });
      });

      const formValue = {
        registrationAddress: 'INVALID address',
        addressMatches: true,
        address: null,
      };

      form.setValue(formValue, { emitEvent: false });
      schema.runDependencies();
      // it works too
      // form.setValue(formValue);

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      expect(schema.address.value().isHide()).toBe(false);

      injector.destroy();
    });

    it('reveals addressMatches when registrationAddress becomes valid', () => {
      const { injector } = setup();

      const form = new FormGroup({
        registrationAddress: new FormControl<string | null>(null),
        addressMatches: new FormControl<boolean | null>(null),
        address: new FormControl<string | null>(null),
      });

      const schema = runInInjectionContext(injector, () => {
        return createFormSchema('root', form, (form) => {
          form.addressMatches.addHideDependency(form.registrationAddress, (nameValue) => !isValidAddress(nameValue));
          form.address.addHideDependency(form.addressMatches, (matchesValue) => matchesValue === true);
        });
      });

      // emulate user input for registrationAddress
      form.controls.registrationAddress.setValue('valid address');

      expect(schema.addressMatches.value().isHide()).toBe(false);
      expect(schema.address.value().isHide()).toBe(false);

      injector.destroy();
    });

    it('hides address when addressMatches is true and registrationAddress is valid', () => {
      const { injector } = setup();

      const form = new FormGroup({
        registrationAddress: new FormControl<string | null>(null),
        addressMatches: new FormControl<boolean | null>(null),
        address: new FormControl<string | null>(null),
      });

      const schema = runInInjectionContext(injector, () => {
        return createFormSchema('root', form, (form) => {
          form.addressMatches.addHideDependency(form.registrationAddress, (nameValue) => !isValidAddress(nameValue));
          form.address.addHideDependency(form.addressMatches, (matchesValue) => matchesValue === true);
        });
      });

      // emulate user input for registrationAddress
      form.controls.registrationAddress.setValue('valid address');
      form.controls.addressMatches.setValue(true);

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(false);
      expect(schema.address.value().isHide()).toBe(true);

      injector.destroy();
    });

    it('ignores programmatic changes to hidden addressMatches and updates visibility when it becomes visible', () => {
      const { injector, appRef } = setup();

      const form = new FormGroup({
        registrationAddress: new FormControl<string | null>(null),
        addressMatches: new FormControl<boolean | null>(null),
        address: new FormControl<string | null>(null),
      });

      const schema = runInInjectionContext(injector, () => {
        return createFormSchema('root', form, (form) => {
          form.addressMatches.addHideDependency(form.registrationAddress, (nameValue) => !isValidAddress(nameValue));
          form.address.addHideDependency(form.addressMatches, (matchesValue) => matchesValue === true);
        });
      });
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      expect(schema.address.value().isHide()).toBe(false);

      // emulate user input in registrationAddress field
      form.controls.registrationAddress.setValue('INVALID address');
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      expect(schema.address.value().isHide()).toBe(false);

      // change addressMatches field value programmatically, when its hidden
      form.controls.addressMatches.setValue(true);
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      // should not be hidden, because addressMatches is hidden and its value should be ignored
      expect(schema.address.value().isHide()).toBe(false);

      // emulate user input in registrationAddress field
      form.controls.registrationAddress.setValue('valid address');
      form.controls.addressMatches.reset();
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(false);
      expect(schema.address.value().isHide()).toBe(false);

      form.controls.addressMatches.setValue(true);
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(false);
      expect(schema.address.value().isHide()).toBe(true);

      injector.destroy();
    });

    it('handles hide dependency correctly across multiple user and programmatic interactions', () => {
      const { injector, appRef } = setup();

      const form = new FormGroup({
        registrationAddress: new FormControl<string | null>(null),
        addressMatches: new FormControl<boolean | null>(null),
        address: new FormControl<string | null>(null),
      });

      const schema = runInInjectionContext(injector, () => {
        return createFormSchema('root', form, (form) => {
          form.addressMatches.addHideDependency(form.registrationAddress, (nameValue) => !isValidAddress(nameValue));
          form.address.addHideDependency(form.addressMatches, (matchesValue) => matchesValue === true);
        });
      });
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      expect(schema.address.value().isHide()).toBe(false);

      // emulate user input in registrationAddress field
      form.controls.registrationAddress.setValue('INVALID address');
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      expect(schema.address.value().isHide()).toBe(false);

      // change addressMatches field value programmatically, when its hidden
      form.controls.addressMatches.setValue(true);
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(true);
      // should not be hidden, because addressMatches is hidden and its value should be ignored
      expect(schema.address.value().isHide()).toBe(false);

      // emulate user input in registrationAddress field
      form.controls.registrationAddress.setValue('valid address');
      form.controls.addressMatches.reset();
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(false);
      expect(schema.address.value().isHide()).toBe(false);

      form.controls.addressMatches.setValue(true);
      appRef.tick();

      expect(schema.registrationAddress.value().isHide()).toBe(false);
      expect(schema.addressMatches.value().isHide()).toBe(false);
      expect(schema.address.value().isHide()).toBe(true);

      injector.destroy();
    });
  });
});
