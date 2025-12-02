import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDatepicker } from './ui-datepicker';

describe('UiDatepicker', () => {
  let component: UiDatepicker;
  let fixture: ComponentFixture<UiDatepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiDatepicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiDatepicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
