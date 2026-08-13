#!/usr/bin/env python3
"""Build the public Master Trans pages from untouched Vozovoz page shells.

The donor markup remains available in the repository as a reference, while only
the small, confirmed Master Trans page set is emitted for GitHub Pages.
"""

from __future__ import annotations

import html
import re
import shutil
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT.parent / "mastertrans.tk-mirror" / "mastertrans.tk"
PUBLIC = ROOT / "public"

CITIES = {
    "moskva": ("Москва", "+7 (495) 374-91-77", "ул. 1-й Вязовский проезд, д. 4, стр. 5"),
    "grozny": ("Грозный", "+7 (871) 277-05-95", "ул. Хабаровская, 2А"),
    "hasavyurt": ("Хасавюрт", "+7 (872) 315-57-05", "трасса Кавказ, 11-я линия"),
    "mahachkala": ("Махачкала", "+7 (872) 298-94-40", "ул. Каммаева, 88"),
    "rostov-na-donu": ("Ростов-на-Дону", "+7 (863) 322-20-86", "проспект 40-летия Победы, 336/1"),
}

SERVICE_ROWS = [
    ("Жесткая упаковка (обрешетка)", "700 ₽", "1500 ₽"),
    ("Мягкая упаковка (стрейч пленка, картон)", "200 ₽", "200 ₽"),
    ("Паллетирование (1 палет, стрейч)", "500 ₽", "500 ₽"),
    ("Коммерческая почта", "30 ₽", "30 ₽"),
    ("Мешок под пломбой", "120 ₽", "120 ₽"),
    ("Сверхнормативное хранение", "100 ₽", "200 ₽"),
    ("Переклейка штрихкодов на товар для MarketPlace", "20 ₽ одна шт", "—"),
]

SERVICES = [
    ("Упаковка груза", "Для защиты груза от риска повреждения, утери или нежелательного доступа упаковка должна быть правильно подобрана и профессионально выполнена. Специалисты Master Транс помогут выбрать подходящий вариант упаковки."),
    ("Хранение груза", "Master Транс предоставляет складские услуги. На терминалах созданы условия для сохранения целостности, формы и содержимого малогабаритных и сборных грузов."),
    ("Страхование", "Индивидуальное страхование оплачивается в размере 0,2 % от заявленной стоимости, подтверждённой сопроводительными документами. При отсутствии документов стоимость страхования составляет 50 рублей."),
    ("Услуги грузчиков", "Квалифицированные работники выполняют погрузку и разгрузку быстро, бережно и с учётом особенностей груза."),
]

ABOUT_PARAGRAPHS = [
    "ООО «Master Транс» — динамично развивающаяся компания в сфере транспортных грузоперевозок, специализирующаяся на перевозке сборных грузов между регионами Российской Федерации.",
    "Персонал нашей компании с пониманием отнесется к любому заказчику, считая приоритетами своей деятельности высокое качество обслуживания и порядочность. Мы предлагаем гибкие тарифные условия, отлаженный механизм работы и долгосрочное взаимовыгодное сотрудничество. Мы дорожим репутацией своей компании и всех, кто сотрудничает с нами.",
    "На сегодняшний день компания располагает 5 терминалами в 5 городах России: Москва, Грозный, Махачкала, Хасавюрт и Ростов-на-Дону. Мы регулярно открываем новые направления и расширяем зону охвата.",
]

DELIVERY_BLOCKS = [
    ("Как отправить груз транспортной компанией", "Отправить груз можно двумя способами: самостоятельно сдать его на склад Экспедитора либо заказать забор груза у отправителя."),
    ("Забор груза по адресу", "Заполните заявку на грузоперевозку. После получения заявки менеджер рассчитает стоимость, свяжется с вами и уточнит детали. Заявку также можно подать по телефону, электронной почте или письменно в одном из филиалов."),
    ("Перевозка между терминалами", "После принятия заявки водитель забирает груз, доставляет его на склад отправления, где груз взвешивают, маркируют и отправляют в город получения согласно графику. После прибытия клиент получает уведомление."),
    ("Самостоятельная сдача груза", "Груз принимается на складе по необходимому пакету документов, взвешивается, маркируется и при необходимости дополнительно упаковывается. Затем оформляется транспортная накладная и груз отправляется в город получения."),
    ("Получение и оплата", "Оплата принимается наличным или безналичным способом после получения счёта. Получить груз можно на складе Master Транс либо заказать адресную доставку до двери за дополнительную плату."),
]

