import { fetchPollenOpenMeteo } from '@repo/api-client';
import type { PollenResponse } from '@repo/shared-types';
import { setRequestLocale } from 'next-intl/server';
import { HomeClient } from '../../components/HomeClient';

export const dynamic = 'force-dynamic';

const LOCALE_DEFAULTS: Record<string, { lat: number; lng: number; city: string }> = {
  ko: { lat: 37.5665, lng: 126.978, city: '서울' },
  de: { lat: 52.52, lng: 13.405, city: 'Berlin' },
  en: { lat: 51.5074, lng: -0.1278, city: 'London' },
  fr: { lat: 48.8566, lng: 2.3522, city: 'Paris' },
};

async function getDefaultPollen(locale: string): Promise<PollenResponse | null> {
  const defaults = LOCALE_DEFAULTS[locale] ?? LOCALE_DEFAULTS.en!;
  try {
    return await fetchPollenOpenMeteo(defaults.lat, defaults.lng);
  } catch {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ssrPollen = await getDefaultPollen(locale);

  return <HomeClient ssrPollen={ssrPollen} />;
}
