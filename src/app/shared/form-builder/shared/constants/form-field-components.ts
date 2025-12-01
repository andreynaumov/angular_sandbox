import { Type } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormFieldArray } from '../../form-field-array/form-field-array';
import { FormFieldBoolean } from '../../form-field-boolean/form-field-boolean';
import { FormFieldDate } from '../../form-field-date/form-field-date';
import { FormFieldInput } from '../../form-field-input/form-field-input';
import { FormFieldObject } from '../../form-field-object/form-field-object';
import { FormFieldSelect } from '../../form-field-select/form-field-select';
import { BaseFormField } from '../abstractions/base-form-field';
import { FormFieldSchema } from '../types/form-schema';

export const FORM_FIELD_COMPONENTS: Record<
  FormFieldSchema['type'],
  Type<BaseFormField<UntypedFormControl>> | Type<BaseFormField<UntypedFormArray>> | Type<BaseFormField<UntypedFormGroup>>
> = {
  string: FormFieldInput,
  date: FormFieldDate,
  select: FormFieldSelect,
  checkbox: FormFieldBoolean,
  // radio: AutoFormFieldEnum,
  // switch: AutoFormFieldBoolean,
  // textarea: AutoFormFieldInput,
  // file: AutoFormFieldFile,
  object: FormFieldObject,
  array: FormFieldArray,
};
