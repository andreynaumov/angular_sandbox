import { Component, inject } from '@angular/core';
import { FormBuilderV2SandboxService } from './form-builder-v2-sandbox.service';
import { FormFieldList } from '@form-builder-v2/form-field-list/form-field-list';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-form-builder-v2-sandbox',
  imports: [FormFieldList, JsonPipe],
  templateUrl: './form-builder-v2-sandbox.html',
  providers: [FormBuilderV2SandboxService],
  styleUrl: './form-builder-v2-sandbox.scss',
})
export class FormBuilderV2Sandbox {
  readonly #formBuilderV2SandboxService = inject(FormBuilderV2SandboxService);

  public readonly formSchema = this.#formBuilderV2SandboxService.formSchema;
  public readonly form = this.#formBuilderV2SandboxService.form;
  public readonly user = this.#formBuilderV2SandboxService.user;

  ngOnInit(): void {
    this.#formBuilderV2SandboxService.updateSexOptions([
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ]);
  }

  handle() {
    this.#formBuilderV2SandboxService.addField({
      name: 'birthdate',
      label: 'Birthdate',
      placeholder: 'Input birthdate',
      fieldType: 'date',
    });
    this.#formBuilderV2SandboxService.addField({ name: 'age', label: 'Age', placeholder: 'Input age', fieldType: 'input' });
  }

  updateForm() {
    this.#formBuilderV2SandboxService.updateForm();
  }

  submit() {
    this.#formBuilderV2SandboxService.submit();
  }
}
