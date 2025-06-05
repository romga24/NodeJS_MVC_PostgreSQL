"use client"

import { useTranslations } from "next-intl"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Baby, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ChildrenInfo() {
  const t = useTranslations("TravelInfo.children")

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">{t("title")}</h2>

      <p className="mb-4">{t("intro")}</p>

      <Tabs defaultValue="infants" className="mb-8">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="infants">{t("infantsTab")}</TabsTrigger>
          <TabsTrigger value="children">{t("childrenTab")}</TabsTrigger>
          <TabsTrigger value="unaccompanied">{t("unaccompaniedTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="infants" className="mt-4">
          <div className="bg-gray-100 p-4 rounded-lg border border-sky-100">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Baby className="h-5 w-5 mr-2 text-primary" />
              {t("infantsTitle")}
            </h3>
            <p className="mb-2">{t("infantsDescription")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("infantsPoint1")}</li>
              <li>{t("infantsPoint2")}</li>
              <li>{t("infantsPoint3")}</li>
              <li>{t("infantsPoint4")}</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="children" className="mt-4">
          <div className="bg-gray-100 p-4 rounded-lg border border-sky-100">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Baby className="h-5 w-5 mr-2 text-primary" />
              {t("childrenTitle")}
            </h3>
            <p className="mb-2">{t("childrenDescription")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("childrenPoint1")}</li>
              <li>{t("childrenPoint2")}</li>
              <li>{t("childrenPoint3")}</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="unaccompanied" className="mt-4">
          <div className="bg-gray-100 p-4 rounded-lg border border-sky-100">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Baby className="h-5 w-5 mr-2 text-primary" />
              {t("unaccompaniedTitle")}
            </h3>
            <p className="mb-2">{t("unaccompaniedDescription")}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{t("unaccompaniedPoint1")}</li>
              <li>{t("unaccompaniedPoint2")}</li>
              <li>{t("unaccompaniedPoint3")}</li>
              <li>{t("unaccompaniedPoint4")}</li>
              <li>{t("unaccompaniedPoint5")}</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{t("warning")}</AlertDescription>
      </Alert>

      <h3 className="text-xl font-semibold mb-4">{t("requiredDocumentsTitle")}</h3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>{t("document1")}</li>
        <li>{t("document2")}</li>
        <li>{t("document3")}</li>
        <li>{t("document4")}</li>
      </ul>
      <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          {t("tipsTitle")}
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>{t("tip1")}</li>
          <li>{t("tip2")}</li>
          <li>{t("tip3")}</li>
          <li>{t("tip4")}</li>
          <li>{t("tip5")}</li>
        </ul>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start flex-col">
				<div className="flex">
          <Info className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
					<h4 className="font-semibold mb-1">{t("specialServicesTitle")}</h4>
				</div>
            <p>{t("specialServicesDescription")}</p>
        </div>
      </div>
    </div>
  )
}

