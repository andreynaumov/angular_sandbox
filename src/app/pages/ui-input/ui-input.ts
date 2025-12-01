import { Component, effect, ElementRef, OnInit, viewChild } from '@angular/core';
import { InputOld } from '../../ui-old/input/input';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CheckboxOld } from '../../ui-old/checkbox/checkbox';

@Component({
  selector: 'app-ui-input',
  imports: [ReactiveFormsModule, InputOld, JsonPipe, CheckboxOld],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.scss',
})
export class UiInput implements OnInit {
  control = new FormControl<string | null>(null, [Validators.required, Validators.minLength(5)]);

  disableFlag = new FormControl(false);
  touchedFlag = new FormControl(false);

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
