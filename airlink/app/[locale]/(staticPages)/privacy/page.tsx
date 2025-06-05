import { PrivacyPolicy } from "@/modules/staticPages/components/privacy-policy"
import { getTranslations } from "next-intl/server"

export default async function PrivacyPage() {
  return <PrivacyPolicy />
}

