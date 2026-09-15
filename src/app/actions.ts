"use server";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Укажите имя").max(200),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9()\-\s]{6,20}$/, "Укажите корректный телефон"),
  cityFrom: z.string().trim().max(100).optional(),
  cityTo: z.string().trim().max(100).optional(),
  comment: z.string().trim().max(2000).optional(),
  consent: z.literal("on", { error: "Необходимо согласие на обработку данных" }),
});

export type LeadState = {
  ok: boolean;
  error?: string;
};

// MVP: заявки складываются в var/leads.jsonl на сервере. После подключения
// PostgreSQL перейдут в таблицу orders, откуда их заберёт 1С поллингом.
export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const parsed = leadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }
  const { consent: _consent, ...lead } = parsed.data;
  const dir = path.join(process.cwd(), "var");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "leads.jsonl"),
    JSON.stringify({ ...lead, createdAt: new Date().toISOString() }) + "\n",
    "utf8",
  );
  return { ok: true };
}
