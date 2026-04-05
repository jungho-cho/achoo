import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.dustGuide' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

function gradeColor(grade: string) {
  switch (grade) {
    case '좋음': return 'text-green-600';
    case '보통': return 'text-yellow-600';
    case '나쁨': return 'text-orange-600';
    case '매우나쁨': return 'text-red-600';
    default: return 'text-gray-600';
  }
}

export default async function DustGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.dustGuide');
  const tUI = await getTranslations('ui');

  const sections = t.raw('sections') as Array<{ heading: string; content: string }>;
  const grades = t.raw('grades') as Array<{ grade: string; pm25: string; pm10: string; health: string }>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href={`/${locale}`} className="text-gray-400 hover:text-gray-600 text-sm">&larr; {tUI('nav.home')}</a>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed">

          {/* First section before grades table */}
          {sections.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{sections[0].heading}</h2>
              <p>{sections[0].content}</p>
            </section>
          )}

          {/* Grades table */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('title')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4">{grades.length > 0 ? '' : ''}</th>
                    <th className="text-left py-2 pr-4">PM10</th>
                    <th className="text-left py-2 pr-4">PM2.5</th>
                    <th className="text-left py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grades.map((g, i) => (
                    <tr key={i}>
                      <td className={`py-2 pr-4 font-medium ${gradeColor(g.grade)}`}>{g.grade}</td>
                      <td className="py-2 pr-4">{g.pm10}</td>
                      <td className="py-2 pr-4">{g.pm25}</td>
                      <td className="py-2">{g.health}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2">ug/m3</p>
          </section>

          {/* Remaining sections */}
          {sections.slice(1).map((s, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{s.heading}</h2>
              <p>{s.content}</p>
            </section>
          ))}

        </article>

        <div className="flex gap-3 pt-4">
          <a href={`/${locale}`} className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            {tUI('dust.title')}
          </a>
          <a href={`/${locale}/prevention-guide`} className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            {tUI('nav.preventionGuide')}
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">{tUI('metadata.title')}</p>
      </div>
    </div>
  );
}
