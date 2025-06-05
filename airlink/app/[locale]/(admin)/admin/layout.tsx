import type React from "react"
import type { ReactNode } from "react"
import { Footer } from "@/modules/shared/components/footer"
import { SessionChecker } from "@/modules/shared/components/session-checker"

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <SessionChecker>
        <main className="flex-grow w-full bg-gray-200">{children}</main>
      </SessionChecker>
    </div>
  )
}

export default Layout
