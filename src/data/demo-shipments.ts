// ДЕМО-данные трекинга: используются, пока не подключена PostgreSQL с зеркалом
// 1С. Формат повторяет будущие таблицы shipments + shipment_events.

export type PublicStatus = "registered" | "in_transit" | "at_pickup" | "received";

export const statusLabels: Record<PublicStatus, string> = {
  registered: "Оформлен",
  in_transit: "Груз в пути",
  at_pickup: "В пункте выдачи",
  received: "Груз получен",
};

export const statusOrder: PublicStatus[] = [
  "registered",
  "in_transit",
  "at_pickup",
  "received",
];

export type DemoShipment = {
  trackCode: string;
  status: PublicStatus;
  cityFrom: string;
  cityTo: string;
  placesCount: number;
  weightKg: number;
  volumeM3: number;
  events: { status: PublicStatus; date: string }[];
};

export const demoShipments: DemoShipment[] = [
  {
    trackCode: "MT-7K3F9Q",
    status: "in_transit",
    cityFrom: "Москва",
    cityTo: "Грозный",
    placesCount: 3,
    weightKg: 240,
    volumeM3: 1.1,
    events: [
      { status: "registered", date: "2026-08-01T10:20:00+03:00" },
      { status: "in_transit", date: "2026-08-02T08:00:00+03:00" },
    ],
  },
  {
    trackCode: "MT-2XA8ZR",
    status: "at_pickup",
    cityFrom: "Махачкала",
    cityTo: "Москва",
    placesCount: 1,
    weightKg: 48,
    volumeM3: 0.2,
    events: [
      { status: "registered", date: "2026-07-28T12:00:00+03:00" },
      { status: "in_transit", date: "2026-07-29T09:30:00+03:00" },
      { status: "at_pickup", date: "2026-08-02T17:45:00+03:00" },
    ],
  },
  {
    trackCode: "MT-9QLM44",
    status: "received",
    cityFrom: "Ростов-на-Дону",
    cityTo: "Хасавюрт",
    placesCount: 6,
    weightKg: 820,
    volumeM3: 3.4,
    events: [
      { status: "registered", date: "2026-07-20T11:10:00+03:00" },
      { status: "in_transit", date: "2026-07-21T07:00:00+03:00" },
      { status: "at_pickup", date: "2026-07-24T16:20:00+03:00" },
      { status: "received", date: "2026-07-25T10:05:00+03:00" },
    ],
  },
];

export function findShipment(trackCode: string): DemoShipment | undefined {
  return demoShipments.find(
    (s) => s.trackCode.toLowerCase() === trackCode.trim().toLowerCase(),
  );
}
