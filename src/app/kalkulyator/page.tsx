import type { Metadata } from "next";
import { MiniCalc } from "@/components/site/mini-calc";
import { LeadForm } from "@/components/site/lead-form";

export const metadata: Metadata = {
  title: "Калькулятор стоимости",
  description:
    "Рассчитайте стоимость забора и доставки груза по городу и оставьте заявку на перевозку между городами России.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-[1348px] px-4 pt-12">
      <h1 className="text-4xl font-bold">Расчёт стоимости перевозки</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Укажите параметры груза — покажем тариф забора по городу. Точную
        стоимость межтерминальной перевозки рассчитает менеджер по вашей заявке.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
        <MiniCalc />
        <div className="rounded-lg border border-border p-6 lg:p-8">
          <h2 className="text-2xl font-bold">Заявка на перевозку</h2>
          <p className="mb-6 mt-2 text-sm text-muted-foreground">
            Оставьте контакты — менеджер перезвонит, уточнит детали и назовёт
            точную стоимость.
          </p>
          <LeadForm withRoute />
        </div>
      </div>
    </div>
  );
}
