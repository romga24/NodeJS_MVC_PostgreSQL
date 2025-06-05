"use client"

import { useTranslations } from "next-intl"
import { ContactForm } from "./contact-form"
import { ContactInfo } from "./contact-info"
import { ContactMap } from "./contact-map"


export function ContactPage() {
  const t = useTranslations("Contact")

  return (
    <div className=" px-4 py-8 w-full">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <ContactMap />
        </div>
        <div>
          <ContactInfo />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">{t("formTitle")}</h2>
        <ContactForm />
      </div>
    </div>
  )
}

