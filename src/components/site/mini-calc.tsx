"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formCities } from "@/data/site";
import { calcCityPickup, cityTariffs } from "@/data/tariffs";

const fmt = new Intl.NumberFormat("ru-RU");

export function MiniCalc() {
  const [from, setFrom] = useState<string>("Москва");
  const [to, setTo] = useState<string>("Грозный");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");

  const pickup = useMemo(() => {
    const w = parseFloat(weight.replace(",", "."));
    const v = parseFloat(volume.replace(",", "."));
    if (!from || Number.isNaN(w) || Number.isNaN(v) || w <= 0 || v <= 0) {
      return null;
    }
    return calcCityPickup(from, w, v);
  }, [from, weight, volume]);

  const hasPickupTariff = cityTariffs.some((t) => t.city === from);
  const filled = weight !== "" && volume !== "";

  return (
    <Card className="border-0 bg-muted">
      <CardHeader>
        <CardTitle className="text-2xl">Рассчитать стоимость</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Откуда</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger className="h-12 bg-background">
                <SelectValue placeholder="Город отправления" />
              </SelectTrigger>
              <SelectContent>
                {formCities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Куда</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger className="h-12 bg-background">
                <SelectValue placeholder="Город назначения" />
              </SelectTrigger>
              <SelectContent>
                {formCities
                  .filter((c) => c !== from)
                  .map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mc-weight">Вес, кг</Label>
            <Input
              id="mc-weight"
              inputMode="decimal"
              placeholder="Например, 120"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-12 bg-background"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="mc-volume">Объём, м³</Label>
            <Input
              id="mc-volume"
              inputMode="decimal"
              placeholder="Например, 0,5"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="h-12 bg-background"
            />
          </div>
        </div>

        {filled && hasPickupTariff && (
          <div className="rounded-lg bg-background p-4 text-sm">
            {pickup ? (
              <>
                <p>
                  Забор груза по городу {from}:{" "}
                  <span className="text-lg font-bold">
                    {fmt.format(pickup.cityPrice)} ₽
                  </span>
                </p>
                <p className="mt-1 text-muted-foreground">
                  Точную стоимость перевозки {from} → {to} рассчитает менеджер —
                  оставьте заявку, перезвоним в рабочее время.
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                Для таких параметров нужен индивидуальный расчёт — оставьте
                заявку, и менеджер подберёт транспорт.
              </p>
            )}
          </div>
        )}

        <Button asChild size="lg" className="brand-gradient h-12 border-0">
          <Link
            href={`/kalkulyator?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
          >
            Рассчитать подробно
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
