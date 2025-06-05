"use client"

import logoBlanco from "@/public/Airlink_blanco.png"
import LanguageSwitcher from "./language-switcher"
import { Button } from "../../../components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useSessionStatus } from "./session-checker"
import { useTranslations } from "next-intl"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { isAdmin, getAuthToken } from "@/lib/auth-utils"
import MenuAvatar from "./profile-card"

const Header = () => {
  const t = useTranslations()
  const { data: session, status } = useSession()
  const { isSessionExpired, checkSession } = useSessionStatus()
  const [isMobile, setIsMobile] = useState(false)
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  useEffect(() => {
    const token = getAuthToken()
    setIsUserAdmin(isAdmin(token))
  }, [session])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const showLoginButton = status !== "authenticated" || isSessionExpired

  const menuItems = [
    { key: "bookingFlights", href: "/dashboard", label: t("menubar.bookingFlights") },
    { key: "bookingManagement", href: "#", label: t("menubar.bookingManagement") },
    { key: "tripInfo", href: "/travelInfo", label: t("menubar.tripInfo") },
    { key: "contact", href: "/contact", label: t("common.contact") },
  ]

  return (
    <header className="w-full bg-sky-950 text-white h-20 px-8">
      <div className="container mx-auto flex justify-between items-center h-full">
        <div className="flex">
          <a href={isUserAdmin ? "/admin/dashboard" : "/dashboard"} className="flex flex-row items-center gap-4">
            <Image src={logoBlanco || "/placeholder.svg"} alt="Logo Airlink" className="w-12" />
            {!isMobile && (
              <h1 className="text-3xl text-white font-semibold">AirLink</h1>
            )}
          </a>
        </div>
        <div className="flex justify-end items-center space-x-2">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white mr-2" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left mb-4">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4">
                  {menuItems.map((item) => (
                    <SheetClose asChild key={item.key}>
                      <Link
                        href={item.href}
                        className="text-md hover:text-primary focus:text-primary hover:font-semibold py-2 block"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <LanguageSwitcher />
          {showLoginButton ? (
            <Link href="/login">
              <Button variant="ghost">{t("common.login")}</Button>
            </Link>
          ) : (
            <MenuAvatar />
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
