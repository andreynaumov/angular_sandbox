import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, map, of, OperatorFunction, pipe, throwError } from 'rxjs';

/**
 * Класс для представления успешного ответа от API.
 *
 * @template T - Тип данных успешного ответа
 */
export class SuccessApiResponse<T> {
  constructor(private readonly payload: T) {}

  /**
   * Получить значение успешного ответа.
   *
   * @returns Данные успешного ответа
   */
  public getValue(): T {
    return this.payload;
  }
}

/**
 * Тип для функции-обработчика ошибок.
 * Обработчик должен возвращать экземпляр класса ошибки или null, если ошибка не обрабатывается.
 *
 * @template E - Тип класса ошибки, который возвращает обработчик
 */
export type ErrorHandler<E extends HttpErrorApiResponse<unknown>> = (error: unknown) => E | null;

/**
 * Функция для преобразования ответа от сервера.
 * Обрабатывает только те ошибки, для которых передан соответствующий обработчик.
 *
 * **Важно:** Обработчики проверяются в порядке их передачи.
 * Первый обработчик, который вернет не-null значение, будет использован.
 * Поэтому более специфичные обработчики должны идти перед общими.
 *
 * @template T - Тип данных успешного ответа
 * @template H - Массив типов обработчиков ошибок
 *
 * @param handlers - Обработчики ошибок (порядок важен!)
 *
 * @returns RxJS оператор для преобразования Observable
 *
 * @example
 * ```typescript
 * public saveMiniForm(
 *   miniFormDto: MiniFormDto,
 * ): Observable<
 *   | ValidationErrorApiResponse<ValidationErrors>
 *   | BadRequestErrorApiResponse<string>
 *   | SuccessApiResponse<{ mortyId: number }>
 * > {
 *   return this.#http
 *     .post<{ mortyId: number }>(`${this.#path}/miniquestionnaire`, miniFormDto)
 *     .pipe(
 *       mapResponse(
 *         validationErrorHandler<ValidationErrors>(),
 *         badRequestErrorHandler<string>(),
 *       ),
 *     );
 * }
 * ```
 */
export function mapResponse<T, H extends Array<ErrorHandler<HttpErrorApiResponse<unknown>>>>(
  ...handlers: H
): OperatorFunction<T, SuccessApiResponse<T> | Exclude<ReturnType<H[number]>, null>> {
  return pipe(
    map((response) => new SuccessApiResponse(response)),
    catchError((error) => {
      // Находим первый обработчик, который вернул не-null значение
      const handledError = handlers.map((handler) => handler(error)).find(Boolean);

      if (handledError) {
        return of(handledError as Exclude<ReturnType<H[number]>, null>);
      }

      // Если ни один обработчик не обработал ошибку, пробрасываем её дальше
      return throwError(() => error);
    }),
  );
}

/**
 * Базовый класс для представления ошибки HTTP запроса.
 *
 * @template T - Тип данных ошибки (обычно объект с деталями ошибки)
 */
export class HttpErrorApiResponse<T = null> {
  constructor(protected readonly payload: T) {}

  /**
   * Получить данные ошибки.
   *
   * @returns Данные ошибки
   */
  public getError(): T {
    return this.payload;
  }
}

/**
 * Обработчик для любых HTTP ошибок.
 * Используется как fallback для обработки ошибок, которые не были обработаны другими обработчиками.
 *
 * **Внимание:** Этот обработчик должен быть последним в списке обработчиков,
 * так как он обрабатывает все HTTP ошибки.
 *
 * @param error - Ошибка для обработки
 * @returns Экземпляр HttpErrorApiResponse или null
 */
export function httpErrorHandler(error: unknown): HttpErrorApiResponse<null> | null {
  if (error instanceof HttpErrorResponse) {
    return new HttpErrorApiResponse(null);
  }

  return null;
}

/**
 * Класс для представления ошибки 400 Bad Request.
 *
 * @template T - Тип данных ошибки (обычно объект с деталями ошибки)
 */
export class BadRequestErrorApiResponse<T> extends HttpErrorApiResponse<T> {}

/**
 * Обработчик для ошибок 400 Bad Request.
 *
 * @template T - Тип данных ошибки (обычно объект с деталями ошибки)
 * @param error - Ошибка для обработки
 * @returns Экземпляр BadRequestErrorApiResponse или null
 */
export function badRequestErrorHandler<T>(error: unknown): BadRequestErrorApiResponse<T> | null {
  if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.BadRequest) {
    return new BadRequestErrorApiResponse(error.error);
  }

  return null;
}

/**
 * Класс для представления ошибки 500 Internal Server Error.
 */
export class InternalServerErrorApiResponse extends HttpErrorApiResponse<null> {}

/**
 * Обработчик для ошибок 500 Internal Server Error.
 *
 * @param error - Ошибка для обработки
 * @returns Экземпляр InternalServerErrorApiResponse или null
 */
export function internalServerErrorHandler(error: unknown): InternalServerErrorApiResponse | null {
  if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.InternalServerError) {
    return new InternalServerErrorApiResponse(null);
  }

  return null;
}

/**
 * Класс для представления ошибки валидации 422 Unprocessable Entity.
 *
 * @template T - Тип данных ошибки валидации (обычно объект с полями и их ошибками)
 */
export class ValidationErrorApiResponse<T> extends HttpErrorApiResponse<T> {}

/**
 * Обработчик для ошибок валидации 422 Unprocessable Entity.
 *
 * @template T - Тип данных ошибки валидации (обычно объект с полями и их ошибками)
 * @param error - Ошибка для обработки
 * @returns Экземпляр ValidationErrorApiResponse или null
 */
export function validationErrorHandler<T>(error: unknown): ValidationErrorApiResponse<T> | null {
  if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.UnprocessableEntity) {
    return new ValidationErrorApiResponse(error.error);
  }

  return null;
}
