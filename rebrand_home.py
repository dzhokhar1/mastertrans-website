from pathlib import Path
import re

page = Path(__file__).with_name("index.html")
html = page.read_text(encoding="utf-8")

# Keep the server-rendered DOM and original CSS, but remove hydration scripts:
# the downloaded Nuxt bundle references chunks that are not part of the mirror.
html = re.sub(r'<link rel="modulepreload"[^>]*>', '', html)
html = re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.S | re.I)

# GitHub Pages hosts this repository under /mastertrans-website/. Root-relative
# CSS asset URLs would otherwise resolve against dzhokhar1.github.io itself.
# Keep assets relative so the same output works both locally and on Pages.
html = re.sub(r'url\((?P<quote>["\']?)/', r'url(\g<quote>', html)
html = html.replace('/_ipx/', '_ipx/')
html = html.replace('href="favicon.ico"', 'href="favicon.ico?v=mastertrans"')
html = html.replace('href="favicon.svg"', 'href="favicon.svg?v=mastertrans"')

calculator_head = '''<div class="vz-calculator-main-grid"><div class="fs-16 text-medium vz-calculator-main-title">Рассчитать цену / Заказать перевозку</div><div></div><div class="vz-switcher vz-switcher-rounded"><div class="vz-switcher-wrapper"><div class="vz-tooltip vz-tooltip-flex"><div class="vz-switcher-item active"><span>Рассчитать</span></div></div><div class="vz-tooltip vz-tooltip-flex"><div class="vz-switcher-item"><span>Отследить</span></div></div></div></div></div>'''
html = re.sub(r'<div class="vz-calculator-main-grid"><div class="fs-16 text-medium vz-calculator-main-title">Рассчитать цену / Заказать перевозку</div><div></div><span></span></div>', calculator_head, html, count=1)

static_calculator = '''<form class="cb-form vz-calculator-next mt-10">
  <div class="vz-calculator-main-grid">
    <div class="vz-calculator-main-block">
      <div class="vz-input mb-10"><label class="vz-input-label public-style">Откуда</label><div class="vz-input-wrapper"><input class="vz-input-control large" type="text" value="Москва"></div></div>
      <div class="vz-radiogroup inline mt-exact-radio"><label class="vz-radiogroup-item"><input type="radio" name="from"> <span>От адреса</span></label><label class="vz-radiogroup-item active"><input type="radio" name="from" checked> <span>От терминала</span></label></div>
    </div>
    <div class="vz-icon mdi mdi-swap-horizontal primary vz-calculator-main-swap" style="font-size:24px;line-height:24px"></div>
    <div class="vz-calculator-main-block">
      <div class="vz-input mb-10"><label class="vz-input-label public-style">Куда</label><div class="vz-input-wrapper"><input class="vz-input-control large" type="text" value="Грозный"></div></div>
      <div class="vz-radiogroup inline flex-wrap direction-radiogroup-3 mt-exact-radio"><label class="vz-radiogroup-item"><input type="radio" name="to"> <span>До адреса</span></label><label class="vz-radiogroup-item active"><input type="radio" name="to" checked> <span>До терминала</span></label></div>
    </div>
  </div>
  <div class="vz-calculator-main-grid mt-5">
    <div class="flex flex-column">
      <div class="vz-calculator-main-block vz-calculator-main-measure">
        <div class="vz-input"><label class="vz-input-label public-style">Объем</label><div class="vz-input-wrapper"><input class="vz-input-control large" type="text" placeholder="0.01 м³"></div></div>
        <div class="vz-input"><label class="vz-input-label public-style">Вес</label><div class="vz-input-wrapper"><input class="vz-input-control large" type="text" placeholder="0.9 кг"></div></div>
      </div>
      <div class="vz-calculator-main-delivery"><div class="vz-calculator-main-delivery-time"><div class="vz-icon mdi mdi-clock-outline" style="font-size:24px;line-height:24px"></div><span>Срок доставки <a class="color-primary" href="kontakty/index.html">уточнит специалист</a></span></div></div>
    </div>
    <div></div>
    <div class="vz-calculator-main-price">
      <div class="vz-calculator-main-price-block"><div class="flex flex-space-between flex-align-items-center"><span class="fs-14">Цена по тарифу</span><span class="fw-500">—</span></div><div class="flex flex-space-between flex-align-items-center"><span class="fs-14">Дополнительные услуги</span><span class="fw-500">—</span></div></div>
      <div class="vz-calculator-main-price-total"><div class="flex flex-space-between flex-align-items-center"><span class="fs-18">Итого</span><span>—</span></div></div>
      <a href="mailto:mastertransmsk@mail.ru" class="vz-button primary large vz-calculator-main-button"><span class="vz-button-title">Рассчитать / Заказать</span></a>
    </div>
  </div>
</form>'''
html = re.sub(r'<form class="cb-form vz-calculator-next mt-10">.*?</form>', static_calculator, html, count=1, flags=re.S)

