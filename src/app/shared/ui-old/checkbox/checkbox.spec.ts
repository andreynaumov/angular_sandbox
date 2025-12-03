import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { CheckboxOld } from './checkbox';

describe.skip('CheckboxOld', () => {
  let component: CheckboxOld;
  let fixture: ComponentFixture<CheckboxOld>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxOld, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxOld);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should implement ControlValueAccessor', () => {
    const control = new FormControl(true);
    component.writeValue(true);
    expect(component.value).toBe(true);
  });
});
