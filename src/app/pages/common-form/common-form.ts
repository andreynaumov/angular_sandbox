import { Component, signal } from '@angular/core';
import { formSchema } from './common-form.const';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { optionsMock } from './mocks/options.mock';
import { formModel } from './mocks/model.mock';
import { Form } from '@form-builder/form/form';
import { FormModel } from '@form-builder/shared/types/form-model';
import { FormSchema } from '@form-builder/shared/types/form-schema';

@Component({
  selector: 'app-common-form',
  imports: [Form, ReactiveFormsModule],
  templateUrl: './common-form.html',
  styleUrl: './common-form.scss',
})
export class CommonForm {
  public readonly formSchema = signal<FormSchema | null>(null);
  public readonly formModel = signal<FormModel | null>(null);
  public readonly form = new UntypedFormGroup({});

  public logFormValue(formValue: Record<string, unknown>) {
    console.log(formValue);
  }

  ngOnInit(): void {
    optionsMock.subscribe((options) => {
      const f = formSchema({ options });
      this.formSchema.set(formSchema({ options }));
    });

    formModel.subscribe((formModel) => {
      this.formModel.set(formModel);
    });
  }
}
