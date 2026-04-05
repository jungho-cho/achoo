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
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
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
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[140px]">
            {LOCALES.map((l) => (
              <a
                key={l.code}
                href={`/${l.code}${route}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  l.code === locale ? 'text-green-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {l.code === locale && <span className="ml-auto text-green-500 text-xs">✓</span>}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
