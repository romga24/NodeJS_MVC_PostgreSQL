import { getMessages } from "next-intl/server"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const messages = await getMessages({ locale: "es" })

  redirect("/es")
}
