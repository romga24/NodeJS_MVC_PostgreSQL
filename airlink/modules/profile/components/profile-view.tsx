"use client"

import { useState } from "react"
import { useProfile } from "@/modules/profile/hooks/use-profile"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { ProfileInfo } from "./profile-info"
import { ProfileForm } from "./profile-form"

export function ProfileView() {
  const t = useTranslations()
  const { profileData, isLoading, error, loadProfile, updateProfile, deleteAccount } = useProfile()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-red-600">{t("profile.errorTitle")}</CardTitle>
          <CardDescription>{t("profile.errorDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("profile.error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => loadProfile()}>{t("profile.retry")}</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profileData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">{t("profile.noDataTitle")}</CardTitle>
          <CardDescription>{t("profile.noDataDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => loadProfile()}>{t("profile.retry")}</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">{t("profile.personalInfo")}</TabsTrigger>
          <TabsTrigger value="edit">{t("profile.editProfile")}</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <ProfileInfo profileData={profileData} />
          <div className="flex justify-end mt-6 space-x-4">
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              {t("profile.deleteAccount")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <ProfileForm
            profileData={profileData}
            onSubmit={async (data) => {
              return await updateProfile(data)
            }}
          />
        </TabsContent>
      </Tabs>

      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteAccount}
      />
    </div>
  )
}
