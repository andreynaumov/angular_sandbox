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
    path: 'common-form',
    loadComponent: () => import('./pages/common-form/common-form').then((f) => f.CommonForm),
  },
  {
    path: 'autocomplete',
    loadComponent: () => import('./pages/example-autocomplete/example-autocomplete').then((f) => f.ExampleAutocomplete),
  },
  {
    path: 'ui-input',
    loadComponent: () => import('./pages/ui-input/ui-input').then((f) => f.UiInput),
  },
  {
    path: 'ui-checkbox',
    loadComponent: () => import('./pages/ui-checkbox/ui-checkbox').then((f) => f.UiCheckbox),
  },
];
