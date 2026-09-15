import Link from "next/link";
import {
  Box,
  Handshake,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MiniCalc } from "@/components/site/mini-calc";
import { TrackWidget } from "@/components/site/track-widget";
import { LeadForm } from "@/components/site/lead-form";
import { advantages, geography, site, terminals, workStages } from "@/data/site";
import { services } from "@/data/services";
import { faq } from "@/data/faq";

const serviceIcons = [Truck, Box, Package, Warehouse, ShieldCheck, Wrench];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1348px] px-4">
      {/* Hero */}
      <section className="pt-12 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Транспортные грузоперевозки по России
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-balance lg:text-5xl">
            Доставим в срок ваш груз{" "}
            <span className="brand-gradient-text">гарантированно</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Сборные грузы любого размера и веса — ещё никогда не были проще.
            Избавим вас от головной боли: качественно и в срок.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <MiniCalc />
          <TrackWidget />
        </div>
      </section>

      {/* Преимущества */}
      <section className="mt-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <Card key={a.title} className="border-0 bg-muted">
              <CardContent className="pt-6">
                <p className="text-lg font-bold">{a.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Услуги */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold lg:text-4xl">Наши услуги</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <Link
                key={s.slug}
                href={`/uslugi#${s.slug}`}
                className="group rounded-lg bg-muted p-6 transition-colors hover:bg-accent"
              >
                <span className="brand-gradient flex size-11 items-center justify-center rounded-lg text-white">
                  <Icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 text-lg font-bold group-hover:text-primary">
                  {s.title}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.short}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Этапы работы */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold lg:text-4xl">Как мы работаем</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {workStages.map((s, i) => (
            <div key={s.title} className="rounded-lg border border-border p-6">
              <p className="brand-gradient-text text-5xl font-bold">{i + 1}</p>
              <p className="mt-3 font-bold">{s.title}</p>
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* География */}
      <section className="mt-24 rounded-lg bg-muted p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              <span className="brand-gradient-text">5 терминалов</span> в 5
              городах России
            </h2>
            <p className="mt-3 text-muted-foreground">
              Мы регулярно открываем новые направления и расширяем зону охвата.
              Адресная доставка — ещё в {geography.addressDelivery.length}{" "}
              городах, генеральные перевозки — по всей России.
            </p>
            <Button asChild className="brand-gradient mt-6 border-0">
              <Link href="/kontakty">Адреса и телефоны терминалов</Link>
            </Button>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {terminals
              .filter((t) => !t.note)
              .map((t) => (
                <li key={t.slug} className="flex items-start gap-2.5 rounded-lg bg-background p-4">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="font-bold">{t.city}</span>
                    <br />
                    <span className="text-sm text-muted-foreground">{t.address}</span>
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold lg:text-4xl">Вопросы и ответы</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faq.map((item) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left text-base font-bold">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-3xl text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="mt-24 rounded-lg bg-muted p-8 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Доверьте нам свою логистику</h2>
            <p className="mt-3 text-muted-foreground">
              Максимум внимания и уважения каждому клиенту. Начните работать с
              нами, экономя время и деньги!
            </p>
            <p className="mt-6 flex items-center gap-2 font-bold">
              <Handshake className="size-5 text-primary" aria-hidden />
              <a href={site.phoneMainHref}>{site.phoneMain}</a>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{site.schedule}</p>
          </div>
          <LeadForm withRoute />
        </div>
      </section>
    </div>
  );
}
