'use client';

import type { DustResponse, PollenResponse } from '@repo/shared-types';
import { useEffect, useState } from 'react';
import { isInKorea } from '../lib/sido';

interface Location {
  lat: number;
  lng: number;
}

interface UsePollenDataResult {
  pollen: PollenResponse | null;
  dust: DustResponse | null;
  location: Location | null;
  loading: boolean;
  loadingPhase: 'location' | 'data' | null;
  error: string | null;
  locationDenied: boolean;
  inKorea: boolean;
  cityName: string | null;
}

const DEFAULT_LOCATION: Location = { lat: 37.5665, lng: 126.978 }; // 서울

export function usePollenData(): UsePollenDataResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [pollen, setPollen] = useState<PollenResponse | null>(null);
  const [dust, setDust] = useState<DustResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPhase, setLoadingPhase] = useState<'location' | 'data' | null>('location');
  const [error, setError] = useState<string | null>(null);
  const [locationDenied, setLocationDenied] = useState(false);
  const [inKorea, setInKorea] = useState(true);
  const [cityName, setCityName] = useState<string | null>(null);

  // Step 1: get geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      setLocationDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        const korea = isInKorea(loc.lat, loc.lng);
        setInKorea(korea);
        // Reverse geocode for non-Korean locations
        if (!korea) {
          const lang = typeof document !== 'undefined' ? document.documentElement.lang || 'en' : 'en';
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json&accept-language=${lang}&zoom=10`, {
            headers: { 'User-Agent': 'Achoo/1.0 (achoo.day)' },
          })
            .then((r) => r.json())
            .then((data) => {
              const addr = data?.address;
              const city = addr?.city || addr?.town || addr?.village || addr?.state || '';
              setCityName(city || null);
            })
            .catch(() => {});
        }
      },
      () => {
        setLocation(DEFAULT_LOCATION);
        setLocationDenied(true);
      },
      { timeout: 5000, maximumAge: 60000 },
    );
  }, []);

  // Step 2: fetch data once location is known
  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();
    setLoading(true);
    setLoadingPhase('data');
    setError(null);

    const korea = isInKorea(location.lat, location.lng);

    // Always fetch pollen (Open-Meteo is global)
    const pollenFetch = fetch(`/api/pollen?lat=${location.lat}&lng=${location.lng}`, {
      signal: controller.signal,
    }).then((r) => (r.ok ? r.json() : null));

    // Fetch dust globally (Korea: AirKorea, overseas: Open-Meteo)
    const dustFetch = fetch(`/api/dust?lat=${location.lat}&lng=${location.lng}`, {
      signal: controller.signal,
    }).then((r) => (r.ok ? r.json() : null));

    Promise.all([pollenFetch, dustFetch])
      .then(([pollenData, dustData]) => {
        setPollen(pollenData as PollenResponse | null);
        setDust(dustData as DustResponse | null);
      })
      .catch((err) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('데이터를 불러올 수 없습니다.');
        }
      })
      .finally(() => {
        setLoading(false);
        setLoadingPhase(null);
      });

    return () => controller.abort();
  }, [location]);

  return { pollen, dust, location, loading, loadingPhase, error, locationDenied, inKorea, cityName };
}
