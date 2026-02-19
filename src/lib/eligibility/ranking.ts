/**
 * Rank eligible schemes by benefitAmount (numeric) and eligibilityScore.
 * Highlights top 3. Used after eligibility engine.
 */

import type { SchemeExplainability } from "./types";

export function rankEligibleSchemes(
  eligibleSchemes: SchemeExplainability[]
): SchemeExplainability[] {
  return [...eligibleSchemes].sort((a, b) => {
    // Primary: higher benefit first
    if (b.benefitAmount !== a.benefitAmount) return b.benefitAmount - a.benefitAmount;
    // Secondary: higher score
    return b.eligibilityScore - a.eligibilityScore;
  });
}

export function getTopRecommended(
  rankedSchemes: SchemeExplainability[],
  count: number = 3
): SchemeExplainability[] {
  return rankedSchemes.slice(0, count);
}
