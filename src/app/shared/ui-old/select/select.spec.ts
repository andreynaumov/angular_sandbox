import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOld } from './select';

describe.skip('Select', () => {
  let component: SelectOld<unknown>;
  let fixture: ComponentFixture<SelectOld<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectOld],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOld);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
