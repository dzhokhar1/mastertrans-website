import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  robots: { index: false },
};

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12">
      <h1 className="text-3xl font-bold">
        Политика обработки персональных данных
      </h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Оператор персональных данных: {site.requisites.legalName}, ИНН{" "}
          {site.requisites.inn}, ОГРН {site.requisites.ogrn}. Адрес:{" "}
          {site.requisites.legalAddress}.
        </p>
        <p>
          Отправляя формы на сайте, вы даёте согласие на обработку указанных
          персональных данных (имя, номер телефона) в целях обратной связи и
          оформления заявки на перевозку груза.
        </p>
        <p>
          Персональные данные обрабатываются и хранятся на серверах, находящихся
          на территории Российской Федерации, в соответствии с Федеральным
          законом от 27.07.2006 № 152-ФЗ «О персональных данных».
        </p>
        <p>
          Для отзыва согласия направьте запрос на {site.email}.
        </p>
        <p className="rounded-lg bg-muted p-4 text-sm">
          Черновик документа. Перед запуском сайта текст политики необходимо
          согласовать с юристом и дополнить: перечень обрабатываемых данных,
          сроки хранения, порядок уничтожения, сведения об уведомлении
          Роскомнадзора.
        </p>
      </div>
    </div>
  );
}
