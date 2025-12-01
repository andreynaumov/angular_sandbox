/**
 * Интерфейс для сериализатора хранилища
 */
export interface IStorageSerializer {
  /**
   * Сериализует значение в строку
   */
  serialize<T>(value: T): string;

  /**
   * Десериализует строку обратно в JavaScript объект
   */
  deserialize<T>(value: string): T | null;
}
