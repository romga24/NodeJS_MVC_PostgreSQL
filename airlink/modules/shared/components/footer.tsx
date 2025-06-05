"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react"

export function Footer() {
  const t = useTranslations()
  const tFooter = useTranslations("footer")
  const pathname = usePathname()
  const currentLocale = pathname.startsWith("/en") ? "en" : "es"

  return (
    <footer className="bg-sky-950 text-white py-4 md:py-6 border-t">
      <div className="container mx-auto px-4">
        {/* Versión móvil - Elementos apilados */}
        <div className="flex flex-col space-y-6 md:hidden">
          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-base font-bold mb-2 text-center">{tFooter("quickLinks")}</h3>
            <div className="flex justify-center space-x-4 text-center">
              <Link href={`/${currentLocale}/privacy`} className="text-sm hover:underline">
                {tFooter("privacy")}
              </Link>
              <Link href={`/${currentLocale}/terms`} className="text-sm hover:underline">
                {tFooter("terms")}
              </Link>
              <Link href={`/${currentLocale}/faq`} className="text-sm hover:underline">
                {tFooter("faq")}
              </Link>
            </div>
          </div>

          {/* Redes sociales */}
          <div>
            <h3 className="text-base font-bold mb-2 text-center">{tFooter("socialMedia")}</h3>
            <div className="flex justify-center space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:text-blue-400 transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:text-blue-400 transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-blue-400 transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 hover:text-blue-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="text-center">
            <h3 className="text-base font-bold mb-2">{tFooter("contactInfo")}</h3>
            <div className="flex flex-col items-center space-y-2 text-sm">
              <a href="mailto:contacto@airlink.com" className="flex items-center hover:text-blue-300">
                <Mail className="h-4 w-4 mr-1" />
                contacto@airlink.com
              </a>
              <a href="tel:+34678323040" className="flex items-center hover:text-blue-300">
                <Phone className="h-4 w-4 mr-1" />
                +34 678-323-040
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-800">
            © {new Date().getFullYear()} AirLink. {tFooter("allRightsReserved")}
          </div>
        </div>

        {/* Versión desktop - Grid de 3 columnas */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">{tFooter("quickLinks")}</h3>
            <p className="mb-2">{tFooter("quickLinksDescription")}</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>
                <Link href={`/${currentLocale}/privacy`} className="hover:underline">
                  {tFooter("privacy")}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/terms`} className="hover:underline">
                  {tFooter("terms")}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/faq`} className="hover:underline">
                  {tFooter("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-bold mb-2">{tFooter("socialMedia")}</h3>
            <p className="mb-2">{tFooter("socialMediaDescription")}</p>
            <ul className="space-y-1 list-disc pl-5">
              <li className="flex items-center">
                <Facebook className="h-4 w-4 mr-2" />
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li className="flex items-center">
                <Twitter className="h-4 w-4 mr-2" />
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Twitter
                </a>
              </li>
              <li className="flex items-center">
                <Instagram className="h-4 w-4 mr-2" />
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li className="flex items-center">
                <Linkedin className="h-4 w-4 mr-2" />
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div>
            <h3 className="text-lg font-bold mb-2">{tFooter("contactInfo")}</h3>
            <p className="mb-2">{tFooter("contactDescription")}</p>
            <ul className="space-y-1 list-disc pl-5">
              <li>
                <span className="font-medium">{tFooter("email")}: </span>
                <a href="mailto:contacto@airlink.com" className="hover:underline">
                  contacto@airlink.com
                </a>
              </li>
              <li>
                <span className="font-medium">{tFooter("phone")}: </span>
                <a href="tel:+34678323040" className="hover:underline">
                  +34 678-323-040
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright para desktop */}
        <div className="hidden md:block text-center text-sm text-gray-400 mt-8 pt-4 border-t border-gray-800">
          © {new Date().getFullYear()} AirLink. {tFooter("allRightsReserved")}
        </div>
      </div>
    </footer>
  )
}
