import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleForm } from './example-form';

describe.skip('ExampleForm', () => {
  let component: ExampleForm;
  let fixture: ComponentFixture<ExampleForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
