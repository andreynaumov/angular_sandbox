import { Component, input } from '@angular/core';
import { GroupSchemaWithProperties } from '../create-form-schema';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputOld } from '@ui-old/input/input';
import { DatepickerOld } from '@ui-old/datepicker/datepicker';
import { CheckboxOld } from '@ui-old/checkbox/checkbox';
import { SelectOld } from '@ui-old/select/select';

/**
 * Отображает список полей формы на основе конфигурации схемы.
 * Поддерживает вложенные группы форм и различные типы полей с автоматическим управлением зависимостями.
 *
 * Возможности:
 * - Автоматическое отображение полей на основе конфигурации схемы
 * - Поддержка типов полей input, checkbox, date и select
 * - Отображение вложенных групп форм с визуальной иерархией
 * - Реактивная видимость на основе зависимостей полей
 * - Оптимизированная производительность с computed signals и правильным отслеживанием
 *
 * @example
 * ```html
 * <app-form-field-list [schema]="userFormSchema" />
 * ```
 */
@Component({
  selector: 'app-form-field-list',
  imports: [ReactiveFormsModule, InputOld, DatepickerOld, CheckboxOld, SelectOld],
  templateUrl: './form-field-list.html',
  styleUrl: './form-field-list.scss',
})
export class FormFieldList<T extends FormGroup> {
  /**
   * Конфигурация схемы, которая определяет, как форма должна быть отображена
   */
  public readonly schema = input.required<GroupSchemaWithProperties<T>>();
}