TARIFF_CONDITIONS = [
    "Если вес одного тарного места превышает 300 кг, стоимость перевозки увеличивается на 10%.",
    "Если вес одного тарного места превышает 600 кг, стоимость перевозки увеличивается на 25%.",
    "Если вес одного тарного места превышает 1000 кг, стоимость перевозки увеличивается на 40%.",
    "Если длина одной из сторон груза превышает 3 метра, стоимость перевозки увеличивается на 20%.",
    "Если длина одной из сторон груза превышает 6 метров, стоимость перевозки увеличивается на 45%.",
]

PAGE_CSS = """<style id="master-trans-pages">
:root{--primary:#a739f7;--error:#2803fd;--info:#2803fd;--notification:#f2ecff}
.mt-page-section{margin:70px 0}.mt-page-section h2{margin-bottom:30px}.mt-page-lead{font-size:18px;line-height:1.65;max-width:980px}.mt-content-card{background:var(--public-card-bg);border-radius:10px;box-shadow:var(--pub-light-gray-box-shadow);padding:30px}.mt-content-grid{display:grid;gap:20px;grid-template-columns:repeat(2,minmax(0,1fr))}.mt-content-grid .public-service-links-grid-item{min-height:190px}.mt-data-table-wrap{border:1px solid var(--border-gray);border-radius:8px;overflow:auto}.mt-data-table{border-collapse:collapse;min-width:700px;width:100%}.mt-data-table th,.mt-data-table td{border-bottom:1px solid var(--border-gray);padding:14px 16px;text-align:left}.mt-data-table th{background:var(--section-gray);font-weight:600}.mt-data-table tr:last-child td{border-bottom:0}.mt-city-cards{display:grid;gap:20px;grid-template-columns:repeat(2,minmax(0,1fr))}.mt-city-card{background:var(--public-card-bg);border-radius:10px;box-shadow:var(--pub-light-gray-box-shadow);color:var(--font-dark);display:block;padding:28px;text-decoration:none}.mt-city-card h2{font-size:20px;margin:0 0 16px}.mt-city-card p{margin:6px 0}.mt-price-links{display:grid;gap:15px;grid-template-columns:repeat(2,minmax(0,1fr))}.mt-price-links a{align-items:center;border:1px solid var(--primary);border-radius:4px;color:var(--primary);display:flex;justify-content:space-between;padding:15px 18px;text-decoration:none}.mt-branch-layout{display:grid;gap:30px;grid-template-columns:minmax(0,2fr) minmax(260px,1fr)}.mt-branch-layout .contacts-terminals-card{display:block!important}.mt-socials{display:flex;flex-wrap:wrap;gap:18px}.mt-socials a{color:var(--primary)}
@media(max-width:760px){.mt-page-section{margin:45px 0}.mt-content-grid,.mt-city-cards,.mt-price-links,.mt-branch-layout{grid-template-columns:1fr}.mt-content-card{padding:20px}.mt-content-grid .public-service-links-grid-item{min-height:0}.mt-data-table th,.mt-data-table td{padding:11px 12px}}
</style>"""


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def find_div(html_text: str, class_name: str) -> tuple[int, int]:
    match = re.search(rf'<div\b[^>]*class="[^"]*\b{re.escape(class_name)}\b[^"]*"[^>]*>', html_text)
    if not match:
        raise ValueError(f"div.{class_name} not found")
    depth = 0
    for token in re.finditer(r'<div\b[^>]*>|</div\s*>', html_text[match.start():], re.I):
        depth += -1 if token.group(0).startswith("</") else 1
        if depth == 0:
            return match.start(), match.start() + token.end()
    raise ValueError(f"div.{class_name} is not closed")


def replace_div(html_text: str, class_name: str, replacement: str) -> str:
    start, end = find_div(html_text, class_name)
    return html_text[:start] + replacement + html_text[end:]


def depth_prefix(output: Path) -> str:
    return "../" * len(output.relative_to(PUBLIC).parent.parts)


def common_header(prefix: str) -> str:
    def a(path: str, label: str) -> str:
        return f'<a href="{prefix}{path}/index.html" class="">{label}</a>'
    items = [
        ("services", "Услуги"),
        ("delivery-russia", "Доставка"),
        ("tariffs", "Тарифы"),
        ("address", "Контакты"),
        ("information", "О компании"),
    ]
    desktop = "".join(
        '<div class="public-header-menu-collapse-item"><div class="public-header-menu-collapse-item-title">'
        + a(path, label) + "</div></div>" for path, label in items
    )
    return (
        '<div class="public-header-menu-collapse">'
        '<div class="public-header-menu-collapse-items flex flex-space-between">'
        f'{desktop}</div><div class="public-header-menu-collapse-ground" style="display:none;"></div></div>'
    )


