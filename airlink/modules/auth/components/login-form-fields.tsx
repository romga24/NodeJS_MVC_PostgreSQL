"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Eye, EyeOff } from "lucide-react"
import { loginSchema } from "@/schemas/schemas"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

type FormValues = z.infer<typeof loginSchema>

interface LoginFormFieldsProps {
  onSubmit: (data: FormValues) => Promise<boolean>
  isLoading: boolean
}

export function LoginFormFields({ onSubmit, isLoading }: LoginFormFieldsProps) {
	const t = useTranslations()
  const [showPassword, setShowPassword] = useState(false)
  const locale = useLocale()

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usuarioOEmail: "",
      contraseña: "",
    },
  })

  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="usuarioOEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.user')}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contraseña"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t('auth.password')}</FormLabel>
                <Link href={`/${locale}/recover-password`} className="text-sm text-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input {...field} type={showPassword ? "text" : "password"} disabled={isLoading} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? t("auth.hidePassword") : t("auth.showPassword")}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {t("common.login")}
        </Button>
      </form>
    </Form>
  )
}
