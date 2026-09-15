import Link from "next/link";
import { site, terminals } from "@/data/site";
import { services } from "@/data/services";

const infoLinks = [
  { href: "/otslezhivanie", label: "Отслеживание груза" },
  { href: "/kalkulyator", label: "Калькулятор" },
  { href: "/tarify", label: "Тарифы и сроки перевозок" },
  { href: "/tarify#dop-uslugi", label: "Тарифы на дополнительные услуги" },
  { href: "/politika", label: "Политика обработки данных" },
];

const companyLinks = [
  { href: "/o-kompanii", label: "О компании" },
  { href: "/kontakty", label: "Контакты" },
  { href: "/o-kompanii#rekvizity", label: "Реквизиты" },
];

export function Footer() {
  return (
    <footer className="brand-gradient mt-24 text-white">
      <div className="mx-auto max-w-[1348px] px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-bold">{site.name}</p>
            <p className="mt-1 text-sm text-white/70">{site.tagline}</p>
            <a href={site.phoneMainHref} className="mt-6 block text-2xl font-bold">
              {site.phoneMain}
            </a>
            <p className="mt-1 text-sm text-white/70">{site.schedule}</p>
            <a href={`mailto:${site.email}`} className="mt-3 block text-sm underline-offset-4 hover:underline">
              {site.email}
            </a>
            <a
              href={`mailto:${site.emailDirector}`}
              className="mt-1 block text-sm text-white/70 underline-offset-4 hover:underline"
            >
              Письмо руководству компании
            </a>
          </div>

          <div>
            <p className="mb-4 font-bold">Услуги</p>
            <ul className="space-y-2 text-sm text-white/85">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/uslugi#${s.slug}`} className="hover:underline">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-bold">Компания</p>
            <ul className="space-y-2 text-sm text-white/85">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-4 mt-8 font-bold">Полезная информация</p>
            <ul className="space-y-2 text-sm text-white/85">
              {infoLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-bold">Терминалы</p>
            <ul className="space-y-3 text-sm text-white/85">
              {terminals
                .filter((t) => !t.note)
                .map((t) => (
                  <li key={t.slug}>
                    <span className="font-medium text-white">{t.city}</span>
                    <br />
                    {t.address} · <a href={t.phoneHref}>{t.phone}</a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/20 pt-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.requisites.legalName} · ИНН{" "}
            {site.requisites.inn} · ОГРН {site.requisites.ogrn}
          </p>
          <div className="flex gap-4">
            <a href={site.whatsapp} rel="noopener noreferrer" target="_blank" className="hover:underline">
              WhatsApp
            </a>
            <a href={site.telegram} rel="noopener noreferrer" target="_blank" className="hover:underline">
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
