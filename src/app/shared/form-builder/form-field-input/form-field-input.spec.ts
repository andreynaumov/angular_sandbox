import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldInput } from './form-field-input';

describe.skip('FormFieldInput', () => {
  let component: FormFieldInput;
  let fixture: ComponentFixture<FormFieldInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldInput],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
