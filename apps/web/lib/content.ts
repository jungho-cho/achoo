export interface SummaryItem {
  label: string;
  value: string;
  tone?: "green" | "amber" | "blue" | "rose" | "gray";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function takeSentences(text: string, count = 3): string[] {
  return splitSentences(text).slice(0, count);
}

export function levelRank(level: string): number {
  const normalized = level.toLowerCase();
  if (
    normalized.includes("매우높") ||
    normalized.includes("very high") ||
    normalized.includes("sehr hoch") ||
    normalized.includes("tres eleve")
  ) {
    return 4;
  }
  if (
    normalized.includes("높") ||
    normalized === "high" ||
    normalized.includes("hoch") ||
    normalized.includes("eleve")
  ) {
    return 3;
  }
  if (
    normalized.includes("보통") ||
    normalized.includes("moderate") ||
    normalized.includes("mittel") ||
    normalized.includes("moyen")
  ) {
    return 2;
  }
  if (
    normalized.includes("낮") ||
    normalized === "low" ||
    normalized.includes("niedrig") ||
    normalized.includes("faible")
  ) {
    return 1;
  }
  return 0;
}

export function toneClass(tone: SummaryItem["tone"] = "gray"): string {
  switch (tone) {
    case "green":
      return "bg-green-50 text-green-700 border-green-100";
    case "amber":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "blue":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "rose":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
}
