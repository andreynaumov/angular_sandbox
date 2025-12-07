import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  menuItems = [
    { link: 'form-builder-sandbox', label: 'Form builder sandbox' },
    { link: 'form-builder-v2-sandbox', label: 'Form builder v2 sandbox' },
    { link: 'ui-input', label: 'UI Input' },
    { link: 'ui-checkbox', label: 'UI Checkbox' },
    { link: 'ui-datepicker', label: 'UI Datepicker' },
    { link: 'ui-select', label: 'UI Select' },
  ];
}