def common_mobile(prefix: str) -> str:
    links = "".join(
        f'<a href="{prefix}{path}/index.html" class="public-header-menu-mobile-link">{label}</a>'
        for path, label in [
            ("services", "Услуги"), ("delivery-russia", "Доставка"),
            ("tariffs", "Тарифы"), ("address", "Контакты"),
            ("information", "О компании"),
        ]
    )
    return f'''<div class="public-header-menu-mobile" style="display:none;">
      <div class="public-container public-container-mobile">
        <div class="public-header-menu-mobile-top flex flex-end flex-align-items-center"><div class="vz-icon mdi mdi-close public-header-menu-mobile-close" style="font-size:36px;line-height:36px;"><div class="vz-icon-masked"></div></div></div>
        <div class="public-header-menu-mobile-links mt-30">{links}</div>
        <div class="public-header-menu-mobile-address"><div class="public-header-control public-header-control-dark"><span></span><a href="mailto:mastertransmsk@mail.ru" class="public-header-control-link">Рассчитать</a><a href="{prefix}delivery-russia/index.html" class="public-header-control-link">Доставка</a><a href="{prefix}address/index.html" class="public-header-control-link">Контакты</a></div></div>
      </div></div>'''


def common_footer(prefix: str) -> str:
    nav = "".join(
        f'<a href="{prefix}{path}/index.html" class="public-footer-menu-link">{label}</a>'
        for path, label in [
            ("services", "Услуги"), ("delivery-russia", "Доставка"),
            ("tariffs", "Тарифы"), ("address", "Контакты"),
            ("information", "О компании"),
        ]
    )
    return f'''<div class="public-footer-main flex flex-space-between">
      <div class="public-footer-info"><div><a href="{prefix}index.html" class="vz-logo text-decoration-none"><div class="vz-icon mdi" style="font-size:158px;line-height:158px;"><span class="mt-logo-lockup" itemprop="logo"><img src="{prefix}svg/mastertrans-source.svg" alt="Master Транс"><span class="mt-logo-copy"><b>Master Транс</b><small>Логистика</small></span></span></div></a></div><div class="public-footer-title mt-30">Грузоперевозки по России</div><div class="mt-socials mt-20"><a href="https://wa.me/79691917777">WhatsApp</a><a href="https://t.me/mastertrans_tk">Telegram</a></div></div>
      <div class="public-footer-menu flex flex-space-around"><div class="public-footer-menu-data">{nav}</div><div class="public-footer-menu-data"><a href="{prefix}address/moskva/index.html" class="public-footer-menu-link">Москва</a><a href="{prefix}address/grozny/index.html" class="public-footer-menu-link">Грозный</a><a href="{prefix}address/hasavyurt/index.html" class="public-footer-menu-link">Хасавюрт</a><a href="{prefix}address/mahachkala/index.html" class="public-footer-menu-link">Махачкала</a><a href="{prefix}address/rostov-na-donu/index.html" class="public-footer-menu-link">Ростов-на-Дону</a></div></div>
      <div class="public-footer-contacts"><a href="tel:+74953749177" class="public-footer-contacts-phone">+7 (495) 374-91-77</a><a href="{prefix}address/index.html" class="vz-button white link big public-footer-contacts-button"><span class="vz-button-title">Контакты</span></a><a href="mailto:mastertransmsk@mail.ru" class="public-footer-contacts-actions">mastertransmsk@mail.ru</a></div>
    </div>'''


