"use client";

import { AffiliateLinks } from "./AffiliateLinks";
import { SymptomChecker } from "./SymptomChecker";
import { usePollenData } from "../hooks/usePollenData";

export function TipsPageClient({ locale }: { locale: string }) {
  const { pollen, dust } = usePollenData(locale);

  return (
    <div className="space-y-5">
      <SymptomChecker pollen={pollen} dust={dust} />
      <AffiliateLinks />
    </div>
  );
}
