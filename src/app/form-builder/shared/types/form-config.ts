import { UntypedFormGroup } from '@angular/forms';

export type FormFieldConfig<T = unknown> = {
  label: string;
  options?: SelectOption<T>[];
  dependencies?: Array<{
    type: DependencyType;
    sourceField: string;
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
}
