import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldArray } from './form-field-array';

describe.skip('FormFieldArray', () => {
  let component: FormFieldArray;
  let fixture: ComponentFixture<FormFieldArray>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldArray],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldArray);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
