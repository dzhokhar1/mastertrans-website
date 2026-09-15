"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { useState } from "react";

const nav = [
  { href: "/uslugi", label: "Услуги" },
  { href: "/tarify", label: "Тарифы" },
  { href: "/kalkulyator", label: "Калькулятор" },
  { href: "/otslezhivanie", label: "Отслеживание" },
  { href: "/o-kompanii", label: "О компании" },
  { href: "/kontakty", label: "Контакты" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-[1348px] items-center gap-6 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="brand-gradient flex size-10 items-center justify-center rounded-lg text-white">
            <Truck className="size-6" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold">{site.name}</span>
            <span className="block text-xs text-muted-foreground">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                pathname.startsWith(item.href) && "bg-muted text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={site.phoneMainHref}
            className="hidden items-center gap-2 text-sm font-bold sm:flex"
          >
            <Phone className="size-4 text-primary" aria-hidden />
            {site.phoneMain}
          </a>
          <Button asChild className="brand-gradient hidden border-0 sm:inline-flex">
            <Link href="/kalkulyator">Рассчитать</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Меню">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{site.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-lg font-bold hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={site.phoneMainHref}
                  className="mt-4 flex items-center gap-2 px-3 font-bold"
                >
                  <Phone className="size-4 text-primary" aria-hidden />
                  {site.phoneMain}
                </a>
                <p className="px-3 text-sm text-muted-foreground">{site.schedule}</p>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
