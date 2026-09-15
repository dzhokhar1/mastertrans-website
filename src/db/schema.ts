import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ── Зеркало НСИ из 1С ────────────────────────────────────────────────
// Все зеркальные таблицы синхронизируются по ref1c (УникальныйИдентификатор
// объекта 1С): UPSERT ... ON CONFLICT (ref_1c). Удаление в 1С — это пометка
// удаления, поэтому здесь soft delete через isActive.

export const nomenclature = pgTable("nomenclature", {
  id: uuid("id").primaryKey().defaultRandom(),
  ref1c: uuid("ref_1c").notNull().unique(),
  name: text("name").notNull(),
  kind: varchar("kind", { length: 32 }).notNull().default("service"), // service | packaging | warehouse
  unit: varchar("unit", { length: 32 }),
  basePrice: numeric("base_price", { precision: 12, scale: 2 }),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const directions = pgTable("directions", {
  id: uuid("id").primaryKey().defaultRandom(),
  ref1c: uuid("ref_1c").notNull().unique(),
  cityFrom: text("city_from").notNull(),
  cityTo: text("city_to").notNull(),
  transitDays: integer("transit_days"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Цена конкретной позиции номенклатуры на конкретном направлении —
// основа калькулятора ("цены номенклатуры связать с направлениями").
export const directionPrices = pgTable("direction_prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  directionRef: uuid("direction_ref")
    .notNull()
    .references(() => directions.ref1c),
  nomenclatureRef: uuid("nomenclature_ref")
    .notNull()
    .references(() => nomenclature.ref1c),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  priceUnit: varchar("price_unit", { length: 32 }), // за кг / за м3 / за место / фикс
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pickupPoints = pgTable("pickup_points", {
  id: uuid("id").primaryKey().defaultRandom(),
  ref1c: uuid("ref_1c").notNull().unique(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 32 }),
  schedule: text("schedule"),
  lat: numeric("lat", { precision: 9, scale: 6 }),
  lon: numeric("lon", { precision: 9, scale: 6 }),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const counterparties = pgTable("counterparties", {
  id: uuid("id").primaryKey().defaultRandom(),
  ref1c: uuid("ref_1c").notNull().unique(),
  name: text("name").notNull(),
  inn: varchar("inn", { length: 12 }),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Грузы и публичный трекинг ────────────────────────────────────────

// Маппинг статусов 1С → публичный статус: правится в БД без деплоя.
export const statusMap = pgTable("status_map", {
  code1c: varchar("code_1c", { length: 64 }).primaryKey(), // «размещён и отправлен»…
  publicCode: varchar("public_code", { length: 32 }).notNull(), // in_transit | at_pickup | received | registered
  publicLabel: text("public_label").notNull(), // «Груз в пути»…
  sortOrder: integer("sort_order").notNull().default(0),
});

export const shipments = pgTable("shipments", {
  id: uuid("id").primaryKey().defaultRandom(),
  ref1c: uuid("ref_1c").notNull().unique(),
  trackCode: varchar("track_code", { length: 16 }).notNull().unique(), // с энтропией, не перечисляемый
  status1c: varchar("status_1c", { length: 64 }).notNull(),
  directionRef: uuid("direction_ref").references(() => directions.ref1c),
  senderRef: uuid("sender_ref").references(() => counterparties.ref1c),
  receiverRef: uuid("receiver_ref").references(() => counterparties.ref1c),
  payerRef: uuid("payer_ref").references(() => counterparties.ref1c),
  placesCount: integer("places_count"),
  weightKg: numeric("weight_kg", { precision: 10, scale: 3 }),
  volumeM3: numeric("volume_m3", { precision: 10, scale: 3 }),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }),
  servicesDetail: jsonb("services_detail"), // доп. услуги построчно [{name, amount}]
  statusUpdatedAt: timestamp("status_updated_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// История переходов статусов — таймлайн на странице трекинга.
export const shipmentEvents = pgTable("shipment_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  shipmentRef: uuid("shipment_ref")
    .notNull()
    .references(() => shipments.ref1c),
  status1c: varchar("status_1c", { length: 64 }).notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
});

// ── Заявки из ЛК (сайт — источник истины до ACK из 1С) ──────────────

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(), // site_order_id — идемпотентный ключ для 1С
  status: varchar("status", { length: 16 }).notNull().default("new"), // new | picked | acked | rejected
  ref1c: uuid("ref_1c").unique(), // появляется после ACK из 1С
  number1c: varchar("number_1c", { length: 32 }),
  payload: jsonb("payload").notNull(), // всё содержимое заявки (груз, стороны, услуги, расчёт)
  createdByUserId: text("created_by_user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  ackedAt: timestamp("acked_at", { withTimezone: true }),
});

// ── Журнал обмена с 1С ───────────────────────────────────────────────

export const syncLog = pgTable("sync_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  direction: varchar("direction", { length: 8 }).notNull(), // in | out
  endpoint: text("endpoint").notNull(),
  payload: jsonb("payload"),
  status: varchar("status", { length: 16 }).notNull(), // ok | error
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
