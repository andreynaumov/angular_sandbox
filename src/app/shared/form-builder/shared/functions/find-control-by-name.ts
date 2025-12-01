import { AbstractControl, FormArray, FormGroup, UntypedFormGroup } from '@angular/forms';

/**
 * Рекурсивно ищет контрол формы по имени внутри структуры формы.
 * Ищет через FormGroups и FormArrays, чтобы найти целевой контрол.
 *
 * @param controlName - Имя контрола для поиска
 * @param rootControl - Корневой контрол, с которого начинается поиск
 * @returns Найденный контрол или null, если не найден
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   user: new FormGroup({
 *     email: new FormControl('test@example.com')
 *   })
 * });
 * const emailControl = findControlByName('email', form);
 * ```
 */
export function findControlByName(controlName: string, rootControl: AbstractControl): AbstractControl | null {
  if (rootControl instanceof FormGroup) {
    /**
     * Проверяем прямые дочерние контролы
     */
    if (Object.prototype.hasOwnProperty.call(rootControl.controls, controlName)) {
      return rootControl.controls[controlName];
    }

    /**
     * Ищем во вложенных группах и массивах
     */
    for (const currentControl of Object.values(rootControl.controls)) {
      if (currentControl instanceof FormGroup || currentControl instanceof FormArray) {
        const foundControl = findControlByName(controlName, currentControl);

        if (foundControl) {
          return foundControl;
        }
      }
    }
  } else if (rootControl instanceof FormArray) {
    /**
     * Ищем в элементах FormArray
     */
    for (const currentControl of rootControl.controls) {
      if (currentControl instanceof FormGroup || currentControl instanceof FormArray) {
        const foundControl = findControlByName(controlName, currentControl);

        if (foundControl) {
          return foundControl;
        }
      }
    }
  }

  return null;
}
