import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const ui = (await import(`../messages/${locale}/ui.json`)).default;

  // Load all page content JSONs
  const [
    pollenInfo, allergyTypes, seasonalCalendar, preventionGuide,
    dustGuide, faq, tips, privacy,
  ] = await Promise.all([
    import(`../messages/${locale}/pages/pollen-info.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/pages/allergy-types.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/pages/seasonal-calendar.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/pages/prevention-guide.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/pages/dust-guide.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/pages/faq.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/pages/tips.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${locale}/pages/privacy.json`).then((m) => m.default).catch(() => ({})),
  ]);

  return {
    locale,
    messages: {
      ui,
      pages: { pollenInfo, allergyTypes, seasonalCalendar, preventionGuide, dustGuide, faq, tips, privacy },
    },
  };
});
