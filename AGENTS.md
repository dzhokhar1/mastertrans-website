<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Мастертранс — сайт транспортной компании

Сайт грузоперевозчика «Мастертранс»: публичный трекинг груза по ID, калькулятор
стоимости от цен 1С по направлениям, личный кабинет с ролями (грузоотправитель /
грузополучатель / оператор / админ). Полный архитектурный отчёт:
https://claude.ai/code/artifact/1b7a3e19-34b6-4da2-bbd0-21a0dff0a02a

## Архитектура (утверждена, не менять без обсуждения)

- 1С стоит на офисном ПК (24/7, но может внезапно выключиться) и **всегда
  инициирует соединения сама**: push изменений (статусы, НСИ, цены) на
  `/api/integration/v1/*` + poll новых заявок с ACK, раз в 1–5 минут.
  Из офиса наружу ничего не публикуется. Сайт НИКОГДА не ходит в 1С напрямую.
- PostgreSQL сайта — единственный источник для публичных страниц и ЛК
  (зеркало 1С). Ключ синхронизации — `ref_1c` (UUID ссылки 1С), запись через
  UPSERT ON CONFLICT; удаления — soft delete (`is_active = false`).
- Идемпотентность заявок: `orders.id` (site_order_id) хранится реквизитом
  документа в 1С; ACK возвращает `ref_1c` и номер документа.
- Интеграционный API защищён HMAC-SHA256 подписью тела + timestamp (окно 5 мин),
  подпись проверяется ДО парсинга JSON.
- Маппинг статусов 1С → публичные — таблица `status_map`, не хардкод:
  «размещён и отправлен» → «Груз в пути», «доставлен» → «В пункте выдачи»,
  «закрыт» → «Груз получен».
- Трек-номер (`shipments.track_code`) — с энтропией, не перечисляемый.
  Публичный трекинг отдаёт только статус/города/таймлайн — без ФИО и сумм.

## Стек

Next.js 16 App Router + TypeScript, Tailwind 4 + shadcn/ui (radix-nova),
Drizzle ORM + PostgreSQL 16, Better Auth (RBAC), деплой: Docker Compose + Caddy
на VPS в РФ (152-ФЗ).

## Дизайн

Референс по структуре и композиции — megatrans-tk.ru (порядок блоков,
мини-калькулятор + трекер на первом экране, тарифные таблицы). Реализация,
стили, тексты и графика — СВОИ: не копировать чужой код/ассеты/тексты 1-в-1.
Контент переносится со старого сайта mastertrans.tk (принадлежит заказчику).

## Структура и дорожная карта

Целевая структура кода, границы модулей и статус этапов — в
`docs/ARCHITECTURE.md`. Новая логика кладётся в `src/modules/*`, страницы —
тонкие. Перед началом работы сверяться со статусом там и обновлять его.

## Конвенции

- Язык интерфейса — русский; код, идентификаторы, коммиты — английский.
- Серверные данные — RSC + Drizzle напрямую; клиентские формы —
  react-hook-form + zod.
- Money: numeric в БД, строки в TS (не float).
- Не добавлять зависимостей без необходимости; никаких PaaS-панелей.
