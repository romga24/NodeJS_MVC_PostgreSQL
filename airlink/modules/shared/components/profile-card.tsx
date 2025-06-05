"use client"

import { useEffect, useState } from "react"
import { Avatar } from "../../../components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, TicketIcon as TicketsPlane, User, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useSession } from "next-auth/react"
import { getAuthToken, isAdmin, removeAuthToken } from "@/lib/auth-utils"

const MenuAvatar = () => {
  const t = useTranslations()
  const router = useRouter()
  const { success } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { data: session } = useSession()
	const [isUserAdmin, setIsUserAdmin] = useState(false)

  const getInitials = () => {
    if (session?.user?.name) {
      return session.user.name.substring(0, 2).toUpperCase()
    }
    return "JD"
  }

	useEffect(() => {
		const token = getAuthToken()
		setIsUserAdmin(isAdmin(token))
  }, [session])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await signOut({ redirect: false })
      removeAuthToken()
      success(t("common.loggedOut") || "Sesión cerrada correctamente")
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="flex items-center justify-center bg-zinc-300">
            <AvatarImage src="" alt={session?.user?.name || "Usuario"} />
            <AvatarFallback className="text-blue-700">{getInitials()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-4 mt-2 w-48">
          <DropdownMenuLabel>{session?.user?.name || t("common.name")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              <span>{t("common.profile")}</span>
            </Link>
          </DropdownMenuItem>
          {!isUserAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/booking" className="flex items-center gap-2 cursor-pointer">
              <TicketsPlane className="h-4 w-4" />
              <span>{t("common.myFlights")}</span>
            </Link>
          </DropdownMenuItem>
        )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            <span>{isLoggingOut ? t("common.loggingOut") || "Cerrando sesión..." : t("common.logOut")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default MenuAvatar
