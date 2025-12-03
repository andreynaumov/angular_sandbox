import { KeyValuePipe } from '@angular/common';
import { Component, input, Optional, output, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'ui-old-input',
  imports: [KeyValuePipe],
  templateUrl: './input.html',
  styleUrl: './input.scss',
})
export class InputOld implements ControlValueAccessor {
  readonly name = input<string>('[input]');
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly label = input<string | null | undefined>(null);
  readonly placeholder = input<string | null | undefined>(null);
  readonly errorMessages = input<Record<string, string>>({});

  readonly blurEvent = output<void>();
  value: string | number | null = null;

  #onChange = (value: string | number | null) => {};
  #onTouched = () => {};

  constructor(@Optional() @Self() readonly control: NgControl) {
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  writeValue(value: string | number | null): void {
    this.value = value;
  }

  updateValue(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.value = element.value;
    this.#onChange(this.value);
  }

  onBlur(): void {
    this.#onTouched();
    this.blurEvent.emit();
  }
}