def clean_shell(text: str, prefix: str, page_title: str) -> str:
    """Remove donor runtime/data and replace the remaining shared identity."""
    text=re.sub(r'<!--\s*Mirrored from.*?-->', '', text, flags=re.S|re.I)
    text=re.sub(r'<script\b[^>]*>.*?</script\s*>', '', text, flags=re.S|re.I)
    text=re.sub(r'<link rel="modulepreload"[^>]*>', '', text, flags=re.I)
    text=re.sub(r'<meta name="description"[^>]*>', f'<meta name="description" content="{esc(page_title)} — Master Транс">', text, count=1, flags=re.I)
    text=re.sub(r'<meta property="og:title"[^>]*>', f'<meta property="og:title" content="{esc(page_title)} — Master Транс">', text, count=1, flags=re.I)
    text=re.sub(r'<script type="application/ld\+json"[^>]*>.*?</script>', '', text, flags=re.S|re.I)
    text=re.sub(r'<div class="public-footer-top-description">.*?</div>', '<div class="public-footer-top-description">Автомобильные грузоперевозки с компанией Master Транс</div>', text, flags=re.S)
    for removable in ("public-footer-apps-mobile", "public-footer-additional"):
        try: text=replace_div(text, removable, "")
        except ValueError: pass
    footer_marker='<div class="public-footer-additional flex"><div><span itemprop="name">ООО «Master Транс» © 2023–2026</span><span class="display-none" itemprop="address">364024, Россия, Чеченская Республика, г. Грозный, ул. Хабаровская, д. 2</span></div><span>ИНН 2013010320 · ОГРН 1212000007812</span></div>'
    text=text.replace('<div id="teleports"></div>', footer_marker+'<div id="teleports"></div>', 1)
    text=text.replace('href="edo-logistic/index.html" class="public-header-register"', 'href="mailto:mastertransmsk@mail.ru" class="public-header-register"')
    text=text.replace('href="../edo-logistic/index.html" class="public-header-register"', 'href="mailto:mastertransmsk@mail.ru" class="public-header-register"')
    text=text.replace('href="../../edo-logistic/index.html" class="public-header-register"', 'href="mailto:mastertransmsk@mail.ru" class="public-header-register"')
    text=re.sub(r'href="(?:\.\./)*actions/index\.html"', f'href="{prefix}information/index.html"', text)
    text=re.sub(r'href="(?:\.\./)*order/manage/index\.html"', f'href="{prefix}delivery-russia/index.html"', text)
    text=re.sub(r'href="(?:\.\./)*directions/index\.html"', f'href="{prefix}address/index.html"', text)
    text=re.sub(r'href="(?:\.\./)*(?:order/create/index\.html|\./personal/auth/)"', 'href="mailto:mastertransmsk@mail.ru"', text)
    text=text.replace("Электронный документооборот", "mastertransmsk@mail.ru").replace("Отследить", "Доставка").replace("Акции", "О компании").replace("Направления", "Контакты").replace("Личный кабинет", "Заказать расчет")
    text=text.replace("Возовоз", "Master Транс").replace("возовоз", "Master Транс").replace("Vozovoz", "Master Trans").replace("VOZOVOZ", "MASTER TRANS")
    return text


def page_header(prefix: str, title: str, current: str) -> str:
    return f'''<div class="page-header"><div class="public-container public-container-mobile"><h1>{esc(title)}</h1><ul class="page-header-breadcrumbs" itemscope itemtype="http://schema.org/BreadcrumbList"><li class="color-primary"><a href="{prefix}index.html"><span>Транспортная компания</span></a></li><li><a class="text-decoration-none color-low"><span> / </span><span>{esc(current)}</span></a></li></ul></div></div>'''


def home_locations() -> str:
    links="".join(f'<a href="address/{slug}/index.html" class="vz-button primary big mr-20 mb-20"><span class="vz-button-title">{esc(city)}</span><div class="vz-icon mdi mdi-arrow-right" style="font-size:16px;line-height:16px;"><div class="vz-icon-masked bg-primary"></div></div></a>' for slug,(city,_,_) in CITIES.items())
    return f'<div class="directions-most-popular my-90 is-main-page"><h2>Наши терминалы</h2><div class="directions-most-popular-wrapper flex flex-wrap mt-25">{links}</div></div>'


def services_main(prefix: str) -> str:
    cards = "".join(f'''<div class="vz-cursor-pointer public-service-links-grid-item"><div class="vz-icon mdi mdi-arrow-top-right-thick primary" style="font-size:24px;line-height:24px;"><div class="vz-icon-masked bg-primary"></div></div><div class="public-service-links-grid-item-title"><span>{esc(title)}</span></div><div class="public-service-links-grid-item-text mt-20">{esc(text)}</div></div>''' for title, text in SERVICES)
    rows = "".join(f"<tr><td>{esc(a)}</td><td>{esc(b)}</td><td>{esc(c)}</td></tr>" for a, b, c in SERVICE_ROWS)
    return f'''<div class="services">{page_header(prefix, "Транспортные услуги", "Транспортные услуги")}<div class="public-container public-container-mobile"><div class="public-service-links-grid mt-70"><h2 class="mb-30 flex flex-align-items-center"><div class="vz-icon mdi mr-15" style="font-size:36px;line-height:36px;"><img class="vz-icon-masked svg-primary" src="{prefix}svg/box-transportation.svg" style="width:36px;height:36px;"></div>Услуги Master Транс</h2><p class="mt-page-lead">Наши специалисты предлагают услуги по перевозке и обработке грузов.</p><div class="compact text-only public-service-links-grid-items mt-30">{cards}</div></div><section class="mt-page-section"><h2>Дополнительные услуги</h2><div class="mt-data-table-wrap"><table class="mt-data-table"><thead><tr><th>Наименование</th><th>Мин. стоимость</th><th>Стоимость за м³</th></tr></thead><tbody>{rows}</tbody></table></div></section></div></div>'''


