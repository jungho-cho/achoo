import { describe, expect, it } from "vitest";
import type { DustResponse, PollenResponse } from "@repo/shared-types";
import { buildDailyRecommendation } from "../recommendation.js";

function expectRecommendation<T>(value: T | null): T {
  expect(value).not.toBeNull();
  return value as T;
}

function pollenResponse(
  level: PollenResponse["current"]["overallLevel"],
  numericValue: number,
): PollenResponse {
  return {
    sido: "서울",
    lat: 37.5665,
    lng: 126.978,
    source: "kma",
    cachedAt: "2026-04-08T08:00:00Z",
    current: {
      date: "2026-04-08",
      overallLevel: level,
      readings: [
        {
          species: "tree",
          level,
          numericValue,
          range: "",
        },
      ],
    },
    forecast: [],
  };
}

function dustResponse(level: DustResponse["current"]["level"]): DustResponse {
  return {
    sido: "서울",
    lat: 37.5665,
    lng: 126.978,
    source: "airkorea",
    cachedAt: "2026-04-08T08:00:00Z",
    current: {
      pm10: 60,
      pm25: 30,
      level,
    },
  };
}

describe("buildDailyRecommendation", () => {
  it("uses act-now and medicine-early for high pollen days", () => {
    const result = expectRecommendation(
      buildDailyRecommendation(
        pollenResponse("high", 70),
        dustResponse("moderate"),
      ),
    );
    expect(result.tier).toBe("act-now");
    expect(result.action).toBe("take-medicine-early");
    expect(result.confidence).toBe("high");
  });

  it("uses act-now and mask for very bad dust days", () => {
    const result = expectRecommendation(
      buildDailyRecommendation(
        pollenResponse("low", 15),
        dustResponse("very-bad"),
      ),
    );
    expect(result.tier).toBe("act-now");
    expect(result.action).toBe("wear-mask");
  });

  it("uses reduce-exposure for moderate pollen days", () => {
    const result = expectRecommendation(
      buildDailyRecommendation(
        pollenResponse("moderate", 45),
        dustResponse("good"),
      ),
    );
    expect(result.tier).toBe("reduce-exposure");
    expect(result.action).toBe("avoid-lunch-walk");
  });

  it("uses reduce-exposure for bad dust days even when pollen is low", () => {
    const result = expectRecommendation(
      buildDailyRecommendation(pollenResponse("low", 15), dustResponse("bad")),
    );
    expect(result.tier).toBe("reduce-exposure");
    expect(result.action).toBe("wear-mask");
  });

  it("returns okay-today on calm days", () => {
    const result = expectRecommendation(
      buildDailyRecommendation(pollenResponse("low", 15), dustResponse("good")),
    );
    expect(result.tier).toBe("okay-today");
    expect(result.action).toBe("okay-today");
  });

  it("degrades confidence when data is stale or partial", () => {
    const staleResult = expectRecommendation(
      buildDailyRecommendation(
        pollenResponse("low", 15),
        dustResponse("good"),
        {
          stale: true,
        },
      ),
    );
    expect(staleResult.confidence).toBe("medium");
    expect(staleResult.state.stale).toBe(true);

    const partialResult = expectRecommendation(
      buildDailyRecommendation(pollenResponse("moderate", 45), null),
    );
    expect(partialResult.confidence).toBe("medium");
    expect(partialResult.state.dataMode).toBe("pollen-only");
  });

  it("marks location-denied recommendations as fallback mode", () => {
    const result = expectRecommendation(
      buildDailyRecommendation(
        pollenResponse("moderate", 45),
        dustResponse("good"),
        {
          locationDenied: true,
        },
      ),
    );
    expect(result.state.locationMode).toBe("fallback");
    expect(result.confidence).toBe("medium");
  });

  it("returns null when no data is available", () => {
    const result = buildDailyRecommendation(null, null);
    expect(result).toBeNull();
  });
});
