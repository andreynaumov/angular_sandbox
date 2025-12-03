import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldObject } from './form-field-object';

describe.skip('FormFieldObject', () => {
  let component: FormFieldObject;
  let fixture: ComponentFixture<FormFieldObject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldObject],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldObject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
