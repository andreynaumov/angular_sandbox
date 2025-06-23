import { Component, signal } from '@angular/core';
import { Autocomplete } from '../../components/autocomplete/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SelectOption } from '../../components/form-builder/shared/types/form-config';
import { from } from 'rxjs';

@Component({
  selector: 'app-example-autocomplete',
  imports: [MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './example-autocomplete.html',
  styleUrl: './example-autocomplete.scss',
})
export class ExampleAutocomplete {
  public readonly addressControlMaterial = new FormControl<string | { value: string }>('', [addressValidator]);

  public readonly options = signal<SelectOption<any>[]>([]);

  public readonly displayFn = (address: { value: string } | string) => (address && typeof address === 'object' ? address.value : address);

  public ngOnInit() {
    from(fetch('dadata-options.json').then((r) => r.json())).subscribe((response) => {
      // console.log(response.options);
      this.options.set(response.options);
    });

    this.addressControlMaterial.valueChanges.subscribe((value) => {
      // console.log(value);
    });
  }

  public updateControlValue() {
    this.addressControlMaterial.setValue({ value: 'foo' });
  }
}

function addressValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value === 'string') {
    return {
      invalidAddress: true,
    };
  }

  return null;
}