def delivery_main(prefix: str) -> str:
    steps = "".join(f'<div class="public-list-numeric-item"><span>{i}</span><div><b>{esc(title)}</b><div>{esc(text)}</div></div></div>' for i, (title, text) in enumerate(DELIVERY_BLOCKS[1:], 1))
    return f'''<div class="groupage-cargo">{page_header(prefix, "Перевозка сборных грузов", "Доставка")}<div class="public-container public-container-mobile"><div class="groupage-cargo-props flex mt-70"><div class="groupage-cargo-props-wrapper mr-20"><h2 class="mb-30">{esc(DELIVERY_BLOCKS[0][0])}</h2><p>{esc(DELIVERY_BLOCKS[0][1])}</p><ul class="public-list public-list-square"><li><span>Самостоятельная сдача груза на терминале</span></li><li><span>Забор груза по адресу отправителя</span></li></ul></div><div class="public-card-info hasRound"><div class="public-card-info-wrapper"><div class="public-card-info-title">Сборные перевозки</div><div class="public-card-info-text">между терминалами Master Транс</div></div><img src="{prefix}_ipx/f_webp/images/pages/groupage-cargo/cargo.png" class="public-card-info-img" alt=""></div></div><section class="mt-page-section"><h2>Этапы доставки сборного груза</h2><div class="public-list-numeric mt-30">{steps}</div></section><section class="mt-page-section"><h2>Как подать заявку</h2><p>По телефону, электронной почте или письменно в одном из филиалов.</p><a href="mailto:mastertransmsk@mail.ru" class="vz-button primary large mt-20"><span class="vz-button-title">Заказать перевозку</span></a></section></div></div>'''


def about_main(prefix: str) -> str:
    paragraphs = "".join(f"<p>{esc(p)}</p>" for p in ABOUT_PARAGRAPHS)
    items = "".join(f'<div class="public-list-numeric-item"><span>{i}</span><div>{esc(v)}</div></div>' for i, v in enumerate(["Перевозка различных грузов автомобильным транспортом по России", "Автоэкспедирование грузов", "Доставка грузов от двери до двери", "Страхование груза", "Складские услуги: хранение и упаковка груза"], 1))
    return f'''<div class="information">{page_header(prefix, "О компании", "О компании")}<div class="public-container public-container-mobile"><section class="mt-page-section mt-page-lead">{paragraphs}</section><section class="mt-page-section"><h2>Услуги нашей компании</h2><div class="public-list-numeric mt-30">{items}</div></section><section class="mt-page-section"><h2>Наш подход</h2><p>Максимум внимания и уважения каждому клиенту. Начните работать с нами, экономя время и деньги.</p></section></div></div>'''


def address_main(prefix: str) -> str:
    cards = "".join(f'''<div class="vz-cursor-pointer public-service-links-grid-item"><div class="vz-icon mdi mdi-arrow-top-right-thick primary" style="font-size:24px;line-height:24px;"><div class="vz-icon-masked bg-primary"></div></div><a class="public-service-links-grid-item-title" href="{slug}/index.html"><span>{esc(city)}</span></a><div class="public-service-links-grid-item-text mt-20">{esc(address)}<br>{esc(phone)}</div></div>''' for slug, (city, phone, address) in CITIES.items())
    return f'''<div class="contacts">{page_header(prefix, "Филиалы Master Транс", "Адреса филиалов")}<div class="public-container public-container-mobile"><div class="public-service-links-grid mt-70"><h2>Контакты в городах присутствия</h2><div class="compact text-only public-service-links-grid-items mt-30">{cards}</div></div><section class="mt-page-section"><h2>Реквизиты компании</h2><p>ООО «Master Транс»</p><p>Юридический адрес: 364024, Россия, Чеченская Республика, г. Грозный, ул. Хабаровская, д. 2.</p><p>ОГРН 1212000007812 · ОКПО 55216543 · ИНН 2013010320 · КПП 201301001</p><p><a href="mailto:mastertransmsk@mail.ru">mastertransmsk@mail.ru</a> · <a href="mailto:mastertrans-tk@mail.ru">Письмо руководству компании</a></p></section></div></div>'''


