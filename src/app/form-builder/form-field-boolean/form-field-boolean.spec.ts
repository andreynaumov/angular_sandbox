import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldBoolean } from './form-field-boolean';

describe('FormFieldBoolean', () => {
  let component: FormFieldBoolean;
  let fixture: ComponentFixture<FormFieldBoolean>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldBoolean]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldBoolean);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
