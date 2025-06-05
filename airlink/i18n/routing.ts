import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const locales = ['en', 'es'] as const;
export const localePrefix = 'as-needed';

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix
});

export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
