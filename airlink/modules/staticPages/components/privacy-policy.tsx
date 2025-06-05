"use client"

import { useTranslations } from "next-intl"

export function PrivacyPolicy() {
  const t = useTranslations("privacy")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

      <div className="prose max-w-none">
        <p className="mb-4">{t("lastUpdated")}: 24 de marzo de 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("introduction.title")}</h2>
        <p className="mb-4">{t("introduction.p1")}</p>
        <p className="mb-4">{t("introduction.p2")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("dataCollection.title")}</h2>
        <p className="mb-4">{t("dataCollection.p1")}</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">{t("dataCollection.list.item1")}</li>
          <li className="mb-2">{t("dataCollection.list.item2")}</li>
          <li className="mb-2">{t("dataCollection.list.item3")}</li>
          <li className="mb-2">{t("dataCollection.list.item4")}</li>
          <li className="mb-2">{t("dataCollection.list.item5")}</li>
          <li className="mb-2">{t("dataCollection.list.item6")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("dataUse.title")}</h2>
        <p className="mb-4">{t("dataUse.p1")}</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">{t("dataUse.list.item1")}</li>
          <li className="mb-2">{t("dataUse.list.item2")}</li>
          <li className="mb-2">{t("dataUse.list.item3")}</li>
          <li className="mb-2">{t("dataUse.list.item4")}</li>
          <li className="mb-2">{t("dataUse.list.item5")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("dataSharing.title")}</h2>
        <p className="mb-4">{t("dataSharing.p1")}</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">{t("dataSharing.list.item1")}</li>
          <li className="mb-2">{t("dataSharing.list.item2")}</li>
          <li className="mb-2">{t("dataSharing.list.item3")}</li>
          <li className="mb-2">{t("dataSharing.list.item4")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("cookies.title")}</h2>
        <p className="mb-4">{t("cookies.p1")}</p>
        <p className="mb-4">{t("cookies.p2")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("security.title")}</h2>
        <p className="mb-4">{t("security.p1")}</p>
        <p className="mb-4">{t("security.p2")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("rights.title")}</h2>
        <p className="mb-4">{t("rights.p1")}</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">{t("rights.list.item1")}</li>
          <li className="mb-2">{t("rights.list.item2")}</li>
          <li className="mb-2">{t("rights.list.item3")}</li>
          <li className="mb-2">{t("rights.list.item4")}</li>
          <li className="mb-2">{t("rights.list.item5")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("changes.title")}</h2>
        <p className="mb-4">{t("changes.p1")}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("contact.title")}</h2>
        <p className="mb-4">{t("contact.p1")}</p>
        <p className="mb-4">
          Email:{" "}
          <a href="mailto:privacidad@airlink.com" className="text-primary hover:underline">
            privacidad@airlink.com
          </a>
        </p>
      </div>
    </div>
  )
}

