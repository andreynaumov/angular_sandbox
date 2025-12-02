import { Component, computed, forwardRef } from '@angular/core';
import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormField } from '../form-field/form-field';
import { buildForm } from '../shared/functions/build-form.function';
import { CompositeFormField } from '../shared/abstractions/composite-form-field';

@Component({
  selector: 'app-form-field-array',
  imports: [forwardRef(() => FormField)],
  templateUrl: './form-field-array.html',
  styleUrl: './form-field-array.scss',
})
export class FormFieldArray extends CompositeFormField<UntypedFormArray> {
  public readonly controls = computed<FormGroup<Record<string, UntypedFormArray | UntypedFormGroup | UntypedFormControl>>[]>(
    () => this.control().controls as FormGroup<Record<string, UntypedFormArray | UntypedFormGroup | UntypedFormControl>>[],
  );

  /**
   * Добавляет новый элемент в массив формы.
   * Создает новую группу формы на основе схемы поля.
   */
  public addItem() {
    const parentControlArray = this.control();
    const fieldSchema = this.fieldSchema();
    const newControl = new UntypedFormGroup({});

    if (!fieldSchema) return;

    buildForm({ form: newControl, schema: fieldSchema, model: null });

    parentControlArray.push(newControl);
  }

  /**
   * Удаляет элемент из массива формы по указанному индексу.
   *
   * @param controlIndex - Индекс элемента для удаления
   */
  public removeItem(controlIndex: number) {
    this.control().removeAt(controlIndex);
  }
}
