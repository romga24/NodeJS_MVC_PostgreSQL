"use client"

import { ProfileView } from "@/modules/profile/components/profile-view"
import { useTranslations } from "next-intl"

export default function ProfilePage() {
  const t = useTranslations("Profile")

  return (
    <div className="py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("myProfile")}</h1>
      <ProfileView />
    </div>
  )
}
