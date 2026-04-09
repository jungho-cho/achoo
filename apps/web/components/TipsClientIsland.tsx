"use client";

import { TipsPageClient } from "./TipsPageClient";

export function TipsClientIsland({ locale }: { locale: string }) {
  return <TipsPageClient locale={locale} />;
}
