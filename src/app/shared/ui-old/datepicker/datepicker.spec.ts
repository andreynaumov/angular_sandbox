import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { DatepickerOld } from './datepicker';

describe.skip('DatepickerOld', () => {
  let component: DatepickerOld;
  let fixture: ComponentFixture<DatepickerOld>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerOld, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerOld);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should implement ControlValueAccessor', () => {
    const control = new FormControl('2024-01-01');
    component.writeValue('2024-01-01');
    expect(component.value).toBe('2024-01-01');
  });
});
