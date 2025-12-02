import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSandbox } from './form-sandbox';

describe('FormSandbox', () => {
  let component: FormSandbox;
  let fixture: ComponentFixture<FormSandbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSandbox],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSandbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
