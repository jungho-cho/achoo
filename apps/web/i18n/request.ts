import { getRequestConfig } from 'next-intl/server';
import { hasLocale, routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const resolvedLocale = locale && hasLocale(locale) ? locale : routing.defaultLocale;

  const ui = (await import(`../messages/${resolvedLocale}/ui.json`)).default;

  // Load all page content JSONs
  const [
    pollenInfo, allergyTypes, seasonalCalendar, preventionGuide,
    dustGuide, faq, tips, privacy,
  ] = await Promise.all([
    import(`../messages/${resolvedLocale}/pages/pollen-info.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${resolvedLocale}/pages/allergy-types.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${resolvedLocale}/pages/seasonal-calendar.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${resolvedLocale}/pages/prevention-guide.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${resolvedLocale}/pages/dust-guide.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${resolvedLocale}/pages/faq.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${resolvedLocale}/pages/tips.json`).then((m) => m.default).catch(() => ({})),
    import(`../messages/${resolvedLocale}/pages/privacy.json`).then((m) => m.default).catch(() => ({})),
  ]);

  return {
    locale: resolvedLocale,
    messages: {
      ui,
      pages: { pollenInfo, allergyTypes, seasonalCalendar, preventionGuide, dustGuide, faq, tips, privacy },
    },
  };
});
