import { fetchPollenOpenMeteo } from '@repo/api-client';
import type { PollenResponse } from '@repo/shared-types';
import { HomeClient } from '../components/HomeClient';

// Seoul default for SSR — gives search engines real content to index
const SEOUL = { lat: 37.5665, lng: 126.978 };

async function getDefaultPollen(): Promise<PollenResponse | null> {
  try {
    return await fetchPollenOpenMeteo(SEOUL.lat, SEOUL.lng);
  } catch {
    return null;
  }
}

export default async function Page() {
  const ssrPollen = await getDefaultPollen();

  return <HomeClient ssrPollen={ssrPollen} />;
}
