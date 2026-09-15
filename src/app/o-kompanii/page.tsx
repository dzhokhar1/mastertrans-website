import type { Metadata } from "next";
import { LeadForm } from "@/components/site/lead-form";
import { geography, site } from "@/data/site";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "ООО «Master Транс» — транспортная компания, специализирующаяся на перевозке сборных грузов между регионами России.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1348px] px-4 pt-12">
      <h1 className="text-4xl font-bold">О компании</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="max-w-3xl space-y-4 text-lg">
          <p>
            {site.requisites.legalName} — динамично развивающаяся компания в
            сфере транспортных грузоперевозок, специализирующаяся на перевозке
            сборных грузов между регионами Российской Федерации.
          </p>
          <p>
            Персонал нашей компании с пониманием отнесётся к любому заказчику,
            считая приоритетами своей деятельности высокое качество
            обслуживания и порядочность.
          </p>
          <p>
            Мы предлагаем гибкие тарифные условия, отлаженный механизм работы и
            долгосрочное взаимовыгодное сотрудничество. Мы дорожим репутацией
            своей компании и всех, кто сотрудничает с нами.
          </p>
          <p>
            На сегодняшний день компания располагает{" "}
            <span className="brand-gradient-text font-bold">
              5 терминалами в 5 городах России
            </span>{" "}
            ({geography.terminals.join(", ")}). Мы регулярно открываем новые
            направления и расширяем зону охвата.
          </p>
          <p className="font-bold">
            Максимум внимания и уважения каждому клиенту. Начните работать с
            нами, экономя время и деньги!
          </p>
        </div>

        <aside
          id="rekvizity"
          className="h-fit scroll-mt-28 rounded-lg bg-muted p-6 text-sm"
        >
          <h2 className="text-lg font-bold">Реквизиты</h2>
          <dl className="mt-4 space-y-2 text-muted-foreground">
            <div>
              <dt className="font-medium text-foreground">Юридическое лицо</dt>
              <dd>{site.requisites.legalName}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">ИНН / КПП</dt>
              <dd>
                {site.requisites.inn} / {site.requisites.kpp}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">ОГРН</dt>
              <dd>{site.requisites.ogrn}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">ОКПО</dt>
              <dd>{site.requisites.okpo}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Юридический адрес</dt>
              <dd>{site.requisites.legalAddress}</dd>
            </div>
          </dl>
        </aside>
      </div>

      <section className="mt-16 rounded-lg bg-muted p-6 lg:p-8">
        <h2 className="text-2xl font-bold">Доверьте нам свою логистику</h2>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          Оставьте контакты — обсудим вашу задачу.
        </p>
        <LeadForm />
      </section>
    </div>
  );
}
