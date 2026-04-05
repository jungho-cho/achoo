'use client';

import { useTranslations } from 'next-intl';
import { AffiliateLinks } from '../../../components/AffiliateLinks';
import { SymptomChecker } from '../../../components/SymptomChecker';
import { usePollenData } from '../../../hooks/usePollenData';
import { Link } from '../../../i18n/routing';

export default function TipsPage() {
  const t = useTranslations('ui');
  const { pollen, dust } = usePollenData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md md:max-w-2xl mx-auto px-4 py-6 space-y-6">

        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← {t('nav.home')}</Link>
          <h1 className="text-xl font-bold text-gray-900">{t('nav.tips')}</h1>
        </div>

        {/* Interactive symptom checker with live data */}
        <SymptomChecker pollen={pollen} dust={dust} />

        {/* Affiliate links */}
        <AffiliateLinks />

        <p className="text-center text-xs text-gray-300 pb-4">
          {t('metadata.title')}
        </p>
      </div>
    </div>
  );
}
