import { Component, contentChildren, input, OnInit, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FormField } from '../form-field/form-field';
import { CustomField } from '../shared/custom-field';
import { FormSchema } from '../shared/types/form-schema';
import { FormModel } from '../shared/types/form-model';
import { buildForm } from '../shared/functions/build-form.function';

/**
 * Главный компонент динамической формы.
 * Строит форму на основе схемы и обрабатывает отправку.
 * Поддерживает пользовательский рендеринг полей через content projection.
 *
 * @example
 * ```typescript
 * <app-form
 *   [form]="myForm"
 *   [formSchema]="schema"
 *   [formModel]="initialData"
 *   (submitEvent)="onSubmit($event)">
 *   <ng-template appCustomField="customFieldName" let-control="control">
 *     <!-- Шаблон пользовательского поля -->
 *   </ng-template>
 * </app-form>
 * ```
 */
@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './form.html',
  styleUrl: './form.scss',
})
export class Form implements OnInit {
  public readonly form = input.required<FormGroup<Record<string, UntypedFormControl | UntypedFormGroup | UntypedFormArray>>>();
  public readonly formSchema = input.required<FormSchema>();

  public readonly formModel = input<FormModel | null | undefined>(null);
  public readonly formErrors = input<Record<string, string[]> | null | undefined>(null);

  public readonly submitEvent = output<Record<string, unknown>>();

  public readonly customFields = contentChildren(CustomField);

  public ngOnInit(): void {
    buildForm({ form: this.form(), schema: this.formSchema(), model: null });
  }

  public getCustomField(fieldName: string): CustomField | undefined {
    return this.customFields().find((customField) => customField.name() === fieldName);
  }

  /**
   * Обрабатывает отправку формы.
   * Отправляет сырое значение формы, включая отключенные контролы.
   */
  public onSubmit() {
    this.submitEvent.emit(this.form().getRawValue());
  }
}
