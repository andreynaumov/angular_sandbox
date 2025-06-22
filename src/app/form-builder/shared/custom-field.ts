import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCustomField]',
})
export class CustomField {
  public readonly templateRef = inject(TemplateRef);

  public readonly name = input.required<string>({ alias: 'appCustomField' });
}
