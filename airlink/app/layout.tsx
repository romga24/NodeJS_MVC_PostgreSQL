import type React from "react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import "./globals.css"
import AuthProvider from "./AuthProvider"
import { Toaster } from "sonner"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Resolver los params async
  const { locale } = await params

 
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="icon" href="/src/assets/logoAzul.png" />
        <title>AirLink</title>
        <link href="https://fonts.googleapis.com/css2?family=Chocolate+Classical+Sans&display=swap" rel="stylesheet" />
      </head>
      <body key={locale}>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
