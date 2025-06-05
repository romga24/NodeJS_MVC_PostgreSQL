import { ContactPage } from "@/modules/contact/components/contact-page"
import { getTranslations } from "next-intl/server"

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Contact({ params }: PageProps) {
  return <ContactPage />
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Contact" })

  return {
    title: t("title"),
    description: t("description"),
  }
}
