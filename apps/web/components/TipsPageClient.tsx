'use client';

import { AffiliateLinks } from './AffiliateLinks';
import { SymptomChecker } from './SymptomChecker';
import { usePollenData } from '../hooks/usePollenData';

export function TipsPageClient() {
  const { pollen, dust } = usePollenData();

  return (
    <div className="space-y-5">
      <SymptomChecker pollen={pollen} dust={dust} />
      <AffiliateLinks />
    </div>
  );
}
