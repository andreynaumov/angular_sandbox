import { FormControlStatus, UntypedFormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export type FormFieldConfig<T = unknown> = {
  label: string;
  cssClasses?: string[];
  cssStyles?: Record<string, string>;
  validators?: ValidatorFn[];
  validationErrors?: Record<string, string>;
  options?: SelectOption<T>[];
  maskConfig?: {
    mask: string;
    dropSpecialCharacters?: false;
    shouldValidateMask?: true;
    prefix?: string;
    suffix?: string;
  };
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  dependencies?: Dependency[];
  displayWith?: (value: any) => string;
  keepOpenPanelFn?: (value: any) => boolean;
  debounce?: number;
  expressions?: {
    valueChanges?: (params: { form: UntypedFormGroup; currentControlValue: any }) => void;
    autocompleteInputChangeFn?: (params: { inputValue: string | null }) => Observable<SelectOption<unknown>[]> | SelectOption<unknown>[];
    onSelect?: (value: { fieldName: string; fieldValue: unknown; status: FormControlStatus }) => void;
    onBlur?: (value: { fieldName: string; fieldValue: unknown; status: FormControlStatus }) => void;
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

export type Dependency =
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
