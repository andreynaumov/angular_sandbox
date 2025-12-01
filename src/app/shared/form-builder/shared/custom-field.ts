import { Directive, inject, input, TemplateRef } from '@angular/core';

/**
 * Директива для определения шаблонов пользовательских полей.
 * Используйте её для переопределения стандартного рендеринга конкретных полей формы.
 *
 * @example
 * ```html
 * <ng-template appCustomField="email" let-control="control" let-config="config">
 *   <input [formControl]="control" type="email" />
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[appCustomField]',
})
export class CustomField {
  public readonly templateRef = inject(TemplateRef);

  public readonly name = input.required<string>({ alias: 'appCustomField' });
}
