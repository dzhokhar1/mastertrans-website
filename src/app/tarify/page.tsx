import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  cityTariffs,
  oversizeSurcharges,
  tariffConditions,
} from "@/data/tariffs";
import { packagingPrices } from "@/data/services";

export const metadata: Metadata = {
  title: "Тарифы",
  description:
    "Тарифы на забор и доставку груза по городам: Москва, Грозный, Хасавюрт, Махачкала, Ростов-на-Дону. Цены на упаковку и складские услуги.",
};

const fmt = new Intl.NumberFormat("ru-RU");

export default function TariffsPage() {
  return (
    <div className="mx-auto max-w-[1348px] px-4 pt-12">
      <h1 className="text-4xl font-bold">Тарифы</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Стоимость забора и доставки груза по городу. Стоимость определяется по
        максимальному параметру: вес, объём или габариты.
      </p>

      <Tabs defaultValue={cityTariffs[0].city} className="mt-8">
        <TabsList className="h-auto flex-wrap">
          {cityTariffs.map((t) => (
            <TabsTrigger key={t.city} value={t.city}>
              {t.city}
            </TabsTrigger>
          ))}
        </TabsList>

        {cityTariffs.map((t) => (
          <TabsContent key={t.city} value={t.city}>
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead>Вес, кг</TableHead>
                    <TableHead>Объём, м³</TableHead>
                    <TableHead>Габарит, м</TableHead>
                    <TableHead>По городу, ₽</TableHead>
                    <TableHead>За городом, ₽/км</TableHead>
                    <TableHead>Норм. время, ч</TableHead>
                    <TableHead>Простой, ₽/ч</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {t.rows.map((r) => (
                    <TableRow key={r.maxWeightKg} className="tabular-nums">
                      <TableCell className="font-medium">
                        до {fmt.format(r.maxWeightKg)}
                      </TableCell>
                      <TableCell>до {r.maxVolumeM3}</TableCell>
                      <TableCell>до {r.maxDimensionM}</TableCell>
                      <TableCell className="font-bold">
                        {fmt.format(r.cityPrice)}
                      </TableCell>
                      <TableCell>{r.outOfCityPerKm}</TableCell>
                      <TableCell>{r.normHours ?? "—"}</TableCell>
                      <TableCell>
                        {r.idlePerHour ? fmt.format(r.idlePerHour) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              {t.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>

      <section className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Надбавки за негабарит</h2>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            {oversizeSurcharges.map((s) => (
              <li key={s} className="rounded-lg bg-muted px-4 py-2.5">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Условия расчёта</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground">
            {tariffConditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      </section>

      <section id="dop-uslugi" className="mt-16 scroll-mt-28">
        <h2 className="text-2xl font-bold">
          Упаковка и складские услуги
        </h2>
        <div className="mt-4 max-w-3xl overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <TableHead>Услуга</TableHead>
                <TableHead>Мин. стоимость</TableHead>
                <TableHead>За м³</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packagingPrices.map((p) => (
                <TableRow key={p.name} className="tabular-nums">
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    {fmt.format(p.minPrice)} ₽{p.unit ? `/${p.unit}` : ""}
                  </TableCell>
                  <TableCell>
                    {p.perM3 ? `${fmt.format(p.perM3)} ₽` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
