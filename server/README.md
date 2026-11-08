# Центр дозвілля — REST API (лабораторні роботи №5 та №6)

Бекенд-додаток на базі boilerplate [mkosir/typeorm-express-typescript](https://github.com/mkosir/typeorm-express-typescript)
(TypeScript, Express 4, TypeORM 0.2, PostgreSQL 14), розширений сутностями курсової роботи
з проєктування бази даних «Центр дозвілля».

Вимоги середовища: Node.js 16+, Docker Desktop (WSL 2). Оригінальний README boilerplate збережено у `misc/README-boilerplate.md`.

> **Цей репозиторій здає лабораторну роботу №6** — «Впровадження сервісного шару, валідації та DTO»
> (розділ 7). Матеріал лабораторної №5 (сутності, міграції, CRUD) наведений як база, яку цей
> рефакторинг перебудовує без зміни зовнішніх контрактів API.

## 1. Сутності та зв'язки

| Сутність (клас)     | Таблиця в БД          | Поля                                                                                                         | Зв'язки                                                                           |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `Hall`              | `halls`               | `name` (унікальне), `capacity`, `description`, `created_at`, `updated_at`                                    | `OneToMany` → `Event`, `OneToMany` → `HallRental`                                 |
| `Event`             | `events`              | `name`, `type`, `start_datetime`, `end_datetime`, `hall_id`, `created_at`, `updated_at`                      | `ManyToOne` → `Hall`; `OneToMany` → `EventRegistration`, `Feedback`               |
| `Client`            | `clients`             | `full_name`, `email` (унікальний), `phone`, `created_at`, `updated_at`                                       | `OneToMany` → `HallRental`, `EventRegistration`, `Feedback`                       |
| `EventRegistration` | `event_registrations` | `event_id`, `client_id`, `seats`, `created_at`                                                               | `ManyToOne` → `Event`, `ManyToOne` → `Client`; унікальна пара (`event`, `client`) |
| `HallRental`        | `hall_rentals`        | `hall_id`, `client_id`, `start_datetime`, `end_datetime`, `total_cost`, `status`, `created_at`, `updated_at` | `ManyToOne` → `Hall`, `ManyToOne` → `Client`                                      |
| `Feedback`          | `feedback`            | `client_id`, `event_id`, `rating`, `comment`, `created_at`                                                   | `ManyToOne` → `Client`, `ManyToOne` → `Event`                                     |

Зв'язок many-to-many між `Client` і `Event` реалізовано через проміжну таблицю
`event_registrations`, яка одночасно зберігає додаткову колонку `seats`.

Типи-перелічнення винесено в `src/orm/entities/leisure/types.ts`:
`EventType` (`MASTER_CLASS`, `CONCERT`, `EXHIBITION`, `TOURNAMENT`, `LESSON`) та
`RentalStatus` (`RESERVED`, `CONFIRMED`, `COMPLETED`, `CANCELED`) — у БД це `character varying`
зі значенням за замовчуванням.

Зовнішні ключі, створені міграцією (7 FK):

```
hall_rentals.hall_id          → halls.id              hall_rentals.client_id        → clients.id
events.hall_id                → halls.id              event_registrations.event_id  → events.id
event_registrations.client_id → clients.id            feedback.client_id            → clients.id
feedback.event_id             → events.id
```

Усі FK-колонки оголошені `NOT NULL`, тому база не приймає записи без посилання.

## 2. Міграції

- `src/orm/migrations/1792341345014-CreateLeisureEntities.ts` — створення шести таблиць,
  унікальних індексів і зовнішніх ключів. Згенеровано CLI
  `npm run migration:generate -- CreateLeisureEntities` та застосовано `npm run migration:run:dev`.
- `src/orm/seeds/1791734236000-SeedLeisure.ts` — демо-дані (3 приміщення, 3 клієнти, 3 заходи,
  4 реєстрації, 2 оренди, 3 відгуки), застосовується `npm run seed:run:dev`. Метод `down()`
  видаляє дані у зворотному порядку залежностей.

## 3. Архітектура

Чотири шари, кожен відповідає за одне (лабораторна №6 — розділення відповідальності):

```
Router (src/routes/v1/*.ts)
  → middleware/validation/leisure/<сутність>/validator<Create|Update><Сутність>.ts   (шар 1: валідація)
    → controllers/leisure/<сутність>.ts                                              (шар 2: оркестрація)
      → services/leisure/<Сутність>Service.ts                                        (шар 3: бізнес-логіка)
        → CrudService.ts → getRepository(entity)                                     (шар 4: доступ до даних)
          → orm/entities/leisure/*                                                   (декоратори TypeORM)
```

- **Middleware (валідація)** — `src/middleware/validation/leisure/**`, по одному файлу на операцію
  (`validatorCreateHall.ts`, `validatorUpdateHall.ts` …). Кожна функція `async`, перевіряє `req.body`
  функціями бібліотеки `validator` (`isEmpty`, `isInt`, `isFloat`, `isEmail`, `isISO8601`, `isIn`),
  а у разі невалідних даних кидає `new AppError(...)` — до контролера запит взагалі не доходить.
  Оскільки Express 4 не ловить помилки з `async`-обробників, у роутах валідатори обгорнуті
  в `utils/asyncHandler.ts`, а `middleware/errorHandler.ts` перетворює `AppError` на відповідь
  `400` у форматі boilerplate (`errorType: 'Validation'`, `errorsValidation: [{ поле: текст }]`).
  Спільні правила полів зібрані в `dtos/leisure/helpers.ts`, інтерфейси запиту — в
  `dtos/leisure/<сутність>.dto.ts` (`Create…Dto` / `Update…Dto`).
- **Controller (оркестрація)** — `src/controllers/leisure/*.ts`. Жоден контролер не знає про
  репозиторій: він створює екземпляр потрібного сервісу, викликає метод, перетворює `entity` на
  `ResponseDTO` і віддає відповідь через `res.customSuccess(...)`; помилки сервісу мапить на
  `CustomError` (`crudErrors.ts`): `23505`/`23503` → 409, відсутній запис → 404, неіснуючий `*_id` → 400.
- **Service (бізнес-логіка)** — один клас на сутність: `HallService`, `ClientService`, `EventService`,
  `EventRegistrationService`, `HallRentalService`, `FeedbackService`. Клас інкапсулює опис роботи з
  репозиторієм (`relations`, скалярні й дата-поля, зовнішні ключі) і публікує `list / show / create / update / remove`.
- **Repository (доступ до даних)** — `getRepository(...)` всередині базового
  `services/leisure/CrudService.ts`; перевірка існування посилань (`UnknownForeignKeyError`) теж тут,
  бо потребує заиту до БД.

`AppError` винесено в `src/errors/AppError.ts`, щоб валідаторам не був потрішний `CustomError`
з форматом відповідей boilerplate.

## 4. Ендпоінти

Усі запити з префіксом `/v1`. Для кожної сутності — повний набір CRUD-операцій:

| Метод  | Ендпоінт                      | Опис                                                                  |
| ------ | ----------------------------- | --------------------------------------------------------------------- |
| GET    | `/v1/halls`                   | список приміщень із вкладеними `events`                               |
| GET    | `/v1/halls/:id`               | приміщення за id (з `events`)                                         |
| POST   | `/v1/halls`                   | створення приміщення                                                  |
| PATCH  | `/v1/halls/:id`               | часткове оновлення                                                    |
| DELETE | `/v1/halls/:id`               | видалення (409, якщо існують залежні записи)                          |
| GET    | `/v1/clients`                 | список клієнтів із вкладеними `rentals`                               |
| GET    | `/v1/clients/:id`             | клієнт за id (з `rentals`)                                            |
| POST   | `/v1/clients`                 | створення клієнта                                                     |
| PATCH  | `/v1/clients/:id`             | оновлення ПІБ, email або телефону                                     |
| DELETE | `/v1/clients/:id`             | видалення                                                             |
| GET    | `/v1/events`                  | заходи з `hall`, `registrations`, `registrations.client`, `feedbacks` |
| GET    | `/v1/events/:id`              | захід разом із приміщенням, реєстраціями й відгуками                  |
| POST   | `/v1/events`                  | створення заходу за `hall_id`                                         |
| PATCH  | `/v1/events/:id`              | оновлення, зокрема перенесення в інше приміщення                      |
| DELETE | `/v1/events/:id`              | видалення                                                             |
| GET    | `/v1/event-registrations`     | реєстрації з вкладеними `event`, `event.hall`, `client`               |
| GET    | `/v1/event-registrations/:id` | реєстрація за id                                                      |
| POST   | `/v1/event-registrations`     | запис клієнта на захід (`event_id`, `client_id`, `seats`)             |
| PATCH  | `/v1/event-registrations/:id` | зміна кількості місць або пари клієнт/захід                           |
| DELETE | `/v1/event-registrations/:id` | скасування реєстрації                                                 |
| GET    | `/v1/hall-rentals`            | оренди з вкладеними `hall` та `client`                                |
| GET    | `/v1/hall-rentals/:id`        | оренда за id                                                          |
| POST   | `/v1/hall-rentals`            | створення оренди                                                      |
| PATCH  | `/v1/hall-rentals/:id`        | оновлення дати, статусу чи суми                                       |
| DELETE | `/v1/hall-rentals/:id`        | видалення оренди                                                      |
| GET    | `/v1/feedbacks`               | відгуки з вкладеними `client`, `event`, `event.hall`                  |
| GET    | `/v1/feedbacks/:id`           | відгук за id                                                          |
| POST   | `/v1/feedbacks`               | створення відгуку                                                     |
| PATCH  | `/v1/feedbacks/:id`           | зміна оцінки чи коментаря                                             |
| DELETE | `/v1/feedbacks/:id`           | видалення                                                             |

**Ключова вимога — JOIN.** Відповіді не обмежуються сурогатними `*_id`: сервіс завантажує
`relations`, тому, наприклад, `GET /v1/hall-rentals/1` повертає оренду з вкладеними об'єктами
`hall` і `client`, а `GET /v1/events/1` — із вкладеним `hall`, списком `registrations` (кожна з
вкладеним `client`) і `feedbacks`. Той самий JOIN видно у відповідях `POST`/`PATCH`: після
створення чи оновлення запис повертається вже з зв'язаними даними.

**Формат відповіді (лабораторна №6).** Дані віддаються через `dtos/leisure/response/*ResponseDTO.ts`,
а не сирий об'єкт `entity`: зовнішні ключі дублюються скалярами (`hall_id`, `client_id`, `event_id`),
вкладені сутності стискаються до публічних полів (`hall` → `{id, name, capacity}`,
`client` → `{id, full_name, email}`), а службові `created_at` / `updated_at` у відповідь не
включаються взагалі.

## 5. Запуск (Windows)

```bat
docker compose --file docker-compose.yml --file docker-compose.dev.yml --compatibility up -d db_boilerplate
npm install
npm run migration:run:dev
npm run seed:run:dev
npm run dev
```

База працює у Docker Desktop (WSL 2) на порту `8432` (`PG_HOST=localhost`, `PG_PORT=8432` у `.env`),
додаток — на хості: `http://localhost:4000`. Перевірка: `GET http://localhost:4000/v1/halls`.

### Примітка щодо git-хуків на Windows

Перед-коміт-хук із `lint-staged` у початковому boilerplate на Windows + Git Bash не міг спавнити
`.bin`-шимули (`eslint`, `pretty-quick`, `tsc-files`): задача зависала без використання CPU.
У `.lintstagedrc` команди викликаються напряму через `node node_modules/<пакет>/...`, тому хуки
працюють і локально, і в CI. Для `eslint` додано `--no-ignore`, щоб точкові конфіг-файли
(`.commitlintrc.ts`, `.eslintrc.js`) не генерували попередження «File ignored by default»,
яке ломало `--max-warnings 0`.

## 6. Тестування через Postman

Колекція: [`postman/lab5-leisure-centre.postman_collection.json`](postman/lab5-leisure-centre.postman_collection.json)
(змінна `baseUrl = http://localhost:4000/v1`). Це послідовний сценарій: створення сутностей →
отримання списків і окремих записів → оновлення → кейси JOIN → негативні кейси (невалідні DTO,
неіснуючий FK, дубль унікального значення, 404) → видалення створених записів.

Ті самі запити можна прогнати без GUI:

```bat
npx newman run postman/lab5-leisure-centre.postman_collection.json
```

Результат прогону (повний лог — `postman/newman-run.txt`): 38 запитів, 63 твердження, 0 помилок.

Для зйомки ілюстрацій є друга, коротша колекція —
[`postman/lab5-screenshots.postman_collection.json`](postman/lab5-screenshots.postman_collection.json):
7 запитів під сім кадрів нижче, кожен із готовим тілом і перевірками на вкладці Tests, плюс тека
`Cleanup`, яка повертає базу до стану сидів. Прогін без GUI: 9 запитів, 21 твердження, 0 помилок.

### Скріншоти Postman

| Ендпоінт                                      | Що демонструує                                            | Файл                                    |
| --------------------------------------------- | --------------------------------------------------------- | --------------------------------------- |
| `POST /v1/hall-rentals`                       | 201 та вкладені `hall` і `client`                         | `docs/screenshots/01-rental-create.png` |
| `GET /v1/hall-rentals/:id`                    | JOIN оренди з приміщенням і клієнтом                      | `docs/screenshots/02-rental-show.png`   |
| `GET /v1/events/:id`                          | JOIN заходу з `hall`, `registrations.client`, `feedbacks` | `docs/screenshots/03-event-join.png`    |
| `GET /v1/event-registrations`                 | вкладені `event.hall` і `client`                          | `docs/screenshots/04-registrations.png` |
| `PATCH /v1/events/:id`                        | оновлення запису з поверненням JOIN                       | `docs/screenshots/05-event-patch.png`   |
| `POST /v1/hall-rentals` (`client_id: 999999`) | 400 `Validation` на неіснуючий зовнішній ключ             | `docs/screenshots/06-unknown-fk.png`    |
| `DELETE /v1/halls/:id` (наявні залежності)    | 409 через зовнішній ключ                                  | `docs/screenshots/07-delete-409.png`    |

## 7. Рефакторинг архітектури (лабораторна робота №6)

### 7.1. Що саме змінено

| Було (№5)                                                                                 | Стало (№6)                                                                             | Навіщо                                                                         |
| ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Фабрика `createCrudControllers(service)` + `definitions.ts`                               | Окремі класи `HallService`, `ClientService`, `EventService`, … (по одному на сутність) | Сервісний шар з єдиною відповідальністю; контролер не знає про репозиторій     |
| Валідація через фабрику `validateDto(validate, 'Create', …)`                              | Іменовані `async` middleware-функції на кожну операцію (`validatorCreateHall.ts` …)    | Чіткий ланцюжок роуту, перевірка `validator`-бібліотекою, `throw new AppError` |
| У відповіді — повна `entity` (з `created_at`, `updated_at`, повними вкладеними об'єктами) | Клас `…ResponseDTO`, що контрольовано віддає лише публічні поля                        | API не розкриває внутрішні поля БД; формат відповіді стабільний                |

### 7.2. Шар 1 — middleware-валідатор

`src/middleware/validation/leisure/hallRental/validatorCreateHallRental.ts`

```ts
import { NextFunction, Request, Response } from 'express';
import validator from 'validator';

import { validateCreateHallRentalDto } from 'dtos/leisure/hallRental.dto';
import { AppError } from 'errors/AppError';
import { throwValidationError } from 'middleware/validation/leisure/throwValidationError';

export async function validatorCreateHallRental(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const totalCost = String(body.total_cost ?? '');

  if (validator.isEmpty(totalCost)) {
    throw new AppError('Hall rental total_cost is required', [{ total_cost: 'total_cost is required' }]);
  }

  if (!validator.isFloat(totalCost, { min: 0 })) {
    throw new AppError('Hall rental total_cost must be a non-negative number', [
      { total_cost: 'total_cost must be a non-negative number' },
    ]);
  }

  throwValidationError('Hall rental', 'create', validateCreateHallRentalDto(body));

  return next();
}
```

Підключення до роуту — валідатор стоїть **перед** контролером, обгорнутий в `asyncHandler`
(Express 4 не ловить `throw` з `async`-функції, тому `next(error)` викликається всередині обгортки):

```ts
// src/routes/v1/hallRentals.ts
router.post('/', asyncHandler(validatorCreateHallRental), create);
router.patch('/:id([0-9]+)', asyncHandler(validatorUpdateHallRental), edit);
```

`AppError` (`src/errors/AppError.ts`) — легка помилка бізнес-рівня; `errorHandler` перетворює її на
формат відповідей boilerplate:

```json
{
  "errorType": "Validation",
  "errorMessage": "Hall rental total_cost must be a non-negative number",
  "errorsValidation": [{ "total_cost": "total_cost must be a non-negative number" }]
}
```

### 7.3. Шар 3 — сервіс-клас

`src/services/leisure/EventService.ts` — увесь діалог із репозиторієм (які `relations` тягнути, які
скалярні/дата-поля дозволено присвоювати, які `*_id` перевіряти на існування) інкапсульований тут:

```ts
import { Event } from 'orm/entities/leisure/Event';
import { Hall } from 'orm/entities/leisure/Hall';

import { CrudDefinition, CrudService } from './CrudService';

const definition: CrudDefinition<Event> = {
  resourceName: 'Event',
  entity: Event,
  relations: ['hall', 'registrations', 'registrations.client', 'feedbacks'],
  scalarFields: ['name', 'type'],
  dateFields: ['start_datetime', 'end_datetime'],
  foreignKeys: [{ bodyField: 'hall_id', relationName: 'hall', entity: Hall }],
};

export class EventService extends CrudService<Event> {
  constructor() {
    super(definition);
  }
}
```

Базовий `CrudService` — єдине місце, де викликається `getRepository()`; методи
`list / show / create / update / remove` + перевірка зовнішніх ключів (`UnknownForeignKeyError`).

### 7.4. Шар 2 — контролер і ResponseDTO

`src/dtos/leisure/response/HallRentalResponseDTO.ts`

```ts
export class HallRentalResponseDTO {
  id: number;
  hall_id: number | null;
  client_id: number | null;
  hall: HallSummaryDTO | null;
  client: ClientSummaryDTO | null;
  start_datetime: string | null;
  end_datetime: string | null;
  total_cost: number;
  status: string;

  constructor(rental: HallRental) {
    this.id = rental.id;
    this.hall_id = rental.hall ? rental.hall.id : null;
    this.client_id = rental.client ? rental.client.id : null;
    this.hall = rental.hall ? new HallSummaryDTO(rental.hall) : null;
    this.client = rental.client ? new ClientSummaryDTO(rental.client) : null;
    this.start_datetime = toIsoString(rental.start_datetime);
    this.end_datetime = toIsoString(rental.end_datetime);
    this.total_cost = Number(rental.total_cost);
    this.status = rental.status;
  }
}
```

`src/controllers/leisure/hallRentals.ts` — оркестрація без жодного звернення до репозиторію:

```ts
export const show = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const { id } = req.params;

  try {
    const rental = await new HallRentalService().show(id);
    if (!rental) {
      return next(notFoundError(RESOURCE, id));
    }
    return res.customSuccess(200, `${RESOURCE} found.`, new HallRentalResponseDTO(rental));
  } catch (err) {
    return next(toCrudError(err, RESOURCE, 'retrieve'));
  }
};
```

### 7.5. Одна й та сама відповідь: до і після

`GET /v1/hall-rentals/1` до рефакторингу (сира `entity`):

```json
{
  "id": 1,
  "hall": {
    "id": 2,
    "name": "Concert Hall",
    "capacity": 120,
    "description": "Main hall with stage and sound system",
    "created_at": "2026-10-18T17:20:31.412Z",
    "updated_at": "2026-10-18T17:20:31.412Z"
  },
  "client": {
    "id": 2,
    "full_name": "Boris Ivanchenko",
    "email": "boris.ivanchenko@test.com",
    "phone": "+380672223344",
    "rentals": [],
    "created_at": "…",
    "updated_at": "…"
  },
  "start_datetime": "2026-12-05T16:00:00.000Z",
  "end_datetime": "2026-12-05T19:00:00.000Z",
  "total_cost": 1800,
  "status": "CONFIRMED",
  "created_at": "2026-10-18T17:20:31.412Z",
  "updated_at": "2026-10-18T17:20:31.412Z"
}
```

після (структура `HallRentalResponseDTO`):

```json
{
  "id": 1,
  "hall_id": 2,
  "client_id": 2,
  "hall": { "id": 2, "name": "Concert Hall", "capacity": 120 },
  "client": { "id": 2, "full_name": "Boris Ivanchenko", "email": "boris.ivanchenko@test.com" },
  "start_datetime": "2026-12-05T16:00:00.000Z",
  "end_datetime": "2026-12-05T19:00:00.000Z",
  "total_cost": 1800,
  "status": "CONFIRMED"
}
```

### 7.6. Перевірка рефакторингу

Регресію покрито існуючою колекцією №5 — `38 запитів, 63 твердження, 0 помилок`
(`postman/newman-run.txt`), тобто контракти статусів і JOIN не зламалися. Нова колекція
[`postman/lab6-refactoring.postman_collection.json`](postman/lab6-refactoring.postman_collection.json)
цілеспрямовано перевіряє щойно впроваджені шари: 400 із `errorMessage` валідатора, схлопнуті
вкладені об'єкти за `Object.keys(...)`, відсутність `created_at` / `updated_at`.
Прогін без GUI: `npx newman run postman/lab6-refactoring.postman_collection.json` —
6 запитів, 15 тверджень, 0 помилок (лог — `postman/newman-run-lab6.txt`).

### Скріншоти Postman (лабораторна №6)

| Ендпоінт                                   | Що демонструує                                              | Файл                                             |
| ------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------ |
| `POST /v1/halls` (без `name`)              | 400 `Validation` із middleware-валідатора                   | `docs/screenshots/6-01-middleware-400-name.png`  |
| `POST /v1/hall-rentals` (`total_cost: -5`) | 400 від `validator.isFloat`                                 | `docs/screenshots/6-02-middleware-400-float.png` |
| `PATCH /v1/events/1` (порожнє тіло)        | 400 на оновленні, до контролера справа не доходить          | `docs/screenshots/6-03-middleware-400-empty.png` |
| `GET /v1/hall-rentals/1`                   | структура `HallRentalResponseDTO` (`*_id` + стислі зв'язки) | `docs/screenshots/6-04-dto-rental-show.png`      |
| `POST /v1/events`                          | успішне створення через сервіс і `EventResponseDTO`         | `docs/screenshots/6-05-dto-event-create.png`     |

## 8. Висновки

**Лабораторна №5.** Реалізовано шість пов'язаних сутностей курсової бази даних із декларативними
зв'язками TypeORM (`ManyToOne` / `OneToMany`, many-to-many через `event_registrations`), зміну схеми
проваджено міграцією з сімома зовнішніми ключами, та побудовано повний CRUD-інтерфейс із окремим
шаром DTO. Ключову вимогу роботи — отримання даних із зв'язаних таблиць — покрито конфігурацією
`relations` в сервісному шарі, що підтверджено прогоном колекції Postman (38 запитів, 63 твердження,
без помилок).

**Лабораторна №6.** Проведено комплексний рефакторинг за принципом розділення відповідальності:
виокремлено сервісний шар (по одному класу-сервісу на сутність, лише він знає про `getRepository`),
впроваджено валідацію вхідних даних окремими `async` middleware-функціями на бібліотеці `validator`,
які кидають `AppError` і через `asyncHandler`/`errorHandler` повертають контрольований `400 Validation`
до виклику контролера, та переведено отримані відповіді на `ResponseDTO`, які не розкривають
службові поля БД (`created_at`, `updated_at`) і стискають вкладені зв'язки до публічних полів.
Контракт API за статусами залишився зворотно сумісним — регресійний прогін колекції №5 пройшов без
помилок, а нові шари перевірено окремою колекцією №6 (6 запитів, 15 тверджень, без помилок).
