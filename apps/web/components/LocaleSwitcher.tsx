'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const LOCALES = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]!;

  // Strip current locale prefix from pathname to get the route
  const route = pathname.replace(`/${locale}`, '') || '/';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
        aria-label={`Language: ${current.label}`}
        aria-expanded={open}
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <span className="text-[10px]">▼</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
            {LOCALES.map((l) => (
              <a
                key={l.code}
                href={`/${l.code}${route}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                  l.code === locale ? 'font-medium text-green-700' : 'text-gray-700'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {l.code === locale && <span className="ml-auto text-xs text-green-600">✓</span>}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
