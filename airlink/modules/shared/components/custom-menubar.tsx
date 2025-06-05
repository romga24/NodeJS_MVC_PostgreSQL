"use client"

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function CustomMenubar() {
  const t = useTranslations()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()

    window.addEventListener("resize", checkIfMobile)

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleMouseEnter = (menuName: string) => {
    setOpenMenu(menuName)
  }

  const handleMouseLeave = () => {
    setOpenMenu(null)
  }

  const menuItems = [
    { key: "bookingFlights", href: "/dashboard", label: t("menubar.bookingFlights") },
    { key: "bookingManagement", href: "/booking-management", label: t("menubar.bookingManagement") },
    { key: "tripInfo", href: "/travelInfo", label: t("menubar.tripInfo") },
    { key: "contact", href: "/contact", label: t("common.contact") },
  ]

  if (isMobile) {
    return null
  }

  return (
    <div className="bg-gray-200 w-full">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {menuItems.map((item, index) => (
          <div key={item.key} className="flex-1 flex justify-center relative">
            <Link
              href={item.href}
              className="text-md hover:text-primary focus:text-primary hover:font-semibold py-3 px-4 text-center"
              onMouseEnter={() => handleMouseEnter(item.key)}
              onMouseLeave={handleMouseLeave}
            >
              {item.label}
            </Link>
            {index < menuItems.length - 1 && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <Separator orientation="vertical" className="h-6 bg-black" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
