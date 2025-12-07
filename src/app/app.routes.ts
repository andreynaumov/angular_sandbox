import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'common-form',
  },
  {
    path: 'form-builder-sandbox',
    loadComponent: () => import('./pages/form-builder-sandbox/form-builder-sandbox').then((f) => f.FormBuilderSandbox),
  },
  {
    path: 'form-builder-v2-sandbox',
    loadComponent: () => import('./pages/form-builder-v2-sandbox/form-builder-v2-sandbox').then((f) => f.FormBuilderV2Sandbox),
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
