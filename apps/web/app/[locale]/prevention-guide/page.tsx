import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.preventionGuide' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PreventionGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.preventionGuide');
  const tUI = await getTranslations('ui');

  const sections = t.raw('sections') as Array<{ heading: string; tips: string[] }>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href={`/${locale}`} className="text-gray-400 hover:text-gray-600 text-sm">&larr; {tUI('nav.home')}</a>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed">

          {sections.map((s, i) => (
            <section key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{s.heading}</h2>
              <ul className="space-y-2">
                {s.tips.map((tip, j) => (
                  <li key={j}>{tip}</li>
                ))}
              </ul>
            </section>
          ))}

        </article>

        <div className="flex gap-3 pt-4">
          <a href={`/${locale}`} className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            {tUI('pollen.title')}
          </a>
          <a href={`/${locale}/seasonal-calendar`} className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {tUI('nav.seasonalCalendar')}
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">{tUI('metadata.title')}</p>
      </div>
    </div>
  );
}
