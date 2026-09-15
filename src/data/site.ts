export const site = {
  name: "Master Транс",
  tagline: "Логистика",
  description:
    "Транспортные грузоперевозки по России: сборные грузы, автоэкспедирование, доставка от двери до двери, упаковка, хранение и страхование груза.",
  slogan: "Доставим в срок ваш груз гарантированно",
  phoneMain: "+7 (495) 374-91-77",
  phoneMainHref: "tel:+74953749177",
  email: "mastertransmsk@mail.ru",
  emailDirector: "mastertrans-tk@mail.ru",
  schedule: "Ежедневно с 9:00 до 18:00",
  whatsapp: "https://wa.me/79691917777",
  telegram: "https://t.me/mastertrans_tk",
  requisites: {
    legalName: "ООО «Master Транс»",
    inn: "2013010320",
    ogrn: "1212000007812",
    kpp: "201301001",
    okpo: "55216543",
    legalAddress:
      "364024, Россия, Чеченская Республика, г. Грозный, ул. Хабаровская, д. 2",
  },
} as const;

export type Terminal = {
  slug: string;
  city: string;
  address: string;
  phone: string;
  phoneHref: string;
  note?: string;
};

export const terminals: Terminal[] = [
  {
    slug: "moskva",
    city: "Москва",
    address: "ул. 1-й Вязовский проезд, д. 4, стр. 5",
    phone: "+7 (495) 374-91-77",
    phoneHref: "tel:+74953749177",
  },
  {
    slug: "moskva-yuzhnye-vorota",
    city: "Москва — рынок Южные ворота",
    address: "15 вход",
    phone: "+7 (495) 374-91-77",
    phoneHref: "tel:+74953749177",
    note: "Пункт приёма груза",
  },
  {
    slug: "moskva-lyublino",
    city: "Москва — рынок Люблино",
    address: "7 вход",
    phone: "+7 (495) 374-91-77",
    phoneHref: "tel:+74953749177",
    note: "Пункт приёма груза",
  },
  {
    slug: "groznyy",
    city: "Грозный",
    address: "ул. Хабаровская, 2А",
    phone: "+7 (871) 277-05-95",
    phoneHref: "tel:+78712770595",
  },
  {
    slug: "khasavyurt",
    city: "Хасавюрт",
    address: "трасса Кавказ, 11-я линия",
    phone: "+7 (872) 315-57-05",
    phoneHref: "tel:+78723155705",
  },
  {
    slug: "makhachkala",
    city: "Махачкала",
    address: "ул. Каммаева, 88",
    phone: "+7 (872) 298-94-40",
    phoneHref: "tel:+78722989440",
  },
  {
    slug: "rostov",
    city: "Ростов-на-Дону",
    address: "проспект 40-летия Победы, 336/1",
    phone: "+7 (863) 322-20-86",
    phoneHref: "tel:+78633222086",
  },
];

// Города для форм (как на старом сайте)
export const formCities = [
  "Москва",
  "Грозный",
  "Хасавюрт",
  "Махачкала",
  "Ростов-на-Дону",
  "Луганск",
  "Донецк, ДНР",
] as const;

export const geography = {
  terminals: ["Москва", "Грозный", "Хасавюрт", "Махачкала", "Ростов-на-Дону"],
  addressDelivery: [
    "Донецк",
    "Луганск",
    "Ровеньки",
    "Лутугино",
    "Макеевка",
    "Харцызск",
    "Иловайск",
    "Амвросиевка",
  ],
  generalCargo: [
    "Санкт-Петербург",
    "Воронеж",
    "Волгодонск",
    "Мариуполь",
    "Бердянск",
    "Симферополь",
    "Севастополь",
    "Краснодар",
  ],
};

export const advantages = [
  {
    title: "Сотрудники",
    text: "Гарантируем бережное отношение к вашему грузу.",
  },
  { title: "Гарантия", text: "Перевозим грузы по РФ за 1–5 дней." },
  { title: "Автопарк", text: "Подача транспорта в день обращения." },
  {
    title: "Цена",
    text: "Мы определяем стоимость услуг до заключения договора.",
  },
] as const;

export const workStages = [
  { title: "Вы оставляете заявку", text: "и заказываете услугу" },
  { title: "Мы прорабатываем решение", text: "и делаем расчёты" },
  { title: "Заключаем договор", text: "и фиксируем сделку" },
  { title: "Доставляем груз", text: "качественно и в срок" },
] as const;
