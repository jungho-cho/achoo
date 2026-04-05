import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.seasonalCalendar' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

function levelColor(level: string) {
  switch (level) {
    case '매우높음': return 'bg-red-50 text-red-700';
    case '높음': return 'bg-orange-50 text-orange-700';
    case '보통': return 'bg-yellow-50 text-yellow-700';
    case '낮음': return 'bg-green-50 text-green-700';
    default: return 'bg-gray-50 text-gray-400';
  }
}

export default async function SeasonalCalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.seasonalCalendar');
  const tUI = await getTranslations('ui');

  const months = t.raw('months') as Array<{ month: string; level: string; species: string; tip: string }>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href={`/${locale}`} className="text-gray-400 hover:text-gray-600 text-sm">&larr; {tUI('nav.home')}</a>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        <p className="text-gray-600">{t('description')}</p>

        <div className="space-y-3">
          {months.map((m) => (
            <div key={m.month} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{m.month}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(m.level)}`}>
                  {m.level}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">{m.species}</p>
              <p className="text-sm text-gray-600">{m.tip}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <a href={`/${locale}`} className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            {tUI('pollen.title')}
          </a>
          <a href={`/${locale}/allergy-types`} className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {tUI('nav.allergyTypes')}
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">{tUI('metadata.title')}</p>
      </div>
    </div>
  );
}
