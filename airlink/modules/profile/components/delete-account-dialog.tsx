"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface DeleteAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean | void>
}

export function DeleteAccountDialog({ isOpen, onClose, onConfirm }: DeleteAccountDialogProps) {
  const t = useTranslations()
  const [confirmation, setConfirmation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const isConfirmDisabled = confirmation !== "ELIMINAR"

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("profile.deleteAccountDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("profile.deleteAccountDialog.description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="confirmation" className="text-sm font-medium">
            {t("profile.deleteAccountDialog.confirmationLabel")}
          </Label>
          <Input
            id="confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="mt-2"
            disabled={isLoading}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t("profile.deleteAccountDialog.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirm()
            }}
            disabled={isConfirmDisabled || isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("profile.deleteAccountDialog.deleting")}
              </>
            ) : (
              t("profile.deleteAccountDialog.deleteAccount")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
