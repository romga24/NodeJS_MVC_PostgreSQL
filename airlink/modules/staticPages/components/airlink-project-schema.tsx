"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Folder,
  File,
  Globe,
  Shield,
  Plane,
  Users,
  Settings,
  Layout,
  Code,
  Database,
  Palette,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

interface TreeNode {
  name: string
  type: "folder" | "file"
  icon?: any
  description?: string
  children?: TreeNode[]
  badge?: string
  color?: string
}

const projectStructure: TreeNode = {
  name: "airlink/",
  type: "folder",
  icon: Plane,
  description: "Sistema de reservas de vuelos con Next.js",
  children: [
    {
      name: "app/",
      type: "folder",
      icon: Layout,
      description: "Estructura de rutas de Next.js App Router",
      badge: "Next.js 15",
      color: "bg-blue-100 text-blue-800",
      children: [
        {
          name: "[locale]/",
          type: "folder",
          icon: Globe,
          description: "Rutas con soporte de idiomas (es/en)",
          children: [
            {
              name: "(auth)/",
              type: "folder",
              icon: Shield,
              description: "Autenticación",
              badge: "login, register, recover",
              color: "bg-green-100 text-green-800",
            },
            {
              name: "(booking)/",
              type: "folder",
              icon: Plane,
              description: "Proceso de reserva",
              badge: "search, seats, passengers",
              color: "bg-purple-100 text-purple-800",
            },
            {
              name: "(dashboard)/",
              type: "folder",
              icon: Layout,
              description: "Dashboard principal",
              color: "bg-orange-100 text-orange-800",
            },
            {
              name: "(profile)/",
              type: "folder",
              icon: Users,
              description: "Perfil de usuario",
              color: "bg-cyan-100 text-cyan-800",
            },
            {
              name: "(staticPages)/",
              type: "folder",
              icon: File,
              description: "Páginas estáticas",
              badge: "FAQ, Terms, Privacy",
              color: "bg-gray-100 text-gray-800",
            },
            {
              name: "admin/",
              type: "folder",
              icon: Settings,
              description: "Panel de administración",
              color: "bg-red-100 text-red-800",
            },
          ],
        },
        {
          name: "api/",
          type: "folder",
          icon: Database,
          description: "Rutas de API REST",
          badge: "Backend",
          color: "bg-indigo-100 text-indigo-800",
          children: [
            { name: "auth/", type: "folder", description: "Endpoints de autenticación" },
            { name: "bookings/", type: "folder", description: "Endpoints de reservas" },
            { name: "profile/", type: "folder", description: "Endpoints de perfil" },
            { name: "register/", type: "folder", description: "Endpoint de registro" },
          ],
        },
        {
          name: "AuthProvider.tsx",
          type: "file",
          icon: Shield,
          description: "Proveedor de autenticación global",
        },
        {
          name: "globals.css",
          type: "file",
          icon: Palette,
          description: "Estilos globales con Tailwind",
        },
      ],
    },
    {
      name: "components/",
      type: "folder",
      icon: Layout,
      description: "Componentes UI reutilizables",
      badge: "shadcn/ui",
      color: "bg-emerald-100 text-emerald-800",
      children: [
        {
          name: "ui/",
          type: "folder",
          description: "Componentes base de shadcn/ui",
          badge: "button, card, dialog, etc.",
        },
      ],
    },
    {
      name: "modules/",
      type: "folder",
      icon: Code,
      description: "Módulos funcionales por dominio",
      badge: "Arquitectura modular",
      color: "bg-yellow-100 text-yellow-800",
      children: [
        {
          name: "auth/",
          type: "folder",
          icon: Shield,
          description: "Autenticación y autorización",
          children: [
            { name: "components/", type: "folder", description: "login-form, register-form" },
            { name: "services/", type: "folder", description: "login, register, password-recovery" },
            { name: "types/", type: "folder", description: "Tipos de autenticación" },
          ],
        },
        {
          name: "booking/",
          type: "folder",
          icon: Plane,
          description: "Proceso de reserva",
        },
        {
          name: "flights/",
          type: "folder",
          icon: Plane,
          description: "Búsqueda y selección de vuelos",
          children: [
            { name: "components/", type: "folder", description: "flight-card, search-page-client" },
            { name: "hooks/", type: "folder", description: "use-search-flights" },
            { name: "services/", type: "folder", description: "flights, tickets" },
            { name: "types/", type: "folder", description: "Tipos de vuelos" },
          ],
        },
        {
          name: "seats/",
          type: "folder",
          icon: Layout,
          description: "Selección de asientos",
          children: [
            { name: "components/", type: "folder", description: "seat-map, seat" },
            { name: "services/", type: "folder", description: "Servicios de asientos" },
            { name: "types/", type: "folder", description: "Tipos de asientos" },
          ],
        },
        {
          name: "shared/",
          type: "folder",
          icon: Code,
          description: "Componentes y utilidades compartidas",
          children: [
            { name: "components/", type: "folder", description: "header, footer, language-switcher" },
            { name: "hooks/", type: "folder", description: "use-toast" },
            { name: "services/", type: "folder", description: "api, api-routes" },
            { name: "types/", type: "folder", description: "Tipos compartidos" },
          ],
        },
      ],
    },
    {
      name: "i18n/",
      type: "folder",
      icon: Globe,
      description: "Internacionalización",
      badge: "es/en",
      color: "bg-pink-100 text-pink-800",
      children: [
        {
          name: "locales/",
          type: "folder",
          children: [
            { name: "en/", type: "folder", description: "Traducciones en inglés" },
            { name: "es/", type: "folder", description: "Traducciones en español" },
          ],
        },
        { name: "request.ts", type: "file", description: "Utilidades para peticiones con idioma" },
        { name: "routing.ts", type: "file", description: "Configuración de rutas con idiomas" },
      ],
    },
    {
      name: "lib/",
      type: "folder",
      icon: Code,
      description: "Utilidades y helpers",
      children: [
        { name: "auth-utils.ts", type: "file", description: "Utilidades de autenticación" },
        { name: "utils.ts", type: "file", description: "Funciones de utilidad general" },
      ],
    },
    {
      name: "schemas/",
      type: "folder",
      icon: Database,
      description: "Esquemas de validación con Zod",
      badge: "Zod",
      color: "bg-violet-100 text-violet-800",
      children: [{ name: "schemas.ts", type: "file", description: "Definición de esquemas para formularios" }],
    },
  ],
}

function TreeItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(level < 2)
  const hasChildren = node.children && node.children.length > 0
  const Icon = node.icon || (node.type === "folder" ? Folder : File)

  return (
    <div className="w-full">
      {hasChildren ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded-md text-left">
            {hasChildren && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            <Icon className="h-4 w-4 text-gray-600" />
            <span className="font-medium">{node.name}</span>
            {node.badge && (
              <Badge variant="secondary" className={`text-xs ${node.color || "bg-gray-100 text-gray-800"}`}>
                {node.badge}
              </Badge>
            )}
          </CollapsibleTrigger>
          {node.description && <p className="text-sm text-gray-600 ml-8 mb-2">{node.description}</p>}
          <CollapsibleContent>
            <div className="ml-6 border-l border-gray-200 pl-4">
              {node.children?.map((child, index) => (
                <TreeItem key={index} node={child} level={level + 1} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
          <div className="w-4" /> 
          <Icon className="h-4 w-4 text-gray-600" />
          <span className="font-medium">{node.name}</span>
          {node.badge && (
            <Badge variant="secondary" className={`text-xs ${node.color || "bg-gray-100 text-gray-800"}`}>
              {node.badge}
            </Badge>
          )}
          {node.description && <span className="text-sm text-gray-500 ml-2">- {node.description}</span>}
        </div>
      )}
    </div>
  )
}

export default function AirLinkProjectSchema() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Plane className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">AirLink Project Structure</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sistema de reservas de vuelos construido con Next.js 15, arquitectura modular y soporte multiidioma
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Estructura del Proyecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <TreeItem node={projectStructure} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tecnologías Clave
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-black text-white">Next.js 15</Badge>
                <span className="text-sm">App Router</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-600 text-white">TypeScript</Badge>
                <span className="text-sm">Type Safety</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600 text-white">Tailwind CSS</Badge>
                <span className="text-sm">Styling</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-600 text-white">shadcn/ui</Badge>
                <span className="text-sm">Components</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 text-white">Zod</Badge>
                <span className="text-sm">Validation</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600 text-white">i18n</Badge>
                <span className="text-sm">Multilingual</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Características
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>Soporte multiidioma (ES/EN)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Autenticación completa</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-purple-600" />
                <span>Sistema de reservas</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span>Gestión de pasajeros</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-red-600" />
                <span>Panel de administración</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-gray-600" />
                <span>Arquitectura modular</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Módulos Principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="p-2 bg-green-50 rounded">
                <strong>Auth:</strong> Login, registro, recuperación
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <strong>Booking:</strong> Proceso de reserva completo
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <strong>Flights:</strong> Búsqueda y selección
              </div>
              <div className="p-2 bg-orange-50 rounded">
                <strong>Seats:</strong> Selección de asientos
              </div>
              <div className="p-2 bg-cyan-50 rounded">
                <strong>Profile:</strong> Gestión de usuario
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
