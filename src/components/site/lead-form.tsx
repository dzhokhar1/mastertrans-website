"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitLead, type LeadState } from "@/app/actions";
import { formCities } from "@/data/site";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initial: LeadState = { ok: false };

export function LeadForm({ withRoute = false }: { withRoute?: boolean }) {
  const [state, action, pending] = useActionState(submitLead, initial);

  if (state.ok) {
    return (
      <div className="rounded-lg bg-muted p-8 text-center">
        <p className="text-xl font-bold">Заявка отправлена</p>
        <p className="mt-2 text-muted-foreground">
          Мы свяжемся с вами в ближайшее рабочее время.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="lead-name">Ваше имя *</Label>
          <Input id="lead-name" name="name" required className="h-12" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="lead-phone">Ваш телефон *</Label>
          <Input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            placeholder="+7 (___) ___-__-__"
            className="h-12"
          />
        </div>
        {withRoute && (
          <>
            <div className="grid gap-1.5">
              <Label>Откуда</Label>
              <Select name="cityFrom">
                <SelectTrigger className="h-12">
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
              <Select name="cityTo">
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Город назначения" />
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
          </>
        )}
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="lead-consent" name="consent" required className="mt-0.5" />
        <Label htmlFor="lead-consent" className="text-sm font-normal text-muted-foreground">
          Согласен на обработку персональных данных в соответствии с{" "}
          <Link href="/politika" className="underline underline-offset-4">
            политикой обработки данных
          </Link>
        </Label>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="brand-gradient h-12 border-0 sm:w-fit sm:px-10"
      >
        {pending ? "Отправляем…" : "Отправить заявку"}
      </Button>
    </form>
  );
}
