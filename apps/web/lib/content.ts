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

export function excerpt(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
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
      return "border-[#d9eadf] bg-[#eef6ef] text-[#2f6f53]";
    case "amber":
      return "border-[#ecd8ab] bg-[#fbf2de] text-[#8b5a12]";
    case "blue":
      return "border-[#d7e7f0] bg-[#edf5f9] text-[#41687d]";
    case "rose":
      return "border-[#efd4d0] bg-[#faece9] text-[#9c4c45]";
    default:
      return "border-gray-200 bg-[#f4f5f2] text-gray-600";
  }
}
