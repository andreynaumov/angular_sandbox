import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldDate } from './form-field-date';

describe('FormFieldDate', () => {
  let component: FormFieldDate;
  let fixture: ComponentFixture<FormFieldDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldDate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
