"use client"

import { useTranslations } from "next-intl"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PawPrint, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PetsInfo() {
  const t = useTranslations("TravelInfo.pets")

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{t("title")}</h2>

      <p className="mb-4">{t("intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-100 p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <PawPrint className="h-5 w-5 mr-2 text-primary" />
            {t("cabinPets")}
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("cabinWeight")}</li>
            <li>{t("cabinCarrier")}</li>
            <li>{t("cabinLimit")}</li>
          </ul>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border border-sky-100">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <PawPrint className="h-5 w-5 mr-2 text-primary" />
            {t("holdPets")}
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("holdWeight")}</li>
            <li>{t("holdCarrier")}</li>
            <li>{t("holdTemperature")}</li>
          </ul>
        </div>
      </div>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{t("warning")}</AlertDescription>
      </Alert>

      <h3 className="text-xl font-semibold mb-4">{t("requiredDocumentsTitle")}</h3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>{t("document1")}</li>
        <li>{t("document2")}</li>
        <li>{t("document3")}</li>
        <li>{t("document4")}</li>
      </ul>

      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="restricted-breeds">
          <AccordionTrigger>{t("restrictedBreedsTitle")}</AccordionTrigger>
          <AccordionContent>
            <p className="mb-2">{t("restrictedBreedsDescription")}</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Pit Bull Terrier</li>
              <li>American Staffordshire Terrier</li>
              <li>Rottweiler</li>
              <li>Doberman</li>
              <li>Akita Inu</li>
              <li>Tosa Inu</li>
              <li>Bull Terrier</li>
              <li>Bullmastiff</li>
              <li>Fila Brasileiro</li>
              <li>Presa Canario</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="international-travel">
          <AccordionTrigger>{t("internationalTravelTitle")}</AccordionTrigger>
          <AccordionContent>
            <p>{t("internationalTravelDescription")}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="service-animals">
          <AccordionTrigger>{t("serviceAnimalsTitle")}</AccordionTrigger>
          <AccordionContent>
            <p>{t("serviceAnimalsDescription")}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          {t("tipsTitle")}
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t("tip1")}</li>
          <li>{t("tip2")}</li>
          <li>{t("tip3")}</li>
          <li>{t("tip4")}</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start">
          <Info className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">{t("bookingTitle")}</h4>
            <p>{t("bookingDescription")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

