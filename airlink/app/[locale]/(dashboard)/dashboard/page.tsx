"use client"

import Image from "next/image"
import imgAboutUs from "@/public/aeropuerto.jpg"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { CustomCarousel } from "@/modules/dashboard/components/dashboard-carousel"
import { FlightBookingCard } from "@/modules/dashboard/components/flight-booking-card"

const Home = () => {
  const t = useTranslations()
  const params = useParams()
  const locale = (params.locale as string) || "es"

  return (
  <>
    <section className="relative w-full pt-[calc(45vh+6rem)] md:pt-[calc(45vh+8rem)]">

      <div className="absolute top-0 left-0 w-full h-[45vh]">
        <CustomCarousel />
      </div>

      <div className="block md:hidden px-4 mt-6 w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out relative z-20">
        <div className="bg-white/95 border border-gray-200 ring-1 ring-gray-100 shadow-xl backdrop-blur-md rounded-2xl overflow-hidden">
          <FlightBookingCard locale={locale} />
        </div>
      </div>

      <div
        className="
          hidden md:block
          absolute z-30 left-1/2 top-[45vh] -translate-x-1/2 -translate-y-full
          w-[90%] md:w-[70%] lg:w-[60%] max-w-4xl px-4
          max-h-[calc(45vh-2rem)]
          overflow-visible
          transition-all duration-500 ease-in-out
        "
      >
        <div className="bg-white/90 border border-gray-300 ring-1 ring-gray-100 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
          <FlightBookingCard locale={locale} />
        </div>
      </div>
    </section>

    <section className="flex flex-col items-center justify-center mt-20 space-y-4 mb-20 px-4">
      <h1 className="font-semibold text-2xl text-center">{t("dashboard.aboutUsTitle")}</h1>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Image src={imgAboutUs || "/placeholder.svg"} alt="Airport img" className="object-cover w-full rounded-t-lg" />
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <p>{t("dashboard.aboutUs.text1")}</p>
            <div className="space-y-2">
              <p className="font-semibold">{t("dashboard.aboutUs.title2")}</p>
              <p>{t("dashboard.aboutUs.text2")}</p>
            </div>
            <div>
              <p className="font-semibold">{t("dashboard.aboutUs.title3")}</p>
              <p>{t("dashboard.aboutUs.text3")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  </>
)

}

export default Home
