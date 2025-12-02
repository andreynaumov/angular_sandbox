import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormSandboxService } from './form-sandbox.service';
import { JsonPipe } from '@angular/common';
import { FormFieldList } from '@form-builder-v2/form-field-list/form-field-list';
import { SelectOption } from '@ui-old/select/select';

@Component({
  selector: 'app-form-sandbox',
  imports: [FormFieldList, JsonPipe],
  templateUrl: './form-sandbox.html',
  styleUrl: './form-sandbox.scss',
  providers: [FormSandboxService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSandbox implements OnInit {
  readonly #formSandboxService = inject(FormSandboxService);

  public readonly formSchema = this.#formSandboxService.formSchema;
  public readonly form = this.#formSandboxService.form;

  ngOnInit(): void {
    this.#formSandboxService.updateSexOptions([
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ]);
  }

  handle() {
    this.#formSandboxService.addField({ name: 'birthdate', label: 'Birthdate', placeholder: 'Input birthdate', fieldType: 'date' });
    this.#formSandboxService.addField({ name: 'age', label: 'Age', placeholder: 'Input age', fieldType: 'input' });
  }

  updateForm() {
    this.#formSandboxService.updateForm();
  }

  submit() {
    this.#formSandboxService.submit();
  }
}
