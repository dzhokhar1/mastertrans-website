import type { Metadata } from "next";
import { Check, CircleDashed, Truck } from "lucide-react";
import { TrackWidget } from "@/components/site/track-widget";
import { site } from "@/data/site";
import {
  findShipment,
  statusLabels,
  statusOrder,
} from "@/data/demo-shipments";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Отслеживание груза",
  description:
    "Узнайте, где сейчас ваш груз: введите номер отслеживания из квитанции о приёме груза.",
};

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function TrackingPage({
  searchParams,
}: PageProps<"/otslezhivanie">) {
  const params = await searchParams;
  const id = typeof params.id === "string" ? params.id : "";
  const shipment = id ? findShipment(id) : undefined;

  return (
    <div className="mx-auto max-w-[1348px] px-4 pt-12">
      <h1 className="text-4xl font-bold">Отслеживание груза</h1>
      <div className="mt-8 max-w-2xl">
        <TrackWidget />
      </div>

      {id && !shipment && (
        <div className="mt-8 max-w-2xl rounded-lg border border-border p-6">
          <p className="font-bold">Груз с номером «{id}» не найден</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Проверьте корректность введённого номера. Если номер верный, а груз
            не находится — позвоните нам:{" "}
            <a href={site.phoneMainHref} className="font-medium text-primary">
              {site.phoneMain}
            </a>
          </p>
        </div>
      )}

      {shipment && (
        <div className="mt-8 max-w-2xl rounded-lg bg-muted p-6 lg:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Груз № <span className="font-mono font-bold text-foreground">{shipment.trackCode}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {shipment.cityFrom} → {shipment.cityTo}
            </p>
          </div>
          <p className="mt-3 text-3xl font-bold">
            {statusLabels[shipment.status]}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {shipment.placesCount} мест · {shipment.weightKg} кг ·{" "}
            {shipment.volumeM3} м³
          </p>

          <ol className="mt-8 space-y-0">
            {statusOrder.map((status, i) => {
              const event = shipment.events.find((e) => e.status === status);
              const reached = Boolean(event);
              const isCurrent = status === shipment.status;
              const isLast = i === statusOrder.length - 1;
              return (
                <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
                  {!isLast && (
                    <span
                      className={cn(
                        "absolute left-[15px] top-8 h-[calc(100%-16px)] w-0.5",
                        reached ? "brand-gradient" : "bg-border",
                      )}
                      aria-hidden
                    />
                  )}
                  <span
                    className={cn(
                      "z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                      reached
                        ? "brand-gradient text-white"
                        : "border border-border bg-background text-muted-foreground",
                    )}
                  >
                    {reached ? (
                      isCurrent && status !== "received" ? (
                        <Truck className="size-4" aria-hidden />
                      ) : (
                        <Check className="size-4" aria-hidden />
                      )
                    ) : (
                      <CircleDashed className="size-4" aria-hidden />
                    )}
                  </span>
                  <span>
                    <span
                      className={cn(
                        "font-bold",
                        !reached && "text-muted-foreground",
                        isCurrent && "text-primary",
                      )}
                    >
                      {statusLabels[status]}
                    </span>
                    {event && (
                      <span className="block text-sm text-muted-foreground">
                        {dateFmt.format(new Date(event.date))}
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {!id && (
        <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
          Для проверки сервиса можно использовать демо-номера: MT-7K3F9Q (в
          пути), MT-2XA8ZR (в пункте выдачи), MT-9QLM44 (получен). После
          подключения 1С здесь будут отображаться реальные статусы ваших грузов.
        </p>
      )}
    </div>
  );
}
