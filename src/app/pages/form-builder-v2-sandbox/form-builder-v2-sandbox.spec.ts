import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBuilderV2Sandbox } from './form-builder-v2-sandbox';

describe('FormBuilderV2Sandbox', () => {
  let component: FormBuilderV2Sandbox;
  let fixture: ComponentFixture<FormBuilderV2Sandbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilderV2Sandbox],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBuilderV2Sandbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
