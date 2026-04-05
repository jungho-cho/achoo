import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ko', 'de', 'en', 'fr'],
  defaultLocale: 'ko',
  localePrefix: 'always',
});
