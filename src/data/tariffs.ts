// Тарифы забора/доставки груза по городу — перенесены со старого сайта
// mastertrans.tk/tarify/ дословно. После интеграции с 1С источником станет
// зеркальная таблица direction_prices.

export type TariffRow = {
  maxWeightKg: number; // вес до, кг (строго меньше)
  maxVolumeM3: number; // объём до, м³
  maxDimensionM: number; // габарит до, м
  cityPrice: number; // по городу, ₽
  outOfCityPerKm: number; // за городом, ₽/км
  normHours: number | null; // нормативное время погрузки/выгрузки, ч
  idlePerHour: number | null; // простой, ₽/ч
};

export type CityTariff = {
  city: string;
  rows: TariffRow[];
  notes: string[];
};

export const cityTariffs: CityTariff[] = [
  {
    city: "Москва",
    rows: [
      { maxWeightKg: 60, maxVolumeM3: 0.15, maxDimensionM: 0.5, cityPrice: 1050, outOfCityPerKm: 25, normHours: 0.5, idlePerHour: 300 },
      { maxWeightKg: 80, maxVolumeM3: 0.2, maxDimensionM: 1.2, cityPrice: 1250, outOfCityPerKm: 25, normHours: 0.5, idlePerHour: 400 },
      { maxWeightKg: 100, maxVolumeM3: 0.5, maxDimensionM: 1.2, cityPrice: 1420, outOfCityPerKm: 25, normHours: 0.5, idlePerHour: 400 },
      { maxWeightKg: 150, maxVolumeM3: 0.6, maxDimensionM: 1.2, cityPrice: 1720, outOfCityPerKm: 25, normHours: 0.5, idlePerHour: 500 },
      { maxWeightKg: 300, maxVolumeM3: 1.2, maxDimensionM: 1.8, cityPrice: 2020, outOfCityPerKm: 25, normHours: 1, idlePerHour: 500 },
      { maxWeightKg: 500, maxVolumeM3: 2, maxDimensionM: 1.8, cityPrice: 2260, outOfCityPerKm: 30, normHours: 1, idlePerHour: 600 },
      { maxWeightKg: 750, maxVolumeM3: 3, maxDimensionM: 1.8, cityPrice: 2740, outOfCityPerKm: 30, normHours: 1, idlePerHour: 600 },
      { maxWeightKg: 1000, maxVolumeM3: 4, maxDimensionM: 1.8, cityPrice: 2980, outOfCityPerKm: 30, normHours: 1, idlePerHour: 700 },
      { maxWeightKg: 1250, maxVolumeM3: 5, maxDimensionM: 3, cityPrice: 3650, outOfCityPerKm: 35, normHours: 1.5, idlePerHour: 900 },
      { maxWeightKg: 1500, maxVolumeM3: 6, maxDimensionM: 3, cityPrice: 4160, outOfCityPerKm: 35, normHours: 1.5, idlePerHour: 1100 },
      { maxWeightKg: 2000, maxVolumeM3: 8, maxDimensionM: 3.8, cityPrice: 5200, outOfCityPerKm: 45, normHours: 1.5, idlePerHour: 1300 },
      { maxWeightKg: 3000, maxVolumeM3: 12, maxDimensionM: 3.8, cityPrice: 7900, outOfCityPerKm: 45, normHours: 2, idlePerHour: 1500 },
      { maxWeightKg: 5000, maxVolumeM3: 20, maxDimensionM: 5, cityPrice: 9700, outOfCityPerKm: 50, normHours: 3, idlePerHour: 1900 },
      { maxWeightKg: 10000, maxVolumeM3: 40, maxDimensionM: 6, cityPrice: 15200, outOfCityPerKm: 55, normHours: 4, idlePerHour: 2100 },
      { maxWeightKg: 20000, maxVolumeM3: 86, maxDimensionM: 13, cityPrice: 24000, outOfCityPerKm: 65, normHours: null, idlePerHour: null },
    ],
    notes: [
      "Боковая погрузка: 2 000 ₽ (до 1 500 кг), 2 500 ₽ (до 5 000 кг), 3 000 ₽ (свыше). Верхняя погрузка: 3 000 ₽.",
      "Автоэкспедирование в пределах ТТК: 500–3 000 ₽.",
      "Забор «день в день»: коэффициент 0,2–0,3.",
    ],
  },
  {
    city: "Грозный",
    rows: [
      { maxWeightKg: 60, maxVolumeM3: 0.15, maxDimensionM: 0.5, cityPrice: 300, outOfCityPerKm: 35, normHours: 0.1, idlePerHour: 300 },
      { maxWeightKg: 80, maxVolumeM3: 0.2, maxDimensionM: 1.2, cityPrice: 400, outOfCityPerKm: 35, normHours: 0.1, idlePerHour: 300 },
      { maxWeightKg: 100, maxVolumeM3: 0.5, maxDimensionM: 1.2, cityPrice: 450, outOfCityPerKm: 35, normHours: 0.1, idlePerHour: 300 },
      { maxWeightKg: 150, maxVolumeM3: 0.6, maxDimensionM: 1.2, cityPrice: 450, outOfCityPerKm: 35, normHours: 0.1, idlePerHour: 500 },
      { maxWeightKg: 300, maxVolumeM3: 1.2, maxDimensionM: 1.8, cityPrice: 600, outOfCityPerKm: 40, normHours: 0.2, idlePerHour: 500 },
      { maxWeightKg: 500, maxVolumeM3: 2, maxDimensionM: 1.8, cityPrice: 650, outOfCityPerKm: 40, normHours: 0.5, idlePerHour: 500 },
      { maxWeightKg: 750, maxVolumeM3: 3, maxDimensionM: 1.8, cityPrice: 700, outOfCityPerKm: 40, normHours: 0.5, idlePerHour: 500 },
      { maxWeightKg: 1000, maxVolumeM3: 4, maxDimensionM: 1.8, cityPrice: 700, outOfCityPerKm: 40, normHours: 0.5, idlePerHour: 1000 },
      { maxWeightKg: 1250, maxVolumeM3: 5, maxDimensionM: 3, cityPrice: 1000, outOfCityPerKm: 40, normHours: 0.5, idlePerHour: 1000 },
      { maxWeightKg: 1500, maxVolumeM3: 6, maxDimensionM: 3, cityPrice: 1000, outOfCityPerKm: 40, normHours: 0.5, idlePerHour: 1200 },
      { maxWeightKg: 2000, maxVolumeM3: 8, maxDimensionM: 3.8, cityPrice: 1100, outOfCityPerKm: 40, normHours: 1, idlePerHour: 1200 },
      { maxWeightKg: 3000, maxVolumeM3: 12, maxDimensionM: 3.8, cityPrice: 1500, outOfCityPerKm: 40, normHours: 1, idlePerHour: null },
      { maxWeightKg: 5000, maxVolumeM3: 20, maxDimensionM: 5, cityPrice: 3500, outOfCityPerKm: 40, normHours: 1, idlePerHour: null },
      { maxWeightKg: 10000, maxVolumeM3: 40, maxDimensionM: 6, cityPrice: 6000, outOfCityPerKm: 40, normHours: 2, idlePerHour: null },
      { maxWeightKg: 20000, maxVolumeM3: 86, maxDimensionM: 13, cityPrice: 12000, outOfCityPerKm: 50, normHours: 4, idlePerHour: null },
    ],
    notes: [
      "Боковая/верхняя погрузка: 1 000–2 000 ₽.",
      "Забор «день в день»: 10–25%.",
    ],
  },
  {
    city: "Хасавюрт",
    rows: [
      { maxWeightKg: 60, maxVolumeM3: 0.15, maxDimensionM: 0.5, cityPrice: 500, outOfCityPerKm: 25, normHours: 1, idlePerHour: 400 },
      { maxWeightKg: 80, maxVolumeM3: 0.2, maxDimensionM: 1.2, cityPrice: 500, outOfCityPerKm: 25, normHours: 1, idlePerHour: 400 },
      { maxWeightKg: 100, maxVolumeM3: 0.5, maxDimensionM: 1.2, cityPrice: 500, outOfCityPerKm: 25, normHours: 1, idlePerHour: 400 },
      { maxWeightKg: 150, maxVolumeM3: 0.6, maxDimensionM: 1.2, cityPrice: 600, outOfCityPerKm: 25, normHours: 1, idlePerHour: 450 },
      { maxWeightKg: 300, maxVolumeM3: 1.2, maxDimensionM: 1.8, cityPrice: 600, outOfCityPerKm: 25, normHours: 1, idlePerHour: 450 },
      { maxWeightKg: 500, maxVolumeM3: 2, maxDimensionM: 1.8, cityPrice: 600, outOfCityPerKm: 25, normHours: 1, idlePerHour: 450 },
      { maxWeightKg: 750, maxVolumeM3: 3, maxDimensionM: 1.8, cityPrice: 700, outOfCityPerKm: 25, normHours: 1, idlePerHour: 450 },
      { maxWeightKg: 1000, maxVolumeM3: 4, maxDimensionM: 1.8, cityPrice: 700, outOfCityPerKm: 25, normHours: 1, idlePerHour: 500 },
      { maxWeightKg: 1250, maxVolumeM3: 5, maxDimensionM: 3, cityPrice: 1400, outOfCityPerKm: 30, normHours: 1.5, idlePerHour: 600 },
      { maxWeightKg: 1500, maxVolumeM3: 6, maxDimensionM: 3, cityPrice: 1400, outOfCityPerKm: 30, normHours: 1.5, idlePerHour: 900 },
      { maxWeightKg: 2000, maxVolumeM3: 8, maxDimensionM: 3.8, cityPrice: 1600, outOfCityPerKm: 30, normHours: 1.5, idlePerHour: 1000 },
      { maxWeightKg: 3000, maxVolumeM3: 12, maxDimensionM: 3.8, cityPrice: 1800, outOfCityPerKm: 30, normHours: 1.5, idlePerHour: null },
      { maxWeightKg: 5000, maxVolumeM3: 20, maxDimensionM: 5, cityPrice: 3300, outOfCityPerKm: 40, normHours: 2, idlePerHour: null },
      { maxWeightKg: 10000, maxVolumeM3: 40, maxDimensionM: 6, cityPrice: 6900, outOfCityPerKm: 40, normHours: 3, idlePerHour: null },
      { maxWeightKg: 20000, maxVolumeM3: 86, maxDimensionM: 13, cityPrice: 8900, outOfCityPerKm: 50, normHours: 4, idlePerHour: null },
    ],
    notes: ["Боковая/верхняя погрузка: 500–2 000 ₽."],
  },
  {
    city: "Махачкала",
    rows: [
      { maxWeightKg: 60, maxVolumeM3: 0.15, maxDimensionM: 0.5, cityPrice: 500, outOfCityPerKm: 25, normHours: 0.5, idlePerHour: 300 },
      { maxWeightKg: 80, maxVolumeM3: 0.2, maxDimensionM: 1.2, cityPrice: 500, outOfCityPerKm: 25, normHours: 1, idlePerHour: 400 },
      { maxWeightKg: 100, maxVolumeM3: 0.5, maxDimensionM: 1.2, cityPrice: 500, outOfCityPerKm: 25, normHours: 1, idlePerHour: 400 },
      { maxWeightKg: 150, maxVolumeM3: 0.6, maxDimensionM: 1.2, cityPrice: 700, outOfCityPerKm: 25, normHours: 1, idlePerHour: 500 },
      { maxWeightKg: 300, maxVolumeM3: 1.2, maxDimensionM: 1.8, cityPrice: 900, outOfCityPerKm: 25, normHours: 1.5, idlePerHour: 500 },
      { maxWeightKg: 500, maxVolumeM3: 2, maxDimensionM: 1.8, cityPrice: 1000, outOfCityPerKm: 35, normHours: 1.5, idlePerHour: 600 },
      { maxWeightKg: 750, maxVolumeM3: 3, maxDimensionM: 1.8, cityPrice: 1000, outOfCityPerKm: 35, normHours: 1.5, idlePerHour: 600 },
      { maxWeightKg: 1000, maxVolumeM3: 4, maxDimensionM: 1.8, cityPrice: 1500, outOfCityPerKm: 40, normHours: 1.5, idlePerHour: 600 },
      { maxWeightKg: 1250, maxVolumeM3: 5, maxDimensionM: 3, cityPrice: 1500, outOfCityPerKm: 40, normHours: 2, idlePerHour: 700 },
      { maxWeightKg: 1500, maxVolumeM3: 6, maxDimensionM: 3, cityPrice: 1500, outOfCityPerKm: 40, normHours: 3, idlePerHour: 800 },
      { maxWeightKg: 2000, maxVolumeM3: 8, maxDimensionM: 3.8, cityPrice: 1700, outOfCityPerKm: 40, normHours: 3, idlePerHour: 1000 },
      { maxWeightKg: 3000, maxVolumeM3: 12, maxDimensionM: 3.8, cityPrice: 1900, outOfCityPerKm: 45, normHours: 4, idlePerHour: 1200 },
      { maxWeightKg: 5000, maxVolumeM3: 20, maxDimensionM: 5, cityPrice: 3900, outOfCityPerKm: 45, normHours: 5, idlePerHour: 1200 },
      { maxWeightKg: 10000, maxVolumeM3: 40, maxDimensionM: 6, cityPrice: 9500, outOfCityPerKm: 75, normHours: 5, idlePerHour: 1200 },
      { maxWeightKg: 20000, maxVolumeM3: 86, maxDimensionM: 13, cityPrice: 14500, outOfCityPerKm: 75, normHours: null, idlePerHour: null },
    ],
    notes: [
      "Боковая/верхняя погрузка: 2 000–2 500 ₽.",
      "Забор «день в день»: 15–30%.",
    ],
  },
  {
    city: "Ростов-на-Дону",
    rows: [
      { maxWeightKg: 60, maxVolumeM3: 0.15, maxDimensionM: 0.5, cityPrice: 450, outOfCityPerKm: 25, normHours: 0.5, idlePerHour: 300 },
      { maxWeightKg: 80, maxVolumeM3: 0.2, maxDimensionM: 1.2, cityPrice: 550, outOfCityPerKm: 25, normHours: 1, idlePerHour: 400 },
      { maxWeightKg: 100, maxVolumeM3: 0.5, maxDimensionM: 1.2, cityPrice: 700, outOfCityPerKm: 25, normHours: 1, idlePerHour: 400 },
      { maxWeightKg: 150, maxVolumeM3: 0.6, maxDimensionM: 1.2, cityPrice: 1000, outOfCityPerKm: 25, normHours: 1, idlePerHour: 500 },
      { maxWeightKg: 300, maxVolumeM3: 1.2, maxDimensionM: 1.8, cityPrice: 1250, outOfCityPerKm: 25, normHours: 1.5, idlePerHour: 500 },
      { maxWeightKg: 500, maxVolumeM3: 2, maxDimensionM: 1.8, cityPrice: 1400, outOfCityPerKm: 30, normHours: 1.5, idlePerHour: 600 },
      { maxWeightKg: 750, maxVolumeM3: 3, maxDimensionM: 1.8, cityPrice: 1550, outOfCityPerKm: 30, normHours: 1.5, idlePerHour: 600 },
      { maxWeightKg: 1000, maxVolumeM3: 4, maxDimensionM: 1.8, cityPrice: 1600, outOfCityPerKm: 30, normHours: 1.5, idlePerHour: 700 },
      { maxWeightKg: 1250, maxVolumeM3: 5, maxDimensionM: 3, cityPrice: 2000, outOfCityPerKm: 35, normHours: 2, idlePerHour: 900 },
      { maxWeightKg: 1500, maxVolumeM3: 6, maxDimensionM: 3, cityPrice: 2100, outOfCityPerKm: 35, normHours: 3, idlePerHour: 1100 },
      { maxWeightKg: 2000, maxVolumeM3: 8, maxDimensionM: 3.8, cityPrice: 3500, outOfCityPerKm: 40, normHours: 3, idlePerHour: 1300 },
      { maxWeightKg: 3000, maxVolumeM3: 12, maxDimensionM: 3.8, cityPrice: 6600, outOfCityPerKm: 40, normHours: 4, idlePerHour: 1500 },
      { maxWeightKg: 5000, maxVolumeM3: 20, maxDimensionM: 5, cityPrice: 9000, outOfCityPerKm: 45, normHours: 5, idlePerHour: 1700 },
      { maxWeightKg: 10000, maxVolumeM3: 40, maxDimensionM: 6, cityPrice: 12000, outOfCityPerKm: 55, normHours: 5, idlePerHour: 2000 },
      { maxWeightKg: 20000, maxVolumeM3: 86, maxDimensionM: 13, cityPrice: 15000, outOfCityPerKm: 60, normHours: null, idlePerHour: null },
    ],
    notes: [
      "Боковая/верхняя погрузка: 2 000–2 500 ₽.",
      "Автоэкспедирование в ТТК: 500–3 000 ₽.",
      "Забор «день в день»: 20–30%.",
    ],
  },
];

