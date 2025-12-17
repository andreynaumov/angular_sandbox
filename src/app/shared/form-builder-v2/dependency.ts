import { distinctUntilChanged, startWith, Subscription } from 'rxjs';
import { ControlSchema } from './control-schema';
import { effect, EffectRef, untracked } from '@angular/core';

/**
 * Управляет отношениями зависимостей между элементами управления формы с правильным управлением жизненным циклом.
 * Автоматически подписывается/отписывается в зависимости от видимости исходного контрола и обрабатывает очистку.
 */
export class Dependency<R> {
  #subscription: Subscription | null = null;
  #effectRef: EffectRef | null = null;
  #isDestroyed = false;

  constructor(
    private readonly sourceControlSchema: ControlSchema<R>,
    private readonly dependencyEffectFn: (value: R) => void,
  ) {
    this.#effectRef = effect(() => {
      if (this.#isDestroyed) return;

      if (sourceControlSchema.value().isHide()) {
        // Когда поле скрыто, отписываемся от изменений
        this.#unsubscribeInternal();
      } else {
        // Когда поле становится видимым:
        // - оставляем существующую подписку, если она есть
        // - или подписываемся заново
        if (this.#subscription) return;

        this.#subscribeInternal();
      }
    });
  }

  /**
   * Подписывается на изменения значений исходного контрола
   */
  subscribe(): void {
    if (this.#isDestroyed) return;
    this.#subscribeInternal();
  }

  /**
   * Отписывается от изменений значений
   */
  unsubscribe(): void {
    this.#unsubscribeInternal();
  }

  /**
   * Запускает логику зависимости один раз с текущим значением (без подписки)
   */
  runOnce(): void {
    if (this.#isDestroyed) return;

    const currentValue = this.sourceControlSchema.value().control.value;
    untracked(() => {
      this.dependencyEffectFn(currentValue);
    });
  }

  /**
   * Полностью уничтожает зависимость, очищая все подписки и эффекты
   * Должен вызываться при уничтожении родительской схемы
   */
  destroy(): void {
    if (this.#isDestroyed) return;

    this.#isDestroyed = true;
    this.#unsubscribeInternal();

    if (this.#effectRef) {
      this.#effectRef.destroy();
      this.#effectRef = null;
    }
  }

  #subscribeInternal(): void {
    if (this.#isDestroyed) return;

    const { control } = this.sourceControlSchema.value();

    this.#unsubscribeInternal();
    this.#subscription = control.valueChanges.pipe(startWith(control.value), distinctUntilChanged()).subscribe((value) => {
      if (this.#isDestroyed) return;

      untracked(() => {
        this.dependencyEffectFn(value);
      });
    });
  }

  #unsubscribeInternal(): void {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
      this.#subscription = null;
    }
  }
}
