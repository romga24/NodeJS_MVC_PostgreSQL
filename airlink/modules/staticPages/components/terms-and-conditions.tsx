"use client"

import { useTranslations } from "next-intl"

export function TermsAndConditions() {
  const t = useTranslations("terms")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="prose max-w-none">
        <p className="mb-4">{t("lastUpdated")}: 24 de marzo de 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("introduction.title")}</h2>
        <p className="mb-4">{t("introduction.p1")}</p>
        <p className="mb-4">{t("introduction.p2")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("definitions.title")}</h2>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            <strong>{t("definitions.list.item1.term")}</strong>: {t("definitions.list.item1.definition")}
          </li>
          <li className="mb-2">
            <strong>{t("definitions.list.item2.term")}</strong>: {t("definitions.list.item2.definition")}
          </li>
          <li className="mb-2">
            <strong>{t("definitions.list.item3.term")}</strong>: {t("definitions.list.item3.definition")}
          </li>
          <li className="mb-2">
            <strong>{t("definitions.list.item4.term")}</strong>: {t("definitions.list.item4.definition")}
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("bookings.title")}</h2>
        <p className="mb-4">{t("bookings.p1")}</p>
        <p className="mb-4">{t("bookings.p2")}</p>
        <p className="mb-4">{t("bookings.p3")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("fares.title")}</h2>
        <p className="mb-4">{t("fares.p1")}</p>
        <p className="mb-4">{t("fares.p2")}</p>
        <p className="mb-4">{t("fares.p3")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("checkin.title")}</h2>
        <p className="mb-4">{t("checkin.p1")}</p>
        <p className="mb-4">{t("checkin.p2")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("baggage.title")}</h2>
        <p className="mb-4">{t("baggage.p1")}</p>
        <p className="mb-4">{t("baggage.p2")}</p>
        <p className="mb-4">{t("baggage.p3")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("refunds.title")}</h2>
        <p className="mb-4">{t("refunds.p1")}</p>
        <p className="mb-4">{t("refunds.p2")}</p>
        <p className="mb-4">{t("refunds.p3")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("liability.title")}</h2>
        <p className="mb-4">{t("liability.p1")}</p>
        <p className="mb-4">{t("liability.p2")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("changes.title")}</h2>
        <p className="mb-4">{t("changes.p1")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("contact.title")}</h2>
        <p className="mb-4">{t("contact.p1")}</p>
        <p className="mb-4">
          Email:{" "}
          <a href="mailto:legal@airlink.com" className="text-primary hover:underline">
            legal@airlink.com
          </a>
        </p>
      </div>
    </div>
  )
}

