import { SelectOption } from '@form-builder/shared/types/form-config';
import { delay, Observable, of } from 'rxjs';

export const optionsMock: Observable<Record<string, SelectOption<unknown>[]>> = of({
  term: [
    { value: 'P5D', viewValue: '5 days' },
    { value: 'P10D', viewValue: '10 days' },
    { value: 'P4Y', viewValue: '4 years' },
    { value: 'P5M', viewValue: '5 months' },
  ],
  city: [
    { value: 'bryansk', viewValue: 'Bryansk' },
    { value: 'moskov', viewValue: 'Moskov' },
  ],
}).pipe(delay(1200));
