import { Component, input, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'ui-old-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
})
export class CheckboxOld implements ControlValueAccessor {
  readonly name = input<string>('[input]');
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly label = input<string | null | undefined>(null);
  readonly errorMessages = input<Record<string, string>>({});

  value: boolean | null = null;
  touched: boolean = false;

  private onChange = (value: boolean | null) => {};
  private onTouched = () => {};

  constructor(@Optional() @Self() readonly control: NgControl) {
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  registerOnChange(fn: (value: boolean | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(value: boolean | null): void {
    this.value = value;
  }

  public updateValue(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.value = element.checked;
    this.onChange(this.value);
  }
}
