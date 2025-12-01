import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { DependencyType, SelectOption } from '@form-builder/shared/types/form-config';
import { FormSchema } from '@form-builder/shared/types/form-schema';

const groupValidator = (control: AbstractControl): ValidationErrors | null => {
  // console.log('groupValidator: ', control.value);
  return { groupError: true };
};

const arrayValidator = (control: AbstractControl): ValidationErrors | null => {
  // console.log('arrayValidator: ', control.value);
  return { arrayError: true };
};

export const formSchema = ({ options }: { options: Record<string, SelectOption<unknown>[]> }): FormSchema => [
  {
    name: 'bio',
    type: 'object',
    config: {
      label: 'BIO',
      validators: [groupValidator],
      expressions: {
        valueChanges: ({ form, currentControlValue }) => {
          // console.log('form: ', form);
          // console.log('controlValue: ', controlValue);
        },
      },
    },
    schema: [
      {
        name: 'firstName',
        type: 'string',
        config: {
          label: 'First Name',
          validators: [Validators.required],
          validationErrors: {
            required: 'Field is required.',
          },
          dependencies: [
            {
              type: DependencyType.Disabled,
              sourceField: 'maritalStatus',
              when: ({ sourceControlValue }) => {
                return sourceControlValue === 'single';
              },
            },
          ],
        },
      },
      {
        name: 'lastName',
        type: 'string',
        config: {
          label: 'Last Name',
          dependencies: [
            {
              type: DependencyType.Readonly,
              sourceField: 'maritalStatus',
              when: ({ sourceControlValue }) => {
                return sourceControlValue === 'single';
              },
            },
          ],
        },
      },
      {
        name: 'birthDate',
        type: 'date',
        config: {
          label: 'Birth Date',
        },
      },
    ],
  },
  {
    name: 'siblings',
    type: 'array',
    config: {
      label: 'Siblings',
      validators: [arrayValidator],
    },
    schema: [
      {
        name: 'name',
        type: 'string',
        config: {
          label: 'Name',
          validators: [Validators.required],
        },
      },
      {
        name: 'relationship',
        type: 'select',
        config: {
          label: 'Birth Date',
          options: options['relationship'],
          expressions: {
            valueChanges: ({ form, currentControlValue }) => {
              // console.log('form: ', form);
              // console.log('controlValue: ', controlValue);
            },
          },
        },
      },
    ],
  },
  {
    name: 'hasChildren',
    type: 'checkbox',
    config: {
      label: 'Has children',
      dependencies: [
        {
          type: DependencyType.Hide,
          sourceField: 'maritalStatus',
          when: ({ sourceControlValue }) => {
            return sourceControlValue === 'single';
          },
        },
      ],
    },
  },
  {
    name: 'partner',
    type: 'string',
    config: {
      label: 'Partner',
      dependencies: [
        {
          type: DependencyType.AddValidators,
          sourceField: 'maritalStatus',
          validators: [Validators.required],
          when: ({ sourceControlValue }) => {
            return sourceControlValue === 'married';
          },
        },
      ],
    },
  },
  {
    name: 'maritalStatus',
    type: 'select',
    config: {
      label: 'Marital status',
      options: options['maritalStatus'],
      expressions: {
        valueChanges: ({ form, currentControlValue }) => {
          // console.log('form: ', form);
          // console.log('controlValue: ', controlValue);
        },
      },
    },
  },
  {
    name: 'fullAddress',
    type: 'select',
    config: {
      label: 'Full Address',
      options: options['fullAddress'],
      expressions: {
        valueChanges: ({ form, currentControlValue }) => {
          // console.log('form: ', form);
          // console.log('controlValue: ', controlValue);
        },
      },
    },
  },
];
