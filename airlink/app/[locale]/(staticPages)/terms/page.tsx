import { TermsAndConditions } from "@/modules/staticPages/components/terms-and-conditions"
import { getTranslations } from "next-intl/server"

export default async function TermsPage() {
  return <TermsAndConditions />
}

