# Примеры использования утилиты обработки ответов API

## Обзор

Утилита `api-response-handler` предоставляет типобезопасный способ обработки ответов от HTTP запросов в Angular приложениях. Она позволяет явно обрабатывать различные типы ошибок и успешные ответы.

## Основные компоненты

- **SuccessApiResponse<T>** - класс для успешных ответов
- **HttpErrorApiResponse<T>** - базовый класс для ошибок HTTP
- **mapResponse()** - функция для преобразования Observable с обработкой ошибок
- Обработчики ошибок: `validationErrorHandler`, `badRequestErrorHandler`, `internalServerErrorHandler`, `httpErrorHandler`

## Примеры использования

### 1. Базовый пример - регистрация пользователя

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  mapResponse,
  SuccessApiResponse,
  ValidationErrorApiResponse,
  BadRequestErrorApiResponse,
  validationErrorHandler,
  badRequestErrorHandler,
} from '../utils/api-response-handler';

interface RegisterUserDto {
  email: string;
  password: string;
}

interface RegisterUserResponse {
  userId: number;
  email: string;
}

interface ValidationErrors {
  [field: string]: string[];
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  registerUser(
    userData: RegisterUserDto,
  ): Observable<
    SuccessApiResponse<RegisterUserResponse> | ValidationErrorApiResponse<ValidationErrors> | BadRequestErrorApiResponse<string>
  > {
    return this.http
      .post<RegisterUserResponse>('/api/users/register', userData)
      .pipe(mapResponse(validationErrorHandler<ValidationErrors>(), badRequestErrorHandler<string>()));
  }
}
```

### 2. Использование в компоненте

```typescript
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { SuccessApiResponse, ValidationErrorApiResponse, BadRequestErrorApiResponse } from '../utils/api-response-handler';

@Component({
  selector: 'app-registration',
  template: `...`,
})
export class RegistrationComponent {
  constructor(private userService: UserService) {}

  onSubmit() {
    this.userService
      .registerUser({
        email: 'user@example.com',
        password: 'password123',
      })
      .subscribe({
        next: (result) => {
          // TypeScript знает все возможные типы результата!
          if (result instanceof SuccessApiResponse) {
            const userData = result.getValue();
            console.log('User registered:', userData);
          } else if (result instanceof ValidationErrorApiResponse) {
            const errors = result.getError();
            // Показать ошибки валидации в форме
            Object.keys(errors).forEach((field) => {
              console.error(`${field}:`, errors[field]);
            });
          } else if (result instanceof BadRequestErrorApiResponse) {
            const errorMessage = result.getError();
            console.error('Bad request:', errorMessage);
          }
        },
        error: (error) => {
          // Обработка необработанных ошибок (сетевые ошибки и т.д.)
          console.error('Unexpected error:', error);
        },
      });
  }
}
```

### 3. Пример с несколькими обработчиками

```typescript
// Порядок обработчиков важен! Более специфичные должны идти первыми
this.http
  .put<User>('/api/users/123', userData)
  .pipe(
    mapResponse(
      validationErrorHandler<ValidationErrors>(), // 422 - первым
      badRequestErrorHandler<string>(), // 400 - вторым
      internalServerErrorHandler, // 500 - третьим
      httpErrorHandler, // Все остальные - последним
    ),
  )
  .subscribe({
    next: (result) => {
      if (result instanceof SuccessApiResponse) {
        // Успешное обновление
      } else if (result instanceof ValidationErrorApiResponse) {
        // Ошибки валидации
      } else if (result instanceof BadRequestErrorApiResponse) {
        // Ошибка запроса
      } else if (result instanceof InternalServerErrorApiResponse) {
        // Ошибка сервера
      } else if (result instanceof HttpErrorApiResponse) {
        // Другие HTTP ошибки
      }
    },
  });
```

### 4. Пример с обработкой только определенных ошибок

```typescript
// Обрабатываем только ошибки валидации, остальные пробрасываем дальше
this.http
  .post<Data>('/api/endpoint', payload)
  .pipe(mapResponse(validationErrorHandler<ValidationErrors>()))
  .subscribe({
    next: (result) => {
      if (result instanceof SuccessApiResponse) {
        // Успех
      } else if (result instanceof ValidationErrorApiResponse) {
        // Ошибка валидации
      }
    },
    error: (error) => {
      // Все остальные ошибки попадут сюда
      // (404, 500, сетевые ошибки и т.д.)
    },
  });
```

## Доступные обработчики ошибок

### validationErrorHandler<T>()

Обрабатывает ошибки **422 Unprocessable Entity** (ошибки валидации).

```typescript
validationErrorHandler<ValidationErrors>();
```

### badRequestErrorHandler<T>()

Обрабатывает ошибки **400 Bad Request**.

```typescript
badRequestErrorHandler<string>();
```

### internalServerErrorHandler

Обрабатывает ошибки **500 Internal Server Error**.

```typescript
internalServerErrorHandler;
```

### httpErrorHandler

Обрабатывает **все HTTP ошибки**. Должен быть последним в списке обработчиков.

```typescript
httpErrorHandler;
```

## Полный пример сервиса

См. файл `src/app/services/user.service.ts` для полного примера сервиса с различными методами API.

## Полный пример компонента

См. файл `src/app/components/user-registration/user-registration.component.ts` для полного примера компонента с обработкой всех типов ответов.

## Преимущества

1. **Типобезопасность** - TypeScript знает все возможные типы ответов
2. **Явная обработка ошибок** - видно, какие ошибки обрабатываются
3. **Порядок обработки** - контроль над приоритетом обработчиков
4. **Чистый код** - нет необходимости в множественных блоках catch
5. **Легкое тестирование** - легко мокировать различные типы ответов
