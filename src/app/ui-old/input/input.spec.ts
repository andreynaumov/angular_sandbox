import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

import { InputOld } from './input';

describe('InputOld', () => {
  let component: InputOld;
  let fixture: ComponentFixture<InputOld>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputOld, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputOld);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should implement ControlValueAccessor', () => {
    const control = new FormControl('test value');
    component.writeValue('test value');
    expect(component.value).toBe('test value');
  });
});

