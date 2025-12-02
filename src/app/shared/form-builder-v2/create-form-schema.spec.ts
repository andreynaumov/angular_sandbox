import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFormSchema } from './create-form-schema';
import { FormControl, FormGroup } from '@angular/forms';
import { ControlSchema, createControlSchema } from './control-schema';
import { GroupSchema } from './group-schema';

describe('createFormSchema()', () => {
  it('should ...', () => {
    const form = new FormGroup({
      name: new FormControl<string | null>(null),
      age: new FormControl<number | null>(null),
      address: new FormGroup({
        city: new FormControl<string | null>(null),
        region: new FormControl<string | null>(null),
        data: new FormGroup({
          kladrId: new FormControl<string | null>(null),
        }),
      }),
    });

    const result = createFormSchema(form, () => {});

    expect(result()).toStrictEqual({
      name: createControlSchema('name', form.controls.name),
      age: createControlSchema('age', form.controls.age),
      address: {
        city: createControlSchema('city', form.controls.address.controls.city),
        region: createControlSchema('region', form.controls.address.controls.region),
        data: {
          kladrId: createControlSchema('kladrId', form.controls.address.controls.data.controls.kladrId),
        },
      },
    });
  });

  it.only('should ...', () => {
    const form = new FormGroup({
      name: new FormControl<string | null>(null),
      age: new FormControl<number | null>(null),
      address: new FormGroup({
        city: new FormControl<string | null>(null),
        region: new FormControl<string | null>(null),
      }),
    });

    const f = new GroupSchema('address', form.controls.address);
    console.log(f);

    expect(1).toBe(1);
  });
});
