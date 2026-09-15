import type { Metadata } from "next";
import { LeadForm } from "@/components/site/lead-form";
import { restrictedCargo, services } from "@/data/services";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Перевозка сборных грузов, автоэкспедирование, упаковка, хранение, страхование груза и погрузочно-разгрузочные работы.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1348px] px-4 pt-12">
      <h1 className="text-4xl font-bold">Услуги</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Перевозка различных грузов автомобильным транспортом по России,
        автоэкспедирование, доставка «от двери до двери», страхование и
        складские услуги.
      </p>

      <div className="mt-10 space-y-10">
        {services.map((s) => (
          <section
            key={s.slug}
            id={s.slug}
            className="grid scroll-mt-28 gap-4 rounded-lg bg-muted p-6 lg:grid-cols-[280px_1fr] lg:p-8"
          >
            <h2 className="text-2xl font-bold">{s.title}</h2>
            <p className="text-muted-foreground">{s.description}</p>
          </section>
        ))}
      </div>

      <section className="mt-16 max-w-2xl">
        <h2 className="text-2xl font-bold">Грузы, запрещённые к перевозке</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-muted-foreground">
          {restrictedCargo.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-lg bg-muted p-6 lg:p-8">
        <h2 className="text-2xl font-bold">Заказать услугу</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          Оставьте контакты — менеджер подберёт решение под вашу задачу.
        </p>
        <LeadForm withRoute />
      </section>
    </div>
  );
}
