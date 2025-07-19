import { UntypedFormGroup, ValidatorFn } from '@angular/forms';

export type FormFieldConfig<T = unknown> = {
  label: string;
  cssClasses?: string[];
  cssStyles?: Record<string, string>;
  validators?: ValidatorFn[];
  options?: SelectOption<T>[];
  dependencies?: Dependency[];
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

type Dependency =
  | {
      type: DependencyType.Hide | DependencyType.Disabled | DependencyType.Readonly;
      sourceField: string;
      when: (params: { form: UntypedFormGroup; sourceControlValue: unknown }) => boolean;
    }
  | {
      type: DependencyType.AddValidators;
      sourceField: string;
      validators: ValidatorFn[];
      when: (params: { form: UntypedFormGroup; sourceControlValue: unknown }) => boolean;
    };
