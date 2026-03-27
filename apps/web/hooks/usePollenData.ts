'use client';

import type { DustResponse, PollenResponse } from '@repo/shared-types';
import { useEffect, useState } from 'react';

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

  // Step 1: get geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      setLocationDenied(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
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

    Promise.all([
      fetch(`/api/pollen?lat=${location.lat}&lng=${location.lng}`, {
        signal: controller.signal,
      }).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/dust?lat=${location.lat}&lng=${location.lng}`, {
        signal: controller.signal,
      }).then((r) => (r.ok ? r.json() : null)),
    ])
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

  return { pollen, dust, location, loading, loadingPhase, error, locationDenied };
}
