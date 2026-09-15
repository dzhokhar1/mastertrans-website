import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { LeadForm } from "@/components/site/lead-form";
import { site, terminals } from "@/data/site";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Адреса и телефоны терминалов Master Транс: Москва, Грозный, Хасавюрт, Махачкала, Ростов-на-Дону.",
};

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-[1348px] px-4 pt-12">
      <h1 className="text-4xl font-bold">Контакты</h1>

      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <a href={site.phoneMainHref} className="flex items-center gap-2 font-bold">
          <Phone className="size-4 text-primary" aria-hidden />
          {site.phoneMain}
        </a>
        <a href={`mailto:${site.email}`} className="flex items-center gap-2">
          <Mail className="size-4 text-primary" aria-hidden />
          {site.email}
        </a>
        <span className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4 text-primary" aria-hidden />
          {site.schedule}
        </span>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {terminals.map((t) => (
          <div key={t.slug} className="rounded-lg bg-muted p-6">
            <p className="text-lg font-bold">{t.city}</p>
            {t.note && (
              <p className="text-xs uppercase tracking-wide text-primary">
                {t.note}
              </p>
            )}
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {t.address}
            </p>
            <a
              href={t.phoneHref}
              className="mt-2 flex items-center gap-2 text-sm font-medium"
            >
              <Phone className="size-4 shrink-0 text-primary" aria-hidden />
              {t.phone}
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <a
          href={site.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-muted px-4 py-2 font-medium hover:bg-accent"
        >
          Написать в WhatsApp
        </a>
        <a
          href={site.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-muted px-4 py-2 font-medium hover:bg-accent"
        >
          Написать в Telegram
        </a>
        <a
          href={`mailto:${site.emailDirector}`}
          className="rounded-lg bg-muted px-4 py-2 font-medium hover:bg-accent"
        >
          Письмо руководству
        </a>
      </div>

      <section className="mt-16 max-w-3xl rounded-lg bg-muted p-6 lg:p-8">
        <h2 className="text-2xl font-bold">Задать вопрос</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          Оставьте контакты — перезвоним в рабочее время.
        </p>
        <LeadForm />
      </section>
    </div>
  );
}