replacements = {
    "Транспортная компания Возовоз | Грузоперевозки в РФ из Москвы, СПб": "Транспортная компания Master Транс | Грузоперевозки по России",
    "Грузоперевозки по всей России транспортной компанией Возовоз: быстро, надежно, недорого. Рассчитайте стоимость доставки груза на сайте.": "Master Транс — перевозка сборных грузов между регионами Российской Федерации.",
    "Транспортная компания VOZOVOZ": "Транспортная компания MASTER ТРАНС",
    "Перевозки сборных грузов": "Транспортные грузоперевозки",
    "Личный кабинет": "Заказать расчет",
    "Отследить": "Доставка",
    "Электронный документооборот": "mastertransmsk@mail.ru",
    "Подробные условия для сотрудничества и работы с компанией Vozovoz": "Работая в сфере грузовых перевозок уже более 16 лет, мы накопили уникальный опыт.",
    "Получите полную информацию о преимуществах сотрудничества с Vozovoz": "Грузоперевозки любого размера и веса ещё никогда не были проще",
    '"Возовоз" — надежный партнер по перевозкам в России, Беларуси и Казахстане': "ООО «Master Транс» — перевозка сборных грузов между регионами России",
    "Мы специализируемся на доставке сборных грузов, что позволяет клиентам экономить на транспортных услугах с небольшими отправлениями. Сборные перевозки – это способ объединения нескольких грузов от разных отправителей в одну машину, что значительно снижает стоимость транспортировки по сравнению с выделенным транспортом.": "ООО «Master Транс» — динамично развивающаяся компания в сфере транспортных-грузоперевозок, специализирующаяся на перевозке сборных грузов между регионами Российской Федерации.",
    "Рассчитайте точную стоимость и сроки доставки легко и быстро": "Доставим в срок ваш груз гарантированно",
    "Чтобы отправить груз, укажите параметры длины, ширины, высоты и вес. Оформите заказ на перевозку за пару кликов.": "Мы определяем стоимость услуг до заключения договора.",
    "Опыт и экспертиза": "Более 16 лет опыта",
    "Мы работаем в сфере коммерческой логистики с 2014 года, входя в федеральный топ перевозчиков. Нам доверяют тысячи постоянных заказчиков — от частных отправителей до поставщиков товаров и крупнейших ритейлеров.": "Работая в сфере грузовых перевозок уже более 16 лет, мы накопили уникальный опыт, позволяющий решать сложные и нестандартные транспортные задачи.",
    "Гарантии и надежность": "Бережное отношение",
    "Заключаем договор на автоперевозки с прозрачными условиями безопасности груза. Страхование имущества отправителей обеспечено страховой компанией ВСК и другими партнерами. Все условия транспортировки фиксируются в договоре и осуществляются в правовом поле с соблюдением всех норм логистического регламента.": "Гарантируем бережное отношение к вашему грузу.",
    "Подтвержденный рейтинг и отзывы": "Стоимость заранее",
    "Вы можете найти тысячи реальных откликов о нашей работе на Яндекс Картах и 2GIS. Мы всегда на связи и оперативно решаем возникающие вопросы.": "Мы определяем стоимость услуг до заключения договора.",
    "Широкая география": "Пять терминалов",
    "85 терминалов в 79 городах: Популярные и сложные маршруты. Регулярные междугородние рейсы по России: от Московской области до Дальнего Востока, а также международные маршруты в Беларусь и Казахстан. Легко найти ближайший терминал для сдачи или получения груза.": "На сегодняшний день компания располагает 5 терминалами в 5 городах России: Москва, Грозный, Махачкала, Хасавюрт и Ростов-на-Дону.",
    "Быстрая доставка": "Перевозка за 1–5 дней",
    'Осуществляем доставку в удобный для Получателя промежуток времени. Мы выстроили логистику так, чтобы 96% рейсов прибывало без задержек. Выбирайте окно прибытия "от .. до .." часов, и водитель привезет заказ строго в этот интервал.': "Перевозим грузы по РФ за 1–5 дней.",
    "Отслеживание местонахождения груза": "Подача транспорта",
    "Отслеживайте местоположение груза с момента отправления и на всех этапах транспортировки. Наша служба поддержки круглосуточно на связи и готова оперативно решить любые вопросы.": "Подача транспорта в день обращения.",
    "Чтобы узнать, сколько будет стоить транспортировка вашего груза, воспользуйтесь таблицей базовых ставок. Цены зависят от удаленности региона, параметров груза и наличия в заказе дополнительных услуг.": "Стоимость перевозки зависит от направления, веса, объема и дополнительных услуг.",
    "Отправления любых размеров": "Упаковка груза",
    "От посылок до крупногабаритных грузов. Обеспечим безопасную перевозку станков, оборудования, строительных материалов и других негабаритных отправлений. Для тяжеловесных конструкций подберем нужный транспорт и спецтехнику - манипуляторы, тенты и еврофуры до 20 тонн.": "Мы поможем надежно упаковать ваш груз. Качественно и оперативно.",
    "Надежная упаковка": "Складское хранение",
    "Предлагаем все виды упаковки: жесткая обрешетка, паллетирование, стрейч-пленка и картонные короба. Защитим груз от повреждений в пути. Гарантируем, что ваш товар будет доставлен в безупречном виде.": "Организуем как временное, так и постоянное хранение вашего груза.",
    "Погрузочные работы": "Услуги грузчиков",
    "Предоставляем профессиональные услуги грузчиков на месте забора или выгрузки. Заберём отправление прямо из вашего офиса, склада или квартиры. Сложные такелажные работы выполняются с помощью специальных механизмов.": "По вашему желанию ваш груз может быть доставлен по адресу, занесён в помещение, освобождён от упаковки и установлен в требуемое место.",
    "Современная складская логистика позволяет хранить товары в полной безопасности. Хранение на терминале прибытия для получателя бесплатно от 3 до 14 дней.": "Организуем как временное, так и постоянное хранение вашего груза.",
    "Страхование имущества от наших надежных партнеров. Обеспечиваем вашу финансовую защиту на всех этапах транспортировки.": "Решим все вопросы с оценкой, оформлением документов, выбором страховой.",
    "Выдача грузов в ПВЗ Яндекс": "Доставка по адресу",
    "Забирайте отправления не только на терминалах Возовоз, но и в ближайшем пункте выдачи Яндекс. Быстро, рядом с домом и без очередей.": "Ваш груз может быть доставлен по адресу и занесён в помещение.",
    "Новости": "Наши терминалы",
    "Переход на электронные перевозочные документы с 1 сентября 2026 года": "Москва — ул. 1-й Вязовский проезд, д. 4, стр. 5",
    "Белгород. Временная приостановка работы склада.": "Грозный — ул. Хабаровская, 2А",
    "Благовещенск, Иркутск. Везём быстрее!": "Махачкала — ул. Камаева, 88",
    "Vozovoz – лидер цен на рынке перевозок": "Хасавюрт — трасса Кавказ, 11-я линия",
    "Изменение тарифов": "Ростов-на-Дону — проспект 40-летия Победы, 336/1",
    "Все новости": "Все контакты",
    "Автомобильные грузоперевозки с компанией Возовоз - одной из ведущих транспортных компаний в России": "ООО «Master Транс» — транспортные грузоперевозки по России",
    "+7 499 705 97 79": "+7 (495) 374-91-77",
    'OOO "Возовоз" © 2014 - 2026': 'ООО «Master Транс» © 2023 - 2026',
    "Санкт-Петербург, 6-й Верхний переулок дом 12 литер А, кабинет №210": "364024, Чеченская Республика, г. Грозный, ул. Хабаровская, д. 2",
    '"Master Транс" — надежный партнер по перевозкам в России, Беларуси и Казахстане': "ООО «Master Транс» — перевозка сборных грузов между регионами России",
    "Доставка в маркетплейсы и торговые сети": "Упаковка груза",
    "Бесплатный простой автомобиля, удобный график отправки и тарифы по запросам клиента": "Мы поможем надежно упаковать ваш груз. Качественно и оперативно.",
    "Междугородние перевозки в более 1300000 городов и населенных пунктов в РФ.": "Организуем как временное, так и постоянное хранение вашего груза.",
    "Крупногабаритные грузы": "Страхование груза",
    "Перевозим отправления, параметры которых больше стандартных: промышленное оборудование, технику, станки и другие.": "Решим все вопросы с оценкой, оформлением документов, выбором страховой.",
    "Сборные перевозки": "Услуги грузчиков",
    "Простой способ снижения стоимости доставки. Вы платите только за место своего груза.": "По вашему желанию доставим груз по адресу, занесём в помещение и установим в требуемое место.",
    "Ответственное хранение": "Складское хранение",
    "Москва - Санкт-Петербург": "Москва - Грозный",
    "Нижний Новгород - Москва": "Грозный - Москва",
    "Москва - Краснодар": "Москва - Махачкала",
    "Казань - Самара": "Махачкала - Москва",
    "Ростов-на-Дону - Краснодар": "Москва - Ростов-на-Дону",
    "Москва - Волгоград": "Ростов-на-Дону - Москва",
    "Набережные Челны - Казань": "Москва - Хасавюрт",
    "Якутск - Новосибирск": "Хасавюрт - Москва",
    "4 августа 2026 г.": "+7 (495) 374-91-77",
    "2 августа 2026 г.": "+7 (871) 277-05-95",
    "15 июля 2026 г.": "+7 (872) 298-94-40",
    "9 июля 2026 г.": "+7 (872) 315-57-05",
    "3 июля 2026 г.": "+7 (863) 322-20-86",
}

