"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TrackWidget() {
  const [id, setId] = useState("");
  const router = useRouter();

  return (
    <Card className="border-0 bg-muted">
      <CardHeader>
        <CardTitle className="text-2xl">Отследить груз</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            if (id.trim()) {
              router.push(`/otslezhivanie?id=${encodeURIComponent(id.trim())}`);
            }
          }}
        >
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Номер отслеживания"
            aria-label="Номер отслеживания"
            className="h-12 flex-1 bg-background"
          />
          <Button type="submit" size="lg" className="brand-gradient h-12 border-0">
            <Search className="size-4" aria-hidden />
            Отследить
          </Button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">
          Номер указан в квитанции о приёме груза и в SMS-уведомлении. Сервис
          покажет, где сейчас ваш груз.
        </p>
      </CardContent>
    </Card>
  );
}
