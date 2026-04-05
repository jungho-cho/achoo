'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { DiaryEntry, Severity, SymptomId } from '../lib/diary';
import { SEVERITY_OPTIONS, SYMPTOMS, loadEntries, saveTodayEntry, today } from '../lib/diary';

interface Advice {
  emoji: string;
  title: string;
  desc: string;
  priority: number; // lower = higher priority
}

function generateAdvice(symptoms: SymptomId[], severity: Severity): Advice[] {
  const advices: Advice[] = [];

  const hasEye = symptoms.some((s) => s === 'itchy_eyes' || s === 'watery_eyes');
  const hasNose = symptoms.some((s) => s === 'sneeze' || s === 'runny_nose' || s === 'stuffy_nose');
  const hasThroat = symptoms.some((s) => s === 'cough' || s === 'itchy_throat');
  const hasSkin = symptoms.includes('skin_itch');
  const hasFatigue = symptoms.includes('fatigue') || symptoms.includes('headache');

  // Universal advice based on severity
  if (severity >= 2) {
    advices.push({
      emoji: '😷', title: 'KF94 마스크 착용',
      desc: '외출 시 반드시 보건용 마스크를 착용하세요. 일반 마스크는 꽃가루를 차단하지 못합니다.',
      priority: 1,
    });
  }
  if (severity >= 3) {
    advices.push({
      emoji: '🏠', title: '실내 활동 권장',
      desc: '증상이 심할 때는 가능하면 실내에 머무세요. 꽃가루 농도가 낮은 저녁에 외출하세요.',
      priority: 0,
    });
    advices.push({
      emoji: '💊', title: '항히스타민제 복용 고려',
      desc: '약국에서 구할 수 있는 항히스타민제가 도움이 됩니다. 외출 30분 전에 복용하면 효과적입니다.',
      priority: 2,
    });
  }

  // Eye-specific
  if (hasEye) {
    advices.push({
      emoji: '👁️', title: '인공눈물 사용',
      desc: '방부제 없는 인공눈물로 눈을 자주 씻어주세요. 눈을 비비면 증상이 악화됩니다.',
      priority: 3,
    });
    advices.push({
      emoji: '🕶️', title: '선글라스 착용',
      desc: '외출 시 선글라스를 쓰면 꽃가루가 직접 눈에 닿는 것을 줄일 수 있습니다.',
      priority: 5,
    });
  }

  // Nose-specific
  if (hasNose) {
    advices.push({
      emoji: '💧', title: '코 세척 (비강 세척)',
      desc: '생리식염수로 코를 세척하면 꽃가루를 물리적으로 제거할 수 있습니다. 하루 1-2회 권장.',
      priority: 3,
    });
    if (symptoms.includes('stuffy_nose')) {
      advices.push({
        emoji: '💨', title: '가습기 사용',
        desc: '실내 습도를 40-50%로 유지하면 코막힘이 완화됩니다. 너무 높으면 곰팡이 위험.',
        priority: 6,
      });
    }
  }

  // Throat-specific
  if (hasThroat) {
    advices.push({
      emoji: '🍯', title: '따뜻한 음료 섭취',
      desc: '따뜻한 물이나 꿀물이 목 자극을 완화합니다. 카페인은 탈수를 유발할 수 있으니 주의.',
      priority: 4,
    });
  }

  // Skin-specific
  if (hasSkin) {
    advices.push({
      emoji: '🚿', title: '귀가 후 즉시 샤워',
      desc: '외출 후 바로 샤워하고 옷을 갈아입으세요. 꽃가루가 피부와 옷에 남아있습니다.',
      priority: 3,
    });
  }

  // Fatigue
  if (hasFatigue) {
    advices.push({
      emoji: '😴', title: '충분한 수면',
      desc: '알레르기는 수면의 질을 떨어뜨립니다. 취침 전 항히스타민제가 도움이 될 수 있습니다.',
      priority: 5,
    });
  }

  // General always-applicable
  advices.push({
    emoji: '🪟', title: '환기 시간 조절',
    desc: '꽃가루가 적은 시간(저녁~새벽)에 환기하세요. 오전 6~10시는 꽃가루 농도가 가장 높습니다.',
    priority: 7,
  });
  advices.push({
    emoji: '👕', title: '외출복 관리',
    desc: '귀가 후 외출복은 바로 세탁하거나 현관에 보관하세요. 침실에 가져가지 마세요.',
    priority: 8,
  });

  return advices.sort((a, b) => a.priority - b.priority);
}

export function SymptomChecker() {
  const t = useTranslations('ui');
  const [step, setStep] = useState<'symptoms' | 'severity' | 'result'>('symptoms');
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomId[]>([]);
  const [severity, setSeverity] = useState<Severity>(2);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    // Restore today's entry if exists
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
      // Save to diary
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

  const advices = generateAdvice(selectedSymptoms, severity);

  if (step === 'symptoms') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">어떤 증상이 있나요?</h2>
          <p className="text-xs text-gray-400 mt-1">해당하는 증상을 모두 선택하세요</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {SYMPTOMS.map((s) => {
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
                <span>{s.label}</span>
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
          다음 →
        </button>
      </div>
    );
  }

  if (step === 'severity') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">얼마나 심한가요?</h2>
          <p className="text-xs text-gray-400 mt-1">
            선택한 증상: {selectedSymptoms.map((id) => SYMPTOMS.find((s) => s.id === id)?.label).join(', ')}
          </p>
        </div>

        <div className="flex justify-between gap-1">
          {SEVERITY_OPTIONS.filter((o) => o.value > 0).map((opt) => {
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
                <span className="text-[11px] text-gray-500">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setStep('symptoms')}
            className="px-4 py-3 rounded-xl text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            ← 이전
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            맞춤 조언 보기
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
            <h2 className="text-base font-semibold text-gray-900">맞춤 알레르기 대처법</h2>
            <p className="text-xs text-gray-400 mt-1">
              {selectedSymptoms.map((id) => SYMPTOMS.find((s) => s.id === id)?.emoji).join(' ')}
              {' · '}
              {SEVERITY_OPTIONS.find((o) => o.value === severity)?.label}
            </p>
          </div>
          {saved && (
            <span className="text-[10px] text-green-500 bg-green-50 px-2 py-1 rounded-full">
              일기에 기록됨
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
                  <p className="text-sm font-medium text-gray-800">{advice.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{advice.desc}</p>
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
        다시 체크하기
      </button>
    </div>
  );
}
