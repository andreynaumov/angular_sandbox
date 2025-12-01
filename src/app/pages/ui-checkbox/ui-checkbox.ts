import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxOld } from '../../ui-old/checkbox/checkbox';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-ui-checkbox',
  imports: [ReactiveFormsModule, CheckboxOld, JsonPipe],
  templateUrl: './ui-checkbox.html',
  styleUrl: './ui-checkbox.scss',
})
export class UiCheckbox implements OnInit {
  control = new FormControl<boolean | null>(null);

  ngOnInit(): void {
    this.control.valueChanges.subscribe((value) => {
      console.log('valueChanges: ', value);
    });

    this.control.statusChanges.subscribe((value) => {
      console.log('statusChanges: ', value);
    });
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
