import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { formSchema } from './example-form.const';
import { from } from 'rxjs';
import { Form } from '@form-builder/form/form';
import { CustomField } from '@form-builder/shared/custom-field';
import { InputOld } from '@ui-old/input/input';
import { FormSchema } from '@form-builder/shared/types/form-schema';
import { FormModel } from '@form-builder/shared/types/form-model';

@Component({
  selector: 'app-example-form',
  imports: [Form, CustomField, ReactiveFormsModule, InputOld],
  templateUrl: './example-form.html',
  styleUrl: './example-form.scss',
})
export class ExampleForm implements OnInit {
  public readonly formSchema = signal<FormSchema | null>(null);
  public readonly formModel = signal<FormModel | null>(null);
  public readonly form = new UntypedFormGroup({});

  ngOnInit(): void {
    from(fetch('example-model.json').then((r) => r.json())).subscribe((formModel) => {
      this.formModel.set(formModel);
    });

    from(fetch('example-options.json').then((r) => r.json())).subscribe((options) => {
      this.formSchema.set(formSchema({ options }));
    });
  }

  public logFormValue(formValue: Record<string, unknown>) {
    console.log(formValue);
  }
}
