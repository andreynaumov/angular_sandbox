import { AbstractControl, UntypedFormGroup } from '@angular/forms';

/**
 * Проходит вверх по дереву контролов, чтобы найти корневую группу формы.
 *
 * @param control - Любой контрол формы внутри дерева формы
 * @returns Корневая группа формы
 *
 * @example
 * ```typescript
 * const rootForm = getRootControl(someNestedControl);
 * ```
 */
export function getRootControl(control: AbstractControl): UntypedFormGroup {
  let currentControl = control;

  while (currentControl.parent) currentControl = currentControl.parent;

  return currentControl as UntypedFormGroup;
}
