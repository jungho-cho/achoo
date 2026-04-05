'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PollenResponse, DustResponse, PollenLevel, DustLevel } from '@repo/shared-types';
import type { DiaryEntry, Severity, SymptomId } from '../lib/diary';
import { SYMPTOM_IDS, SEVERITY_IDS, loadEntries, saveTodayEntry, today } from '../lib/diary';

interface SymptomCheckerProps {
  pollen?: PollenResponse | null;
  dust?: DustResponse | null;
}

interface Advice {
  emoji: string;
  titleKey: string;
  descKey: string;
  priority: number;
  context?: string; // dynamic context like "오늘 나무 꽃가루 높음"
}

function getPollenContext(pollen: PollenResponse | null | undefined, t: (key: string) => string): string | null {
  if (!pollen) return null;
  const dominated = pollen.current.readings.reduce((a, b) =>
    a.numericValue >= b.numericValue ? a : b,
  );
  if (dominated.level === 'low') return null;
  const species = t(`species.${dominated.species}`);
  const level = t(`pollenLevel.${dominated.level}`);
  return `${species} ${level}`;
}

function getDustContext(dust: DustResponse | null | undefined, t: (key: string) => string): string | null {
  if (!dust) return null;
  if (dust.current.level === 'good') return null;
  const level = t(`dustLevel.${dust.current.level}`);
  return `${t('dust.title')} ${level}`;
}

function generateAdvice(
  symptoms: SymptomId[],
  severity: Severity,
  pollen: PollenResponse | null | undefined,
  dust: DustResponse | null | undefined,
): Advice[] {
  const advices: Advice[] = [];

  const hasEye = symptoms.some((s) => s === 'itchy_eyes' || s === 'watery_eyes');
  const hasNose = symptoms.some((s) => s === 'sneeze' || s === 'runny_nose' || s === 'stuffy_nose');
  const hasThroat = symptoms.some((s) => s === 'cough' || s === 'itchy_throat');
  const hasSkin = symptoms.includes('skin_itch');
  const hasFatigue = symptoms.includes('fatigue') || symptoms.includes('headache');

  // Check real-time data
  const pollenHigh = pollen?.current.overallLevel === 'high' || pollen?.current.overallLevel === 'very-high';
  const dustBad = dust?.current.level === 'bad' || dust?.current.level === 'very-bad';

  // Data-driven urgent advice
  if (pollenHigh && severity >= 2) {
    advices.push({
      emoji: '🚨', titleKey: 'checker.advice.pollenAlert.title',
      descKey: 'checker.advice.pollenAlert.desc', priority: -1,
    });
  }
  if (dustBad) {
    advices.push({
      emoji: '🏭', titleKey: 'checker.advice.dustAlert.title',
      descKey: 'checker.advice.dustAlert.desc', priority: -1,
    });
  }

  // Severity-based
  if (severity >= 2) {
    advices.push({ emoji: '😷', titleKey: 'checker.advice.mask.title', descKey: 'checker.advice.mask.desc', priority: 1 });
  }
  if (severity >= 3) {
    advices.push({ emoji: '🏠', titleKey: 'checker.advice.stayIndoor.title', descKey: 'checker.advice.stayIndoor.desc', priority: 0 });
    advices.push({ emoji: '💊', titleKey: 'checker.advice.medicine.title', descKey: 'checker.advice.medicine.desc', priority: 2 });
  }

  if (hasEye) {
    advices.push({ emoji: '👁️', titleKey: 'checker.advice.eyeDrops.title', descKey: 'checker.advice.eyeDrops.desc', priority: 3 });
    advices.push({ emoji: '🕶️', titleKey: 'checker.advice.sunglasses.title', descKey: 'checker.advice.sunglasses.desc', priority: 5 });
  }
  if (hasNose) {
    advices.push({ emoji: '💧', titleKey: 'checker.advice.nasalRinse.title', descKey: 'checker.advice.nasalRinse.desc', priority: 3 });
    if (symptoms.includes('stuffy_nose')) {
      advices.push({ emoji: '💨', titleKey: 'checker.advice.humidifier.title', descKey: 'checker.advice.humidifier.desc', priority: 6 });
    }
  }
  if (hasThroat) {
    advices.push({ emoji: '🍯', titleKey: 'checker.advice.warmDrink.title', descKey: 'checker.advice.warmDrink.desc', priority: 4 });
  }
  if (hasSkin) {
    advices.push({ emoji: '🚿', titleKey: 'checker.advice.shower.title', descKey: 'checker.advice.shower.desc', priority: 3 });
  }
  if (hasFatigue) {
    advices.push({ emoji: '😴', titleKey: 'checker.advice.sleep.title', descKey: 'checker.advice.sleep.desc', priority: 5 });
  }

  advices.push({ emoji: '🪟', titleKey: 'checker.advice.ventilation.title', descKey: 'checker.advice.ventilation.desc', priority: 7 });
  advices.push({ emoji: '👕', titleKey: 'checker.advice.clothes.title', descKey: 'checker.advice.clothes.desc', priority: 8 });

  return advices.sort((a, b) => a.priority - b.priority);
}

