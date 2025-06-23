import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompletePanel } from './autocomplete-panel';

describe('AutocompletePanel', () => {
  let component: AutocompletePanel;
  let fixture: ComponentFixture<AutocompletePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompletePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompletePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
