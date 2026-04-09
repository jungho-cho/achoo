import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["ko", "de", "en", "fr"],
  defaultLocale: "ko",
  localePrefix: "always",
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

export function hasLocale(locale: string): locale is AppLocale {
  return routing.locales.includes(locale as AppLocale);
}

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
