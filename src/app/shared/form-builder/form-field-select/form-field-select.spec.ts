import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldSelect } from './form-field-select';

describe('FormFieldSelect', () => {
  let component: FormFieldSelect;
  let fixture: ComponentFixture<FormFieldSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFieldSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