export const oversizeSurcharges = [
  "Вес одного места свыше 300 кг: +10%",
  "Вес одного места свыше 600 кг: +25%",
  "Вес одного места свыше 1 000 кг: +40%",
  "Длина стороны свыше 3 м: +20%",
  "Длина стороны свыше 6 м: +45%",
];

export const tariffConditions = [
  "Доставка в РЦ/ТЦ/ТС: +30%.",
  "Доставка в торговые сети (Эльдорадо, Леруа Мерлен, М-Видео, Яндекс Маркет и др.) — по дополнительным условиям.",
  "Доставка в РЦ маркетплейсов (OZON, Wildberries, Яндекс, Тандер и др.) — по дополнительным условиям.",
  "Подача к определённому времени: +30%.",
  "При недоповнении фактического веса/объёма — оплата по заявке.",
  "Стоимость определяется по максимальному параметру: вес, объём или габариты.",
  "Груз принимается по количеству мест без пересчёта внутренних вложений.",
  "Услуги погрузочно-разгрузочных работ рассчитываются индивидуально.",
  "Нормативное время включает: от прибытия ТС до выбытия, приёмку по количеству мест, оформление сопроводительных документов.",
];

// Расчёт стоимости забора/доставки по городу.
export function calcCityPickup(city: string, weightKg: number, volumeM3: number) {
  const tariff = cityTariffs.find((t) => t.city === city);
  if (!tariff) return null;
  const row = tariff.rows.find(
    (r) => weightKg < r.maxWeightKg && volumeM3 <= r.maxVolumeM3,
  );
  // Груз больше максимальной градации — индивидуальный расчёт
  return row ?? null;
}
