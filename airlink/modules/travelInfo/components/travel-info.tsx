"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChildrenInfo } from "./children-info"
import { DocumentationInfo } from "./documentation-info"
import { PetsInfo } from "./pets-info"


export function TravelInfo() {
  const t = useTranslations("TravelInfo")
  const [activeTab, setActiveTab] = useState("documentation")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="md:col-span-1 ">
          <div className="sticky top-24">
            <Card className="rounded">
              <CardContent className="p-0">
                <div className="hidden md:block">
                  <ul className="divide-y">
                    <li
                      className={`p-4 cursor-pointer hover:bg-muted transition-colors ${activeTab === "documentation" ? "bg-primary/10 border-l-4 border-primary" : ""}`}
                      onClick={() => setActiveTab("documentation")}
                    >
                      {t("documentation.title")}
                    </li>
                    <li
                      className={`p-4 cursor-pointer hover:bg-muted transition-colors ${activeTab === "pets" ? "bg-primary/10 border-l-4 border-primary" : ""}`}
                      onClick={() => setActiveTab("pets")}
                    >
                      {t("pets.title")}
                    </li>
                    <li
                      className={`p-4 cursor-pointer hover:bg-muted transition-colors ${activeTab === "children" ? "bg-primary/10 border-l-4 border-primary" : ""}`}
                      onClick={() => setActiveTab("children")}
                    >
                      {t("children.title")}
                    </li>
                  </ul>
                </div>
                <div className="md:hidden">
                  <Tabs defaultValue="documentation" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="documentation">{t("documentation.shortTitle")}</TabsTrigger>
                      <TabsTrigger value="pets">{t("pets.shortTitle")}</TabsTrigger>
                      <TabsTrigger value="children">{t("children.shortTitle")}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6">
              {activeTab === "documentation" && <DocumentationInfo />}
              {activeTab === "pets" && <PetsInfo />}
              {activeTab === "children" && <ChildrenInfo />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

