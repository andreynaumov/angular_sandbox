import { InjectionToken } from '@angular/core';

import { StorageService } from './storage-service';

/**
 * Токен для инъекции сервиса работы с localStorage
 *
 * @description
 * Используйте этот токен для получения доступа к localStorage через DI Angular.
 * Данные сохраняются между сессиями браузера.
 *
 * @example
 * ```typescript
 * import { Component, inject } from '@angular/core';
 * import { LocalStorageService } from './utils/storage-service/tokens';
 *
 * export class MyComponent {
 *   private storage = inject(LocalStorageService);
 *
 *   ngOnInit() {
 *     this.storage.setItem('key', 'value');
 *   }
 * }
 * ```
 */
export const LocalStorageService = new InjectionToken('LOCAL_STORAGE', {
  providedIn: 'root',
  factory: () => StorageService.create('localStorage'),
});

/**
 * Токен для инъекции сервиса работы с sessionStorage
 *
 * @description
 * Используйте этот токен для получения доступа к sessionStorage через DI Angular.
 * Данные удаляются при закрытии вкладки/окна браузера.
 *
 * @example
 * ```typescript
 * import { Component, inject } from '@angular/core';
 * import { SessionStorageService } from './utils/storage-service/tokens';
 *
 * export class WizardComponent {
 *   private storage = inject(SessionStorageService);
 *
 *   saveStep(data: any) {
 *     // Данные сохранятся только на время сессии
 *     this.storage.setItem('wizardStep', data);
 *   }
 * }
 * ```
 */
export const SessionStorageService = new InjectionToken('SESSION_STORAGE', {
  providedIn: 'root',
  factory: () => StorageService.create('sessionStorage'),
});
