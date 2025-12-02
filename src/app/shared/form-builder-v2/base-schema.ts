import { ControlSchema } from './control-schema';
import { GroupSchema } from './group-schema';

// Базовый абстрактный класс для всех схем
export abstract class BaseSchema {
  constructor(
    protected readonly controlName: string,
    private readonly schemaType: 'group' | 'control'
  ) {}

  /**
   * Уничтожает схему и очищает все подписки
   * Должен вызываться при уничтожении компонента/сервиса для предотвращения утечек памяти
   */
  abstract destroy(): void;

  // Type guards для проверки типа в шаблонах
  // Используем более общий тип, чтобы избежать циклических зависимостей
  isGroupSchema(): this is GroupSchema<any> {
    return this.schemaType === 'group';
  }

  isControlSchema(): this is ControlSchema<any> {
    return this.schemaType === 'control';
  }
}
