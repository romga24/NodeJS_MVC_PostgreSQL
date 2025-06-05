"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Mail, CreditCard, UserCircle } from "lucide-react"
import { useTranslations } from "next-intl"

interface ProfileInfoProps {
  profileData: {
    id_cliente?: number | string
    nombre?: string
    apellidos?: string
    email?: string
    telefono?: string
    nif?: string
    nombre_usuario?: string
  }
}

export function ProfileInfo({ profileData }: ProfileInfoProps) {
  const t = useTranslations()

  const infoItems = [
    {
      icon: <User className="h-5 w-5 text-primary" />,
      label: t("profile.fullName"),
      value: `${profileData.nombre || ""} ${profileData.apellidos || ""}`,
    },
    {
      icon: <UserCircle className="h-5 w-5 text-primary" />,
      label: t("profile.username"),
      value: profileData.nombre_usuario || "",
    },
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      label: t("profile.email"),
      value: profileData.email || "",
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      label: t("profile.phone"),
      value: profileData.telefono || "",
    },
    {
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      label: t("profile.nif"),
      value: profileData.nif || "",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.personalInfo")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="mr-3 mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
