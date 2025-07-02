import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

export type FormFieldConfig<T = unknown> = {
  label: string;
  validators?: ValidatorFn[];
  options?: SelectOption<T>[];
  dependencies?: Array<{
    type: DependencyType;
    sourceField: string;
    validators?: ValidatorFn[];
    when: (params: { form: UntypedFormGroup; sourceControlValue: any }) => boolean;
  }>;
  expressions?: {
    valueChanges?: (params: { form: UntypedFormGroup; currentControlValue: any }) => void;
  };
};

export type SelectOption<T> = {
  value: T;
  viewValue: string;
};

export enum DependencyType {
  Hide,
  Disabled,
  Readonly,
  AddValidators,
}
