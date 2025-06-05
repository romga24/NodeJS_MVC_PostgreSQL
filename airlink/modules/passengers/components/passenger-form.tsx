"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslations } from "next-intl"
import type { Passenger } from "../types/passenger-types"

interface PassengerFormProps {
  passenger: Passenger
  index: number
  onChange: (index: number, data: Partial<Passenger>) => void
  outboundSeat?: string
  returnSeat?: string
}

export function PassengerForm({ passenger, index, onChange, outboundSeat, returnSeat }: PassengerFormProps) {
  const [expanded, setExpanded] = useState(index === 0)
  const t = useTranslations()

  const handleChange = (field: keyof Passenger, value: string) => {
    onChange(index, { [field]: value } as any)
  }

  return (
    <Accordion
      type="single"
      collapsible
      value={expanded ? `passenger-${index}` : ""}
      onValueChange={(value) => setExpanded(value === `passenger-${index}`)}
      className="mb-4"
    >
      <AccordionItem value={`passenger-${index}`}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex justify-between w-full">
            <span>
              {t("passengers.passenger")} {index + 1}{" "}
              {passenger.firstName ? `- ${passenger.firstName} ${passenger.lastName}` : ""}
            </span>
            {outboundSeat && (
              <span className="text-sm text-gray-500">
                {t("bookings.seat")}: {outboundSeat}
                {returnSeat ? ` / ${returnSeat}` : ""}
              </span>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor={`firstName-${index}`} className="text-sm font-medium">
                    {t("common.firstName")} *
                  </label>
                  <input
                    type="text"
                    id={`firstName-${index}`}
                    value={passenger.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor={`lastName-${index}`} className="text-sm font-medium">
                    {t("common.lastName")} *
                  </label>
                  <input
                    type="text"
                    id={`lastName-${index}`}
                    value={passenger.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor={`documentType-${index}`} className="text-sm font-medium">
                    {t("passengers.documentTypes.title")} *
                  </label>
                  <select
                    id={`documentType-${index}`}
                    value={passenger.documentType}
                    onChange={(e) => handleChange("documentType", e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="dni">{t("passengers.documentTypes.dni")}</option>
                    <option value="passport">{t("passengers.documentTypes.passport")}</option>
                    <option value="other">{t("passengers.documentTypes.other")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor={`documentNumber-${index}`} className="text-sm font-medium">
                    {t("passengers.documentNumber")} *
                  </label>
                  <input
                    type="text"
                    id={`documentNumber-${index}`}
                    value={passenger.documentNumber}
                    onChange={(e) => handleChange("documentNumber", e.target.value)}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="space-y-2">
                  <label htmlFor={`dateOfBirth-${index}`} className="text-sm font-medium">
                    {t("passengers.dateOfBirth")}
                  </label>
                  <input
                    type="date"
                    id={`dateOfBirth-${index}`}
                    value={passenger.dateOfBirth || ""}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
