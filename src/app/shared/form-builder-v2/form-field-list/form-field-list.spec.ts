import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFieldList } from './form-field-list';

describe.skip('FormFieldList', () => {
  let component: FormFieldList<any>;
  let fixture: ComponentFixture<FormFieldList<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldList],
    }).compileComponents();

    fixture = TestBed.createComponent(FormFieldList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
