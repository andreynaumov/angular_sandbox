import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, input, Optional, Self, signal, untracked } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export type SelectOption<T> = {
  readonly value: T;
  readonly label: string;
};

@Component({
  selector: 'ui-old-select',
  imports: [KeyValuePipe, NgTemplateOutlet],
  templateUrl: './select.html',
  styleUrl: './select.scss',
  host: {
    class: 'relative',
  },
})
export class SelectOld<T extends unknown> implements ControlValueAccessor {
  readonly name = input<string>('[input]');
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly label = input<string | null | undefined>(null);
  readonly placeholder = input<string | null | undefined>(null);
  readonly errorMessages = input<Record<string, string>>({});
  readonly options = input<SelectOption<T>[]>([]);

  readonly selectedOption = computed(() => this.options()?.find((option) => option.value === this.value()));

  readonly isOpen = signal(false);

  readonly value = signal<T | null>(null);

  #onChange = (value: T | null) => {};
  #onTouched = () => {};

  constructor(@Optional() @Self() readonly control: NgControl) {
    if (this.control) {
      this.control.valueAccessor = this;
    }

    effect(() => {
      if (this.selectedOption()) return;

      queueMicrotask(() => {
        this.value.set(null);
        this.#onChange(null);
      });
    });
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.#onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.#onTouched = fn;
  }

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  select(option: SelectOption<T>): void {
    this.value.set(option.value);
    this.#onChange(this.value());
    this.#onTouched();
    this.isOpen.set(false);
  }

  toggle() {
    if (this.control.disabled || this.readonly()) return;

    this.isOpen.set(!this.isOpen());
  }
}
