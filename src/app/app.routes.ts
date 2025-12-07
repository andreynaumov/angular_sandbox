import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'common-form',
  },
  {
    path: 'example-form',
    loadComponent: () => import('./pages/example-form/example-form').then((f) => f.ExampleForm),
  },
  {
    path: 'form-sandbox',
    loadComponent: () => import('./pages/form-sandbox/form-sandbox').then((f) => f.FormSandbox),
  },
  {
    path: 'ui-input',
    loadComponent: () => import('./pages/ui-input/ui-input').then((f) => f.UiInput),
  },
  {
    path: 'ui-checkbox',
    loadComponent: () => import('./pages/ui-checkbox/ui-checkbox').then((f) => f.UiCheckbox),
  },
  {
    path: 'ui-datepicker',
    loadComponent: () => import('./pages/ui-datepicker/ui-datepicker').then((f) => f.UiDatepicker),
  },
  {
    path: 'ui-select',
    loadComponent: () => import('./pages/ui-select/ui-select').then((f) => f.UiSelect),
  },
];
