import { Component, input } from '@angular/core';
import { GroupSchemaWithProperties } from '../create-form-schema';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputOld } from '@ui-old/input/input';
import { DatepickerOld } from '@ui-old/datepicker/datepicker';
import { CheckboxOld } from '@ui-old/checkbox/checkbox';
import { SelectOld } from '@ui-old/select/select';

@Component({
  selector: 'app-form-field-list',
  imports: [ReactiveFormsModule, InputOld, DatepickerOld, CheckboxOld, SelectOld],
  templateUrl: './form-field-list.html',
  styleUrl: './form-field-list.scss',
})
export class FormFieldList<T extends FormGroup> {
  public readonly schema = input.required<GroupSchemaWithProperties<T>>();
}
