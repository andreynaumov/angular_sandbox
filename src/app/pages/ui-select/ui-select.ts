import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxOld } from '@ui-old/checkbox/checkbox';
import { InputOld } from '@ui-old/input/input';
import { SelectOld, SelectOption } from '@ui-old/select/select';

@Component({
  selector: 'app-ui-select',
  imports: [ReactiveFormsModule, SelectOld, CheckboxOld, InputOld, JsonPipe],
  templateUrl: './ui-select.html',
  styleUrl: './ui-select.scss',
})
export class UiSelect {
  control = new FormControl<string | null>(null, [Validators.required]);

  disableFlag = new FormControl(false);
  touchedFlag = new FormControl(false);
  valueForUpdate = new FormControl(null);

  readonly options = signal<SelectOption<string>[]>([
    { value: '1', label: 'first' },
    { value: '2', label: 'second' },
    { value: '3', label: 'third' },
  ]);

  ngOnInit(): void {
    this.control.valueChanges.subscribe((value) => {
      console.log('valueChanges: ', value);
    });

    this.control.statusChanges.subscribe((value) => {
      console.log('statusChanges: ', value);
    });

    this.disableFlag.valueChanges.subscribe((value) => {
      value ? this.control.disable() : this.control.enable();
    });

    this.touchedFlag.valueChanges.subscribe((value) => {
      value ? this.control.markAsTouched() : this.control.markAsUntouched();
    });
  }

  public updateValue() {
    this.control.setValue(this.valueForUpdate.value);
  }

  public resetValue() {
    this.control.setValue(null);
  }

  public updateOptions() {
    this.options.update((opts) => [opts[0], opts[1]]);
  }

  get validationErrorMessages() {
    return {
      required: 'Field is required.',
      minlength: 'Is too short (minimum five symbols).',
    };
  }

  get controlInfo() {
    return {
      value: this.control.value,
      status: this.control.status,
      valid: this.control.valid,
      invalid: this.control.invalid,
      enabled: this.control.enabled,
      disabled: this.control.disabled,
      touched: this.control.touched,
      untouched: this.control.untouched,
      pristine: this.control.pristine,
      dirty: this.control.dirty,
      errors: this.control.errors,
    };
  }
}
