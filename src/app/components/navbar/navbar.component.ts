import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent {
  menuItems = [
    { link: 'example-form', label: 'Example Form' },
    { link: 'common-form', label: 'Common Form' },
    { link: 'form-sandbox', label: 'Form Sandbox' },
    { link: 'ui-input', label: 'UI Input' },
    { link: 'ui-checkbox', label: 'UI Checkbox' },
    { link: 'ui-datepicker', label: 'UI Datepicker' },
    { link: 'ui-select', label: 'UI Select' },
  ];
}
