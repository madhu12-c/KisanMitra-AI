/**
 * Rule-based eligibility engine. No AI. Deterministic only.
 * Returns structured explainability per scheme: eligibilityStatus, matchedConditions, failedConditions, eligibilityScore.
 */

import type { Scheme, UserProfile, SchemeExplainability, EligibilityResult } from "./types";

function evaluateScheme(profile: UserProfile, scheme: Scheme): SchemeExplainability {
  const e = scheme.eligibility;
  const matchedConditions: string[] = [];
  const failedConditions: string[] = [];

  // minLand
  if (e.minLand != null) {
    if (profile.landSize >= e.minLand) {
      matchedConditions.push(`Land size ${profile.landSize} ha meets minimum ${e.minLand} ha`);
    } else {
      failedConditions.push(`Land size ${profile.landSize} ha is below minimum ${e.minLand} ha`);
    }
  }

  // maxLand
  if (e.maxLand != null) {
    if (profile.landSize <= e.maxLand) {
      matchedConditions.push(`Land size ${profile.landSize} ha is within maximum ${e.maxLand} ha`);
    } else {
      failedConditions.push(`Land size ${profile.landSize} ha exceeds maximum ${e.maxLand} ha`);
    }
  }

  // incomeLimit
  if (e.incomeLimit != null) {
    if (profile.annualIncome <= e.incomeLimit) {
      matchedConditions.push(`Annual income ₹${profile.annualIncome} is within limit ₹${e.incomeLimit}`);
    } else {
      failedConditions.push(`Annual income ₹${profile.annualIncome} exceeds limit ₹${e.incomeLimit}`);
    }
  }

  // cropRequired
  if (e.cropRequired != null && e.cropRequired.trim() !== "") {
    const cropMatch =
      profile.cropType.trim().toLowerCase() === e.cropRequired.trim().toLowerCase();
    if (cropMatch) {
      matchedConditions.push(`Crop "${profile.cropType}" matches required "${e.cropRequired}"`);
    } else {
      failedConditions.push(`Crop "${profile.cropType}" does not match required "${e.cropRequired}"`);
    }
  }

  // irrigationRequired: true = must have irrigation, false = must NOT have (rainfed), null = no constraint
  if (e.irrigationRequired === true) {
    if (profile.irrigationAvailable) {
      matchedConditions.push("Irrigation is available as required");
    } else {
      failedConditions.push("Scheme requires irrigation; currently not available");
    }
  } else if (e.irrigationRequired === false) {
    if (!profile.irrigationAvailable) {
      matchedConditions.push("Rainfed / no irrigation as required for scheme");
    } else {
      failedConditions.push("Scheme is for rainfed areas; irrigation is available");
    }
  }

  // applicableStates
  if (e.applicableStates != null && e.applicableStates.length > 0) {
    const stateMatch = e.applicableStates.some(
      (s) => s.trim().toLowerCase() === profile.state.trim().toLowerCase()
    );
    if (stateMatch) {
      matchedConditions.push(`State "${profile.state}" is in applicable states`);
    } else {
      failedConditions.push(`State "${profile.state}" is not in applicable states`);
    }
  }

  const totalChecked = matchedConditions.length + failedConditions.length;
  const eligibilityScore =
    totalChecked === 0 ? 100 : Math.round((matchedConditions.length / totalChecked) * 100);
  const isEligible = failedConditions.length === 0;

  return {
    schemeId: scheme.id,
    schemeName: scheme.name,
    eligibilityStatus: isEligible ? "eligible" : "not_eligible",
    matchedConditions,
    failedConditions,
    eligibilityScore: isEligible ? 100 : eligibilityScore,
    benefitAmount: scheme.benefitAmount,
    requiredDocuments: scheme.requiredDocuments,
    description: scheme.description,
  };
}

/**
 * Deterministic eligibility check. No LLM. Fast rule-based evaluation.
 */
export function checkEligibility(
  userProfile: UserProfile,
  schemes: Scheme[]
): EligibilityResult {
  const explainabilities: SchemeExplainability[] = schemes.map((s) =>
    evaluateScheme(userProfile, s)
  );

  const eligibleSchemes = explainabilities.filter((e) => e.eligibilityStatus === "eligible");
  const notEligibleSchemes = explainabilities.filter((e) => e.eligibilityStatus === "not_eligible");

  const reasons: EligibilityResult["reasons"] = {};
  for (const ex of explainabilities) {
    reasons[ex.schemeName] = {
      eligibleReasons: ex.matchedConditions,
      rejectionReasons: ex.failedConditions,
    };
  }

  // Ranking is applied in ranking.ts; here we attach top 3 for convenience
  const sorted = [...eligibleSchemes].sort(
    (a, b) =>
      b.benefitAmount - a.benefitAmount ||
      b.eligibilityScore - a.eligibilityScore
  );
  const topRecommended = sorted.slice(0, 3);

  return {
    eligibleSchemes,
    notEligibleSchemes,
    reasons,
    topRecommended,
  };
}
