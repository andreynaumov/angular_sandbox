import { ControlSchema } from './control-schema';
import { GroupSchema } from './group-schema';

/**
 * Абстрактный базовый класс для всех схем форм, предоставляющий общую функциональность
 * и type guards для безопасной проверки типов в шаблонах и бизнес-логике.
 */
export abstract class BaseSchema {
  constructor(
    public readonly controlName: string,
    private readonly schemaType: 'group' | 'control',
  ) {}

  /**
   * Запускает отслеживание зависимостей для этой схемы и всех вложенных схем
   * Должен вызываться после завершения конфигурации схемы
   */
  abstract startDependencyTracking(): void;

  /**
   * Выполняет все зависимости один раз без подписки
   * Полезно для установки начального состояния на основе значений формы
   */
  abstract executeDependencies(): void;

  /**
   * Уничтожает схему и очищает все подписки и ресурсы
   * Должен вызываться при уничтожении компонента/сервиса для предотвращения утечек памяти
   */
  abstract destroyDependencyTracking(): void;

  /**
   * Type guard для проверки, является ли данная схема GroupSchema
   * Безопасно использовать в шаблонах с правильным сужением типов
   */
  isGroupSchema(): this is GroupSchema<any> {
    return this.schemaType === 'group';
  }

  /**
   * Type guard для проверки, является ли данная схема ControlSchema
   * Безопасно использовать в шаблонах с правильным сужением типов
   */
  isControlSchema(): this is ControlSchema<any> {
    return this.schemaType === 'control';
  }
}
