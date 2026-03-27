/**
 * Shared diary types and localStorage utilities.
 * Used by SymptomDiary (home) and SymptomChecker (tips).
 */

export type Severity = 0 | 1 | 2 | 3 | 4;

export type SymptomId =
  | 'sneeze'
  | 'runny_nose'
  | 'stuffy_nose'
  | 'itchy_eyes'
  | 'watery_eyes'
  | 'cough'
  | 'itchy_throat'
  | 'skin_itch'
  | 'fatigue'
  | 'headache';

export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  severity: Severity;
  symptoms: SymptomId[];
  note: string;
  timestamp: string;
}

export const SYMPTOMS: { id: SymptomId; emoji: string; label: string }[] = [
  { id: 'sneeze', emoji: '🤧', label: '재채기' },
  { id: 'runny_nose', emoji: '💧', label: '콧물' },
  { id: 'stuffy_nose', emoji: '👃', label: '코막힘' },
  { id: 'itchy_eyes', emoji: '👁️', label: '눈 가려움' },
  { id: 'watery_eyes', emoji: '😢', label: '눈물' },
  { id: 'cough', emoji: '😮‍💨', label: '기침' },
  { id: 'itchy_throat', emoji: '🫁', label: '목 가려움' },
  { id: 'skin_itch', emoji: '🤚', label: '피부 가려움' },
  { id: 'fatigue', emoji: '😴', label: '피로감' },
  { id: 'headache', emoji: '🤕', label: '두통' },
];

export const SEVERITY_OPTIONS: { value: Severity; emoji: string; label: string }[] = [
  { value: 0, emoji: '😊', label: '괜찮아요' },
  { value: 1, emoji: '🤏', label: '조금' },
  { value: 2, emoji: '😷', label: '보통' },
  { value: 3, emoji: '🤧', label: '심해요' },
  { value: 4, emoji: '😵', label: '매우 심해요' },
];

const STORAGE_KEY = 'achoo_diary';

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadEntries(): DiaryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries = raw ? JSON.parse(raw) : [];
    // Migrate old entries without symptoms field
    return entries.map((e: DiaryEntry & { symptoms?: SymptomId[] }) => ({
      ...e,
      symptoms: e.symptoms ?? [],
    }));
  } catch {
    return [];
  }
}

export function saveEntries(entries: DiaryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function saveTodayEntry(
  entries: DiaryEntry[],
  severity: Severity,
  symptoms: SymptomId[],
): DiaryEntry[] {
  const updated = entries.filter((e) => e.date !== today());
  updated.push({
    date: today(),
    severity,
    symptoms,
    note: '',
    timestamp: new Date().toISOString(),
  });
  saveEntries(updated);
  return updated;
}
