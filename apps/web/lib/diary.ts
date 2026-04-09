/**
 * Shared diary types and localStorage utilities.
 * Used by SymptomDiary (home) and SymptomChecker (tips).
 */

export type Severity = 0 | 1 | 2 | 3 | 4;

export type SymptomId =
  | "sneeze"
  | "runny_nose"
  | "stuffy_nose"
  | "itchy_eyes"
  | "watery_eyes"
  | "cough"
  | "itchy_throat"
  | "skin_itch"
  | "fatigue"
  | "headache";

export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  severity: Severity;
  symptoms: SymptomId[];
  note: string;
  timestamp: string;
}

export type SymptomMessageKey =
  | "symptoms.sneeze"
  | "symptoms.runnyNose"
  | "symptoms.stuffyNose"
  | "symptoms.itchyEyes"
  | "symptoms.wateryEyes"
  | "symptoms.cough"
  | "symptoms.itchyThroat"
  | "symptoms.skinItch"
  | "symptoms.fatigue"
  | "symptoms.headache";

export type SeverityMessageKey =
  | "severity.fine"
  | "severity.mild"
  | "severity.moderate"
  | "severity.severe"
  | "severity.verySevere";

// Symptom definitions — labels resolved via i18n at render time
export const SYMPTOM_IDS: { id: SymptomId; emoji: string; i18nKey: SymptomMessageKey }[] =
  [
    { id: "sneeze", emoji: "🤧", i18nKey: "symptoms.sneeze" },
    { id: "runny_nose", emoji: "💧", i18nKey: "symptoms.runnyNose" },
    { id: "stuffy_nose", emoji: "👃", i18nKey: "symptoms.stuffyNose" },
    { id: "itchy_eyes", emoji: "👁️", i18nKey: "symptoms.itchyEyes" },
    { id: "watery_eyes", emoji: "😢", i18nKey: "symptoms.wateryEyes" },
    { id: "cough", emoji: "😮‍💨", i18nKey: "symptoms.cough" },
    { id: "itchy_throat", emoji: "🫁", i18nKey: "symptoms.itchyThroat" },
    { id: "skin_itch", emoji: "🤚", i18nKey: "symptoms.skinItch" },
    { id: "fatigue", emoji: "😴", i18nKey: "symptoms.fatigue" },
    { id: "headache", emoji: "🤕", i18nKey: "symptoms.headache" },
  ];

// Keep old SYMPTOMS export for backward compat (used in SymptomDiary)
export const SYMPTOMS = SYMPTOM_IDS.map((s) => ({
  id: s.id,
  emoji: s.emoji,
  label: s.i18nKey, // Will be replaced by t() at render time
}));

export const SEVERITY_IDS: {
  value: Severity;
  emoji: string;
  i18nKey: SeverityMessageKey;
}[] = [
  { value: 0, emoji: "😊", i18nKey: "severity.fine" },
  { value: 1, emoji: "🤏", i18nKey: "severity.mild" },
  { value: 2, emoji: "😷", i18nKey: "severity.moderate" },
  { value: 3, emoji: "🤧", i18nKey: "severity.severe" },
  { value: 4, emoji: "😵", i18nKey: "severity.verySevere" },
];

export const SEVERITY_OPTIONS = SEVERITY_IDS.map((s) => ({
  value: s.value,
  emoji: s.emoji,
  label: s.i18nKey,
}));

const STORAGE_KEY = "achoo_diary";

export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year!, (month ?? 1) - 1, day ?? 1);
}

export function today(): string {
  return formatLocalDate();
}

export function loadEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const entries = raw ? JSON.parse(raw) : [];
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
    note: "",
    timestamp: new Date().toISOString(),
  });
  saveEntries(updated);
  return updated;
}
