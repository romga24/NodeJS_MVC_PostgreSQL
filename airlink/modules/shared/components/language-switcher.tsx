"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useRouter, usePathname } from '@/i18n/routing';
import { useEffect, useState } from "react";

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

const languages: { code: Locale; name: string }[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
];

function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LanguageSwitcher");

  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const changeLanguage = (lng: Locale) => {
		router.push(pathname, { locale: lng });
		setTimeout(() => router.refresh(), 100); 
	};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent shadow-none space-x-0 w-20">
          <Globe />
          <span className="ml-2">{currentLocale.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="!w-20 !min-w-[5rem] !max-w-[5rem] text-center"
        style={{ width: "5rem", minWidth: "5rem", maxWidth: "5rem" }}
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="text-center"
          >
            {lang.code.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