for old, new in replacements.items():
    html = html.replace(old, new)

# HTTrack inserts line breaks in long server-rendered text nodes. Match those
# whitespace differences without touching tags, classes or layout markup.
for old, new in replacements.items():
    flexible = r"\s+".join(re.escape(part) for part in old.split())
    html = re.sub(flexible, new, html)

html = re.sub(r'(<p class="home-info-card-title[^>]*>)Грузоперевозки по России(</p>)', r'\1Складское хранение\2', html)

html = html.replace("VOZOVOZ", "MASTER ТРАНС")
html = html.replace("Vozovoz", "Master Транс")
html = html.replace("Возовоз", "Master Транс")
html = html.replace("возовоз", "Master Транс")
html = html.replace("https://vozovoz.ru/", "./")

# The old logo caption is not part of the Master Trans lockup.
html = re.sub(r'<div itemprop="description" class="vz-logo-text color-">\s*Транспортные грузоперевозки\s*</div>', '', html)

# Master Trans identity: preserve the source layout while applying the actual
# blue-purple palette and the original logo artwork from mastertrans.tk.
html = html.replace("#ec1b22", "#a739f7")
html = html.replace("#c7080f", "#2803fd")
html = html.replace("#ffedeb", "#f2ecff")
logo_lockup = '''<span class="mt-logo-lockup" itemprop="logo"><img src="svg/mastertrans-source.svg" alt="Master Транс"><span class="mt-logo-copy"><b>Master Транс</b><small>Логистика</small></span></span>'''
html = re.sub(r'<img class="vz-icon-masked (?:svg-primary|svg-white)" src="svg/logo\.svg" style="width:158px;height:158px;" loading="lazy" itemprop="logo" alt>', logo_lockup, html)

