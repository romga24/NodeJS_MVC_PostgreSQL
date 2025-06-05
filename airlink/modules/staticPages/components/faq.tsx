"use client"

import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQ() {
	const t = useTranslations("faq")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
      <p className="text-lg mb-8">{t("subtitle")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("bookings.title")}</h2>
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="booking-1">
              <AccordionTrigger>{t("bookings.q1")}</AccordionTrigger>
              <AccordionContent>{t("bookings.a1")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="booking-2">
              <AccordionTrigger>{t("bookings.q2")}</AccordionTrigger>
              <AccordionContent>{t("bookings.a2")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="booking-3">
              <AccordionTrigger>{t("bookings.q3")}</AccordionTrigger>
              <AccordionContent>{t("bookings.a3")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="booking-4">
              <AccordionTrigger>{t("bookings.q4")}</AccordionTrigger>
              <AccordionContent>{t("bookings.a4")}</AccordionContent>
            </AccordionItem>
          </Accordion>

          <h2 className="text-2xl font-semibold mb-4">{t("checkin.title")}</h2>
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="checkin-1">
              <AccordionTrigger>{t("checkin.q1")}</AccordionTrigger>
              <AccordionContent>{t("checkin.a1")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="checkin-2">
              <AccordionTrigger>{t("checkin.q2")}</AccordionTrigger>
              <AccordionContent>{t("checkin.a2")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="checkin-3">
              <AccordionTrigger>{t("checkin.q3")}</AccordionTrigger>
              <AccordionContent>{t("checkin.a3")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">{t("baggage.title")}</h2>
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="baggage-1">
              <AccordionTrigger>{t("baggage.q1")}</AccordionTrigger>
              <AccordionContent>{t("baggage.a1")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="baggage-2">
              <AccordionTrigger>{t("baggage.q2")}</AccordionTrigger>
              <AccordionContent>{t("baggage.a2")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="baggage-3">
              <AccordionTrigger>{t("baggage.q3")}</AccordionTrigger>
              <AccordionContent>{t("baggage.a3")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="baggage-4">
              <AccordionTrigger>{t("baggage.q4")}</AccordionTrigger>
              <AccordionContent>{t("baggage.a4")}</AccordionContent>
            </AccordionItem>
          </Accordion>

          <h2 className="text-2xl font-semibold mb-4">{t("special.title")}</h2>
          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="special-1">
              <AccordionTrigger>{t("special.q1")}</AccordionTrigger>
              <AccordionContent>{t("special.a1")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="special-2">
              <AccordionTrigger>{t("special.q2")}</AccordionTrigger>
              <AccordionContent>{t("special.a2")}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="special-3">
              <AccordionTrigger>{t("special.q3")}</AccordionTrigger>
              <AccordionContent>{t("special.a3")}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">{t("contact.title")}</h2>
        <p className="mb-4">{t("contact.p1")}</p>
        <p className="mb-2">
          <strong>{t("contact.email")}</strong>:{" "}
          <a href="mailto:ayuda@airlink.com" className="text-primary hover:underline">
            ayuda@airlink.com
          </a>
        </p>
        <p className="mb-2">
          <strong>{t("contact.phone")}</strong>:{" "}
          <a href="tel:+34678323040" className="text-primary hover:underline">
            +34 678-323-040
          </a>
        </p>
      </div>
    </div>
  )
}

