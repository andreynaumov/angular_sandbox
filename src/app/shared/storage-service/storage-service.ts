import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

import { StorageSerializer } from './storage-serializer';
import { IStorageSerializer } from './storage-serializer.interface';
import { IStorageService } from './storage-service.interface';

/**
 * Сервис для работы с браузерным хранилищем (localStorage/sessionStorage)
 *
 * @description
 * Предоставляет простой API для работы с localStorage и sessionStorage
 * с автоматической сериализацией/десериализацией объектов, Date и undefined.
 * Поддерживает SSR (возвращает заглушку на сервере).
 *
 * @example
 * ```typescript
 * // В Angular компоненте
 * import { inject } from '@angular/core';
 * import { LocalStorageService } from './utils/storage-service/tokens';
 *
 * export class MyComponent {
 *   private storage = inject(LocalStorageService);
 *
 *   saveUser() {
 *     this.storage.setItem('user', {
 *       name: 'John',
 *       createdAt: new Date()
 *     });
 *   }
 *
 *   loadUser() {
 *     const user = this.storage.getItem<User>('user');
 *     console.log(user?.createdAt instanceof Date); // true
 *   }
 * }
 * ```
 */
export class StorageService implements IStorageService {
  /**
   * Создает экземпляр сервиса для работы с указанным типом хранилища
   *
   * @param storageType - Тип хранилища: 'localStorage' или 'sessionStorage'
   * @returns Экземпляр сервиса или SSR-заглушка (если выполняется на сервере)
   *
   * @remarks
   * При выполнении на сервере (SSR) возвращает заглушку, которая:
   * - setItem всегда возвращает false
   * - getItem всегда возвращает null
   * - removeItem и clear ничего не делают
   */
  static create(storageType: 'localStorage' | 'sessionStorage'): IStorageService {
    const platformId = inject(PLATFORM_ID);

    /** На сервере возвращаем заглушку */
    if (isPlatformServer(platformId)) {
      return { setItem: () => false, getItem: () => null, removeItem: () => {}, clear: () => {} };
    }

    /** В браузере создаем полноценный сервис */
    const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
    return new StorageService(new StorageSerializer(), storage);
  }

  /** Сериализатор для преобразования объектов */
  readonly #serializer: IStorageSerializer;

  /** Нативное хранилище браузера */
  readonly #storage: Storage;

  /** Приватный конструктор. Используйте статический метод create() */
  private constructor(serializer: IStorageSerializer, storage: Storage) {
    this.#serializer = serializer;
    this.#storage = storage;
  }

  /**
   * Сохраняет значение в хранилище
   *
   * @template T - Тип сохраняемого значения
   * @param key - Ключ для сохранения
   * @param value - Значение (будет автоматически сериализовано)
   * @returns true если сохранение успешно, false при ошибке
   *
   * @example
   * ```typescript
   * // Сохранение простого значения
   * storage.setItem('count', 42);
   *
   * // Сохранение объекта с Date
   * storage.setItem('user', {
   *   name: 'John',
   *   createdAt: new Date(),
   *   settings: { theme: 'dark' }
   * });
   * ```
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = this.#serializer.serialize(value);
      this.#storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to set item "${key}":`, error);
      return false;
    }
  }

  /**
   * Получает значение из хранилища
   *
   * @template T - Ожидаемый тип возвращаемого значения
   * @param key - Ключ для получения
   * @returns Десериализованное значение или null если ключ не существует или произошла ошибка
   *
   * @example
   * ```typescript
   * // Получение с указанием типа
   * const user = storage.getItem<User>('user');
   * if (user) {
   *   console.log(user.name);
   *   console.log(user.createdAt instanceof Date); // true
   * }
   *
   * // Получение простого значения
   * const count = storage.getItem<number>('count');
   * ```
   */
  getItem<T>(key: string): T | null {
    try {
      const value = this.#storage.getItem(key);
      if (value === null) return null;
      return this.#serializer.deserialize<T>(value);
    } catch (error) {
      console.error(`Failed to get item "${key}":`, error);
      return null;
    }
  }

  /**
   * Удаляет значение из хранилища
   *
   * @param key - Ключ для удаления
   *
   * @example
   * ```typescript
   * storage.removeItem('user');
   * ```
   */
  removeItem(key: string): void {
    this.#storage.removeItem(key);
  }

  /**
   * Полностью очищает хранилище
   *
   * @remarks
   * Удаляет ВСЕ данные из localStorage/sessionStorage.
   * Используйте с осторожностью!
   *
   * @example
   * ```typescript
   * storage.clear(); // Удаляет все данные
   * ```
   */
  clear(): void {
    this.#storage.clear();
  }
}
