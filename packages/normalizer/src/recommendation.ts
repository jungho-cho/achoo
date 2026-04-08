import type {
  DustLevel,
  DustResponse,
  PollenLevel,
  PollenResponse,
  PollenSpecies,
} from "@repo/shared-types";

export type RecommendationTier = "act-now" | "reduce-exposure" | "okay-today";
export type RecommendationAction =
  | "take-medicine-early"
  | "wear-mask"
  | "avoid-lunch-walk"
  | "okay-today";

export interface RecommendationEvidence {
  type: "pollen" | "dust";
  level: PollenLevel | DustLevel;
  species?: PollenSpecies;
}

export interface RecommendationState {
  stale: boolean;
  dataMode: "full" | "pollen-only" | "dust-only" | "none";
  locationMode: "confirmed" | "fallback";
}

export interface DailyRecommendation {
  tier: RecommendationTier;
  action: RecommendationAction;
  actions: RecommendationAction[];
  confidence: "high" | "medium" | "low";
  state: RecommendationState;
  evidence: RecommendationEvidence[];
  dominantSpecies?: PollenSpecies;
  pollenLevel?: PollenLevel;
  dustLevel?: DustLevel;
}

interface RecommendationOptions {
  stale?: boolean;
  locationDenied?: boolean;
}

const POLLEN_WEIGHT: Record<PollenLevel, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  "very-high": 3,
};

const DUST_WEIGHT: Record<DustLevel, number> = {
  good: 0,
  moderate: 1,
  bad: 2,
  "very-bad": 3,
};

function getDominantPollen(pollen: PollenResponse | null) {
  if (!pollen || pollen.current.readings.length === 0) return null;
  return pollen.current.readings.reduce((a, b) =>
    a.numericValue >= b.numericValue ? a : b,
  );
}

export function buildDailyRecommendation(
  pollen: PollenResponse | null,
  dust: DustResponse | null,
  options: RecommendationOptions = {},
): DailyRecommendation | null {
  if (!pollen && !dust) {
    return null;
  }

  const dominant = getDominantPollen(pollen);
  const pollenLevel = dominant?.level;
  const dustLevel = dust?.current.level;

  const pollenWeight = pollenLevel ? POLLEN_WEIGHT[pollenLevel] : -1;
  const dustWeight = dustLevel ? DUST_WEIGHT[dustLevel] : -1;

  let tier: RecommendationTier = "okay-today";
  let action: RecommendationAction = "okay-today";

  if (pollenWeight >= 2 || dustWeight >= 3) {
    tier = "act-now";
    action = pollenWeight >= 2 ? "take-medicine-early" : "wear-mask";
  } else if (pollenWeight >= 1 || dustWeight >= 1) {
    tier = "reduce-exposure";
    action = dustWeight >= 2 ? "wear-mask" : "avoid-lunch-walk";
  }

  const dataMode =
    pollen && dust
      ? "full"
      : pollen
        ? "pollen-only"
        : dust
          ? "dust-only"
          : "none";

  const locationMode = options.locationDenied ? "fallback" : "confirmed";

  let confidence: DailyRecommendation["confidence"] = "high";
  if (options.stale || dataMode !== "full" || locationMode === "fallback") {
    confidence = "medium";
  }
  if (dataMode === "none") {
    confidence = "low";
  }

  const evidence: RecommendationEvidence[] = [];
  if (dominant) {
    evidence.push({
      type: "pollen",
      level: dominant.level,
      species: dominant.species,
    });
  }
  if (dustLevel) {
    evidence.push({
      type: "dust",
      level: dustLevel,
    });
  }

  const actions = (() => {
    switch (action) {
      case "take-medicine-early":
        return [
          "take-medicine-early",
          "wear-mask",
          "avoid-lunch-walk",
        ] as RecommendationAction[];
      case "wear-mask":
        return ["wear-mask", "avoid-lunch-walk"] as RecommendationAction[];
      case "avoid-lunch-walk":
        return ["avoid-lunch-walk", "wear-mask"] as RecommendationAction[];
      default:
        return ["okay-today"] as RecommendationAction[];
    }
  })();

  return {
    tier,
    action,
    actions,
    confidence,
    state: {
      stale: Boolean(options.stale),
      dataMode,
      locationMode,
    },
    evidence,
    dominantSpecies: dominant?.species,
    pollenLevel,
    dustLevel,
  };
}