export function SymptomChecker({ pollen, dust }: SymptomCheckerProps) {
  const t = useTranslations('ui');
  const [step, setStep] = useState<'symptoms' | 'severity' | 'result'>('symptoms');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomId[]>([]);
  const [severity, setSeverity] = useState<Severity>(2);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    const todayEntry = loadEntries().find((e) => e.date === today());
    if (todayEntry && todayEntry.symptoms.length > 0) {
      setSelectedSymptoms(todayEntry.symptoms);
      setSeverity(todayEntry.severity);
      setStep('result');
    }
  }, []);

  const toggleSymptom = useCallback((id: SymptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }, []);

  const handleNext = useCallback(() => {
    if (step === 'symptoms' && selectedSymptoms.length > 0) {
      setStep('severity');
    } else if (step === 'severity') {
      const updated = saveTodayEntry(entries, severity, selectedSymptoms);
      setEntries(updated);
      setSaved(true);
      setStep('result');
    }
  }, [step, selectedSymptoms, severity, entries]);

  const handleReset = useCallback(() => {
    setSelectedSymptoms([]);
    setSeverity(2);
    setStep('symptoms');
    setSaved(false);
  }, []);

  const advices = generateAdvice(selectedSymptoms, severity, pollen, dust);
  const pollenContext = getPollenContext(pollen, (key: string) => t(key as any));
  const dustContext = getDustContext(dust, (key: string) => t(key as any));
  const contextLabel = [pollenContext, dustContext].filter(Boolean).join(' · ');

  if (step === 'symptoms') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{t('checker.symptomQuestion')}</h2>
          <p className="text-xs text-gray-400 mt-1">{t('checker.symptomHint')}</p>
          {contextLabel && (
            <p className="text-xs text-orange-500 mt-1 font-medium">{t('checker.todayCondition')}: {contextLabel}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SYMPTOM_IDS.map((s) => {
            const selected = selectedSymptoms.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSymptom(s.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  selected
                    ? 'bg-green-50 border-2 border-green-400 text-green-700'
                    : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{s.emoji}</span>
                <span>{t(s.i18nKey as any)}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedSymptoms.length === 0}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
            selectedSymptoms.length > 0
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {t('checker.next')}
        </button>
      </div>
    );
  }

  if (step === 'severity') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{t('checker.severityQuestion')}</h2>
          <p className="text-xs text-gray-400 mt-1">
            {selectedSymptoms.map((id) => {
              const sym = SYMPTOM_IDS.find((s) => s.id === id);
              return sym ? t(sym.i18nKey as any) : id;
            }).join(', ')}
          </p>
        </div>

        <div className="flex justify-between gap-1">
          {SEVERITY_IDS.filter((o) => o.value > 0).map((opt) => {
            const isSelected = severity === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSeverity(opt.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-green-50 border-2 border-green-400'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-[11px] text-gray-500">{t(opt.i18nKey as any)}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStep('symptoms')}
            className="px-4 py-3 rounded-xl text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {t('checker.prev')}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            {t('checker.getAdvice')}
          </button>
        </div>
      </div>
    );
  }

  // Result
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{t('checker.resultTitle')}</h2>
            <p className="text-xs text-gray-400 mt-1">
              {selectedSymptoms.map((id) => SYMPTOM_IDS.find((s) => s.id === id)?.emoji).join(' ')}
              {' · '}
              {t(SEVERITY_IDS.find((o) => o.value === severity)?.i18nKey as any ?? 'severity.moderate')}
              {contextLabel && <span className="text-orange-500"> · {contextLabel}</span>}
            </p>
          </div>
          {saved && (
            <span className="text-[10px] text-green-500 bg-green-50 px-2 py-1 rounded-full">
              {t('checker.savedToDiary')}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {advices.map((advice, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl ${i === 0 ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50'}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg mt-0.5">{advice.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t(advice.titleKey as any)}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t(advice.descKey as any)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full py-2.5 rounded-xl text-sm text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {t('checker.reset')}
      </button>
    </div>
  );
}
