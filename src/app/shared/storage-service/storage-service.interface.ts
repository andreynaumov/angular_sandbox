/**
 * Сервис для работы с localStorage/sessionStorage
 * Автоматически сериализует:
 * - Примитивы (string, number, boolean, null)
 * - Объекты и массивы
 * - Date объекты
 * - undefined
 */
export interface IStorageService {
  /**
   * Сохраняет значение в хранилище
   */
  setItem<T>(key: string, value: T): boolean;

  /**
   * Получает значение из хранилища
   */
  getItem<T>(key: string): T | null;

  /**
   * Удаляет значение из хранилища
   */
  removeItem(key: string): void;

  /**
   * Очищает все данные в хранилище
   */
  clear(): void;
}