# Contact links and legal identifiers belong to Master Trans.
html = html.replace("tel:+74997059779", "tel:+74953749177")
html = html.replace("+7(499)705-97-79", "+7 (495) 374-91-77")
html = html.replace('href="edo-logistic/index.html" class="public-header-register"', 'href="mailto:mastertransmsk@mail.ru" class="public-header-register"')

# A tiny static supplement changes only the text printed inside the campaign
# illustration; all original geometry and assets remain intact.
brand_css = '''<style id="master-trans-brand-fix">
:root{--primary:#a739f7;--error:#2803fd;--info:#2803fd;--violet:#a739f7;--notification:#f2ecff;--primary-filter:brightness(0) saturate(100%) invert(34%) sepia(99%) saturate(4509%) hue-rotate(260deg) brightness(99%) contrast(96%);--primary-wh-filter:brightness(0) saturate(100%) invert(34%) sepia(99%) saturate(4509%) hue-rotate(260deg) brightness(99%) contrast(96%)}
.public-header-register{max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vz-logo>.vz-icon{width:225px!important;height:58px!important;display:flex!important;align-items:center;font-size:0!important;line-height:1!important}.vz-logo .mt-logo-lockup{width:225px;height:58px;display:flex;align-items:center;gap:10px}.vz-logo .mt-logo-lockup>img{width:68px!important;height:50px!important;object-fit:contain;filter:none!important}.mt-logo-copy{display:flex;flex-direction:column;line-height:1;white-space:nowrap}.mt-logo-copy b{color:#0f0e12;font-size:20px;font-weight:700}.mt-logo-copy small{margin-top:7px;color:#777;font-size:9px;letter-spacing:2px;text-transform:uppercase}.public-footer .mt-logo-copy b{color:#fff}.public-footer .mt-logo-copy small{color:#bbb}
.public-header .vz-logo>.vz-icon,.public-header .vz-logo .mt-logo-lockup{width:190px!important;height:48px!important}.public-header .vz-logo .mt-logo-lockup{gap:9px}.public-header .vz-logo .mt-logo-lockup>img{width:58px!important;height:42px!important}.public-header .mt-logo-copy b{font-size:19px}.public-header .mt-logo-copy small{font-size:8px;letter-spacing:1.8px;margin-top:6px}
.dark .public-header .mt-logo-copy b{color:var(--pure-white)}.dark .public-header .mt-logo-copy small{color:var(--font-light)}
.vz-color-mode-icon{transition:transform .25s ease,color .25s ease}.vz-color-mode-icon:active{transform:rotate(25deg)}
.mt-city-modal{background:var(--white);color:var(--font-dark);display:none;inset:0;overflow-y:auto;position:fixed;z-index:5000}.mt-city-modal.is-open{display:block}.mt-city-modal-inner{margin:0 auto;max-width:1240px;padding:46px 30px 70px;position:relative}.mt-city-modal-title{font-size:18px;font-weight:600;line-height:24px;margin:0 0 30px}.mt-city-modal-close{align-items:center;background:transparent;border:0;color:var(--font-dark);cursor:pointer;display:flex;font-size:34px;font-weight:300;height:40px;justify-content:center;line-height:1;padding:0;position:absolute;right:24px;top:36px;width:40px}.mt-city-current{align-items:center;background:var(--section-gray);display:flex;font-size:18px;height:52px;justify-content:space-between;margin-bottom:32px;padding:0 20px;width:100%}.mt-city-current:after{content:"⌄";font-size:20px}.mt-city-country{align-items:center;display:flex;font-size:18px;font-weight:600;gap:9px;margin-bottom:20px}.mt-city-country-flag{font-size:20px}.mt-city-list{display:grid;gap:18px 34px;grid-template-columns:repeat(5,minmax(130px,1fr));max-width:1000px}.mt-city-option{background:transparent;border:0;color:var(--font-dark);cursor:pointer;font:inherit;font-size:15px;padding:0;text-align:left;text-decoration:underline;text-underline-offset:2px}.mt-city-option:hover,.mt-city-option.is-active{color:var(--primary)}body.mt-city-modal-open{overflow:hidden}
.mt-exact-radio{gap:18px;margin-bottom:26px}.mt-exact-radio label{display:flex;align-items:center;gap:5px;white-space:nowrap;font-size:13px}.mt-exact-radio input{accent-color:var(--primary)}
.public-header-menu-collapse-item-content{z-index:20}.public-header-menu-collapse-ground{z-index:19}
@media(max-width:760px){.public-header .vz-logo>.vz-icon,.public-header .vz-logo .mt-logo-lockup{width:170px!important;height:44px!important}.public-header .vz-logo .mt-logo-lockup{gap:8px}.public-header .vz-logo .mt-logo-lockup>img{width:50px!important;height:38px!important}.public-header .mt-logo-copy b{font-size:16px}.public-header .mt-logo-copy small{font-size:7.5px;letter-spacing:1.5px;margin-top:5px}.mt-exact-radio{gap:10px;margin-bottom:15px}.vz-calculator-main-price{margin-top:12px}.mt-city-modal-inner{padding:28px 20px 50px}.mt-city-modal-close{right:12px;top:18px}.mt-city-modal-title{margin-bottom:24px;padding-right:44px}.mt-city-list{grid-template-columns:repeat(2,minmax(120px,1fr));gap:18px 20px}}
</style>'''
html = html.replace("</head>", brand_css + "</head>", 1)
html = html.replace("</body>", '<script src="home-exact.js"></script></body>', 1)

page.write_text(html, encoding="utf-8")
