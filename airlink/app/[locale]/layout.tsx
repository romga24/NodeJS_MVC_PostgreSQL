"use client"

import type React from "react"
import type { ReactNode } from "react"
import Header from "@/modules/shared/components/header"
import { CustomMenubar } from "@/modules/shared/components/custom-menubar"
import { Footer } from "@/modules/shared/components/footer"
import { SessionChecker } from "@/modules/shared/components/session-checker"
import { isAdmin, getAuthToken } from "@/lib/auth-utils"
import { useEffect, useState } from "react"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    setIsUserAdmin(isAdmin(token))
  }, [])

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      <SessionChecker>
        {!isUserAdmin && (
          <div className="w-full bg-[#EBE7E7]">
            <CustomMenubar />
          </div>
        )}
        <main className="flex-grow w-full bg-gray-200">{children}</main>
        <Footer />
      </SessionChecker>
    </div>
  )
}

export default Layout
