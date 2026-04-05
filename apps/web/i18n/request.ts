import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load UI messages
  const ui = (await import(`../messages/${locale}/ui.json`)).default;

  return {
    locale,
    messages: { ui },
  };
});
