import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.privacy' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pages.privacy');
  const tUI = await getTranslations('ui');

  const sections = t.raw('sections') as Array<{ heading: string; content: string }>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        <div className="flex items-center gap-4">
          <a href={`/${locale}`} className="text-gray-400 hover:text-gray-600 text-sm">&larr; {tUI('nav.home')}</a>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        <article className="space-y-6 text-gray-700 leading-relaxed text-sm">

          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{i + 1}. {s.heading}</h2>
              <p>{s.content}</p>
            </section>
          ))}

        </article>

        <div className="flex gap-3 pt-4">
          <a href={`/${locale}`} className="px-4 py-2 text-sm rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors">
            {tUI('nav.home')}
          </a>
        </div>

        <p className="text-center text-xs text-gray-300 pb-4">{tUI('metadata.title')}</p>
      </div>
    </div>
  );
}
