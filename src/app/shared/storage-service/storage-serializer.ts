import { IStorageSerializer } from './storage-serializer.interface';

/**
 * Сериализатор для преобразования JavaScript объектов в JSON и обратно
 * с поддержкой специальных типов данных
 *
 * @description
 * Расширяет стандартный JSON.stringify/parse для корректной обработки:
 * - Date объектов (сохраняет как ISO строку и восстанавливает)
 * - undefined значений (JSON.stringify их обычно пропускает)
 * - Вложенных объектов и массивов с этими типами
 *
 * @example
 * ```typescript
 * const serializer = new StorageSerializer();
 *
 * // Сериализация объекта с Date
 * const data = { name: 'John', createdAt: new Date() };
 * const json = serializer.serialize(data);
 *
 * // Десериализация - Date восстановится как объект
 * const restored = serializer.deserialize<typeof data>(json);
 * console.log(restored.createdAt instanceof Date); // true
 * ```
 */
export class StorageSerializer implements IStorageSerializer {
  /**
   * Сериализует значение в JSON строку
   *
   * @template T - Тип сериализуемого значения
   * @param value - Значение для сериализации
   * @returns JSON строка с обработанными специальными типами
   *
   * @example
   * ```typescript
   * serializer.serialize({ date: new Date(), value: undefined });
   * // => '{"date":{"__type":"date","value":"2024-01-01T00:00:00.000Z"},"value":{"__type":"undefined"}}'
   * ```
   */
  serialize<T>(value: T): string {
    const processed = this.#prepareForSerialization(value);
    return JSON.stringify(processed);
  }

  /**
   * Десериализует JSON строку обратно в JavaScript объект
   *
   * @template T - Ожидаемый тип результата
   * @param value - JSON строка для десериализации
   * @returns Десериализованный объект с восстановленными Date и undefined, или null при ошибке
   *
   * @example
   * ```typescript
   * const json = '{"date":{"__type":"date","value":"2024-01-01T00:00:00.000Z"}}';
   * const result = serializer.deserialize<{date: Date}>(json);
   * console.log(result.date instanceof Date); // true
   * ```
   */
  deserialize<T>(value: string): T | null {
    try {
      const parsed = JSON.parse(value);
      return this.#restoreAfterDeserialization(parsed) as T;
    } catch (error) {
      console.error('Deserialization error:', error);
      return null;
    }
  }

  /**
   * Подготавливает значение для сериализации, рекурсивно обрабатывая специальные типы
   *
   * @param value - Значение для обработки
   * @returns Обработанное значение, готовое для JSON.stringify
   *
   * @private
   * @remarks
   * Преобразует:
   * - undefined → { __type: 'undefined' }
   * - Date → { __type: 'date', value: ISO строка }
   * - Рекурсивно обрабатывает массивы и объекты
   */
  #prepareForSerialization(value: unknown): unknown {
    /** Проверяем null и undefined (самые частые случаи) */
    if (value === null) return null;
    if (value === undefined) return { __type: 'undefined' };

    const valueType = typeof value;

    /** Примитивы возвращаем без изменений (самый частый случай) */
    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
      return value;
    }

    /** Объекты обрабатываем последними */
    if (valueType === 'object') {
      /** Date конвертируем в ISO строку с меткой типа */
      if (value instanceof Date) {
        return { __type: 'date', value: value.toISOString() };
      }

      /** Рекурсивно обрабатываем массивы */
      if (Array.isArray(value)) {
        const length = value.length;
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
          result[i] = this.#prepareForSerialization(value[i]);
        }
        return result;
      }

      /** Рекурсивно обрабатываем объекты */
      const result: Record<string, unknown> = {};
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          result[key] = this.#prepareForSerialization((value as Record<string, unknown>)[key]);
        }
      }
      return result;
    }

    return value;
  }

  /**
   * Восстанавливает специальные типы после десериализации JSON
   *
   * @param value - Значение после JSON.parse
   * @returns Значение с восстановленными Date и undefined
   *
   * @private
   * @remarks
   * Распознает объекты с __type и преобразует их обратно:
   * - { __type: 'date', value: ISO } → Date объект
   * - { __type: 'undefined' } → undefined
   * - Рекурсивно обрабатывает массивы и объекты
   */
  #restoreAfterDeserialization(value: unknown): unknown {
    /** Примитивы и null возвращаем как есть (самый частый случай) */
    if (value === null || typeof value !== 'object') {
      return value;
    }

    /** Проверяем специальные типы с маркером __type */
    if (Object.prototype.hasOwnProperty.call(value, '__type')) {
      const typed = value as { __type: string; value?: string };

      /** Восстанавливаем Date из ISO строки */
      if (typed.__type === 'date') return new Date(typed.value!);

      /** Восстанавливаем undefined */
      if (typed.__type === 'undefined') return undefined;
    }

    /** Рекурсивно обрабатываем массивы */
    if (Array.isArray(value)) {
      const length = value.length;
      const result = new Array(length);
      for (let i = 0; i < length; i++) {
        result[i] = this.#restoreAfterDeserialization(value[i]);
      }
      return result;
    }

    /** Рекурсивно обрабатываем объекты */
    const result: Record<string, unknown> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = this.#restoreAfterDeserialization((value as Record<string, unknown>)[key]);
      }
    }
    return result;
  }
}