def branch_main(prefix: str, city: str, phone: str, address: str) -> str:
    days = "".join(f'<div class="work contacts-terminals-card-schedule-item"><div>{day}</div><div>09:00<br>18:00</div></div>' for day in ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"])
    return f'''<div class="contacts">{page_header(prefix, f"Транспортная компания Master Транс в городе {city}", city)}<div class="public-container public-container-mobile"><div class="contacts-terminals mt-70"><h2 class="vz-text-align-left">Филиал Master Транс</h2><div class="mt-branch-layout"><div class="contacts-terminals-card"><div class="contacts-terminals-card-body"><h3 class="contacts-terminals-card-title">Контакты</h3><div class="contacts-terminals-card-subtitle">Адрес</div><div>{esc(city)}, {esc(address)}</div><div class="contacts-terminals-card-subtitle flex flex-space-between">График работы</div><div class="contacts-terminals-card-schedule flex flex-space-between mt-15">{days}</div></div><div class="contacts-terminals-card-footer"><div class="contacts-terminals-card-footer-wrapper flex flex-space-between"><a href="mailto:mastertransmsk@mail.ru" class="vz-button primary outline big"><span class="vz-button-title">Отправить отсюда</span></a><a href="mailto:mastertransmsk@mail.ru" class="vz-button primary big"><span class="vz-button-title">Отправить сюда</span></a></div></div></div><div class="public-card-info hasRound"><div class="public-card-info-wrapper"><div class="public-card-info-title">Связаться с филиалом</div><div class="public-card-info-text"><a href="tel:{re.sub(r'[^+0-9]', '', phone)}">{esc(phone)}</a><br>Ежедневно с 9:00 до 18:00<br><a href="mailto:mastertransmsk@mail.ru">mastertransmsk@mail.ru</a></div></div></div></div></div></div></div>'''


def extract_source_tables() -> list[list[list[str]]]:
    from html.parser import HTMLParser
    class Parser(HTMLParser):
        def __init__(self): super().__init__(); self.tables=[]; self.table=None; self.row=None; self.cell=None
        def handle_starttag(self, tag, attrs):
            if tag == "table": self.table=[]
            elif self.table is not None and tag == "tr": self.row=[]
            elif self.row is not None and tag in ("td", "th"): self.cell=[]
            elif self.cell is not None and tag == "br": self.cell.append(" ")
        def handle_data(self, data):
            if self.cell is not None: self.cell.append(data)
        def handle_endtag(self, tag):
            if tag in ("td", "th") and self.cell is not None:
                self.row.append(" ".join("".join(self.cell).split())); self.cell=None
            elif tag == "tr" and self.row is not None:
                if any(self.row): self.table.append(self.row)
                self.row=None
            elif tag == "table" and self.table is not None:
                self.tables.append(self.table); self.table=None
    parser=Parser(); parser.feed((SOURCE / "tarify/index.html").read_text(errors="ignore")); return parser.tables


def tariffs_main(prefix: str) -> str:
    tables = extract_source_tables()[:5]
    city_slugs = list(CITIES)
    blocks=[]
    for slug, table in zip(city_slugs, tables):
        city=CITIES[slug][0]
        rows="".join("<tr>"+"".join(f"<{('th' if ri == 0 else 'td')}>{esc(cell) or '—'}</{('th' if ri == 0 else 'td')}>" for cell in row)+"</tr>" for ri,row in enumerate(table))
        blocks.append(f'<section class="mt-page-section" id="{slug}"><h2>{esc(city)}</h2><div class="mt-data-table-wrap"><table class="mt-data-table"><tbody>{rows}</tbody></table></div></section>')
    conditions="".join(f"<li><span>{esc(x)}</span></li>" for x in TARIFF_CONDITIONS)
    files=[("Москва","moscow2025.xlsx"),("Грозный","gr_202505.xlsx"),("Хасавюрт","has_202505.xlsx"),("Махачкала","mh_202505.xlsx"),("Ростов-на-Дону","rnd_202505.xlsx")]
    downloads="".join(f'<a href="{prefix}price/{file}" download><span>{esc(city)}</span><span>Скачать XLSX</span></a>' for city,file in files)
    return f'''<div class="tariffs">{page_header(prefix, "Тарифы на грузовые перевозки", "Тарифы")}<div class="public-container public-container-mobile"><section class="mt-page-section"><h2>Условия тарификации</h2><ul class="public-list public-list-square">{conditions}</ul><p>Стоимость услуги определяется из расчёта большего параметра груза: веса, объёма или габаритов.</p></section><section class="mt-page-section"><h2>Прайс-листы по терминалам</h2><div class="mt-price-links">{downloads}</div></section>{''.join(blocks)}<section class="mt-page-section"><p>К перевозке принимаются грузы при наличии сопроводительных документов. Грузы без досмотра в присутствии отправителя не принимаются.</p></section></div></div>'''


def rebrand_shell(source: Path, output: Path, main_html: str, title: str) -> None:
    text=source.read_text(errors="ignore")
    prefix=depth_prefix(output)
    text=re.sub(r"<title>.*?</title>", f"<title>{esc(title)} — Master Транс</title>", text, count=1, flags=re.S)
    text=replace_div(text, "public-main", f'<div class="public-main">{main_html}</div>')
    text=replace_div(text, "public-header-menu-collapse", common_header(prefix))
    text=replace_div(text, "public-header-menu-mobile", common_mobile(prefix))
    text=replace_div(text, "public-footer-main", common_footer(prefix))
    text=text.replace("#ec1b22", "#a739f7").replace("#c7080f", "#2803fd").replace("#ffedeb", "#f2ecff")
    text=text.replace("tel:+74997059779", "tel:+74953749177").replace("+7(499)705-97-79", "+7 (495) 374-91-77")
    text=text.replace("https://vozovoz.ru/", prefix)
    text=re.sub(r'<img class="vz-icon-masked (?:svg-primary|svg-white)" src="(?:\.\./)*svg/logo\.svg" style="width:158px;height:158px;" loading="lazy" itemprop="logo" alt>', f'<span class="mt-logo-lockup" itemprop="logo"><img src="{prefix}svg/mastertrans-source.svg" alt="Master Транс"><span class="mt-logo-copy"><b>Master Транс</b><small>Логистика</small></span></span>', text)
    text=re.sub(r'<div itemprop="description" class="vz-logo-text color-">.*?</div>', '', text, flags=re.S)
    text=clean_shell(text, prefix, title)
    text=text.replace("</head>", PAGE_CSS+"</head>", 1)
    text=text.replace("</body>", f'<script src="{prefix}site.js"></script></body>', 1)
    output.parent.mkdir(parents=True,exist_ok=True); output.write_text(text)


def write_redirect(path: Path, target: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f'<!doctype html><html lang="ru"><meta charset="utf-8"><meta http-equiv="refresh" content="0; url={target}"><link rel="canonical" href="{target}"><title>Master Транс</title><a href="{target}">Перейти</a></html>')


def build() -> None:
    if PUBLIC.exists(): shutil.rmtree(PUBLIC)
    PUBLIC.mkdir()
    for name in ["_nuxt3", "_ipx", "fonts", "images", "svg"]:
        source=ROOT/name
        if source.exists(): shutil.copytree(source,PUBLIC/name)
    for file in ["index.html","home-exact.js","favicon.ico","favicon.svg",".nojekyll"]:
        if (ROOT/file).exists(): shutil.copy2(ROOT/file,PUBLIC/file)
    shutil.copy2(ROOT/"home-exact.js",PUBLIC/"site.js")
    price=PUBLIC/"price"; price.mkdir()
    for src,name in [("2025/02/moscow2025.xlsx","moscow2025.xlsx"),("2025/05/gr_202505.xlsx","gr_202505.xlsx"),("2025/05/has_202505.xlsx","has_202505.xlsx"),("2025/05/mh_202505.xlsx","mh_202505.xlsx"),("2025/05/rnd_202505.xlsx","rnd_202505.xlsx")]: shutil.copy2(SOURCE/"wp-content/uploads"/src,price/name)
    pages=[
        (ROOT/"services/index.html",PUBLIC/"services/index.html",services_main,"Услуги"),
        (ROOT/"delivery-russia/index.html",PUBLIC/"delivery-russia/index.html",delivery_main,"Доставка"),
        (ROOT/"information/index.html",PUBLIC/"information/index.html",about_main,"О компании"),
        (ROOT/"address/index.html",PUBLIC/"address/index.html",address_main,"Контакты"),
        (ROOT/"tariffs/index.html",PUBLIC/"tariffs/index.html",tariffs_main,"Тарифы"),
    ]
    for source,output,builder,title in pages: rebrand_shell(source,output,builder(depth_prefix(output)),title)
    for slug,(city,phone,address) in CITIES.items():
        output=PUBLIC/"address"/slug/"index.html"
        rebrand_shell(ROOT/"address/moskva/index.html",output,branch_main(depth_prefix(output),city,phone,address),f"Контакты — {city}")
    write_redirect(PUBLIC/"vse-uslugi/index.html","../services/index.html")
    write_redirect(PUBLIC/"dostavka/index.html","../delivery-russia/index.html")
    write_redirect(PUBLIC/"tarify/index.html","../tariffs/index.html")
    write_redirect(PUBLIC/"kontakty/index.html","../address/index.html")
    write_redirect(PUBLIC/"o-kompanii/index.html","../information/index.html")
    # Root links must point only to the confirmed Master Trans page set.
    index=(PUBLIC/"index.html").read_text()
    index=replace_div(index,"public-header-menu-collapse",common_header(""))
    index=replace_div(index,"public-header-menu-mobile",common_mobile(""))
    index=replace_div(index,"public-footer-main",common_footer(""))
    try: index=replace_div(index,"directions-most-popular","")
    except ValueError: pass
    try: index=replace_div(index,"vz-home-popular",home_locations())
    except ValueError: pass
    index=index.replace('&quot;Master Транс&quot; — надежный партнер по перевозкам в России, Беларуси и Казахстане','«Master Транс» — надежный партнер по перевозкам в России')
    index=index.replace('Более 16 лет опыта','Перевозки по России').replace('Работая в сфере грузовых перевозок уже более 16 лет, мы накопили уникальный опыт, позволяющий решать сложные и нестандартные транспортные задачи.','Специализируемся на перевозке сборных грузов между регионами Российской Федерации.')
    index=index.replace('Перевозка за 1–5 дней','Гибкие тарифные условия').replace('Перевозим грузы по РФ за 1–5 дней.','Предлагаем гибкие тарифные условия и отлаженный механизм работы.')
    index=index.replace('Подача транспорта','Долгосрочное сотрудничество').replace('Подача транспорта в день обращения.','Строим долгосрочное взаимовыгодное сотрудничество.')
    index=re.sub(r'https://storage\.vozovoz\.ru/src-main/news/b57327be906aea365243d3b23b896b64', 'images/pages/home/terminal-card.webp', index)
    root_routes={
        "false/index.html":"information/index.html", "merch-for-bonuses/index.html":"information/index.html",
        "guide-lk/index.html":"information/index.html", "address-delivery/index.html":"delivery-russia/index.html",
        "shippingtypes/personalitemstransportation/index.html":"delivery-russia/index.html",
        "shippingtypes/furniture/index.html":"delivery-russia/index.html", "shippingtypes/smallcargo/index.html":"delivery-russia/index.html",
        "shippingtypes/oversized/index.html":"delivery-russia/index.html", "marketplaces/index.html":"services/index.html",
        "terminals/index.html":"address/index.html", "online-store/index.html":"services/index.html",
        "cash-on-delivery/index.html":"information/index.html", "safe-custody/index.html":"services/index.html",
        "franchise/index.html":"information/index.html", "run-schedule/index.html":"delivery-russia/index.html",
        "wrapping/index.html":"services/index.html", "cargo-loading/index.html":"services/index.html",
        "insurance/index.html":"services/index.html", "yandex-market/index.html":"services/index.html",
    }
    for old,new in root_routes.items(): index=index.replace(f'href="{old}"',f'href="{new}"').replace(f'href="./{old}"',f'href="{new}"')
    index=re.sub(r'href="news/[^"]+"', 'href="address/index.html"', index)
    index=index.replace('href="https://vozovoz.partners/"','href="information/index.html"')
    index=index.replace("home-exact.js","site.js")
    index=index.replace("</head>",PAGE_CSS+"</head>",1)
    index=clean_shell(index,"","Master Транс — Логистика")
    index=index.replace("</body>",'<script src="site.js"></script></body>',1)
    (PUBLIC/"index.html").write_text(index)


if __name__ == "__main__": build()
