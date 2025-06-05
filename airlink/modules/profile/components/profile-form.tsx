"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useTranslations } from "next-intl"

interface ProfileFormProps {
  profileData: {
    id_cliente?: number | string
    nombre?: string
    apellidos?: string
    email?: string
    telefono?: string
    nif?: string
    nombre_usuario?: string
  }
  onSubmit: (data: any) => Promise<boolean | void>
}

export function ProfileForm({ profileData, onSubmit }: ProfileFormProps) {
  const t = useTranslations()
  const [formData, setFormData] = useState({
    nombre: profileData.nombre || "",
    apellidos: profileData.apellidos || "",
    email: profileData.email || "",
    telefono: profileData.telefono || "",
    nombre_usuario: profileData.nombre_usuario || "",
    contraseña: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const dataToSubmit = {
      ...formData,
      ...(formData.contraseña === "" && { contraseña: undefined }),
    }

    try {
      await onSubmit(dataToSubmit)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.editProfile")}</CardTitle>
        <CardDescription>{t("profile.updateInfo")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">{t("profile.name")}</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellidos">{t("profile.lastName")}</Label>
              <Input
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">{t("profile.phone")}</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_usuario">{t("profile.username")}</Label>
            <Input
              id="nombre_usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contraseña">{t("profile.newPassword")}</Label>
            <div className="relative">
              <Input
                id="contraseña"
                name="contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.contraseña}
                onChange={handleChange}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isLoading} className="ml-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("profile.saving")}
              </>
            ) : (
              t("profile.saveChanges")
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
