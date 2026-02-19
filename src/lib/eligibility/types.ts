/**
 * Data layer types for schemes and user profile.
 * benefitAmount is numeric for ranking logic.
 */

export interface SchemeEligibility {
  minLand: number | null;
  maxLand: number | null;
  incomeLimit: number | null;
  cropRequired: string | null;
  irrigationRequired: boolean | null;
  applicableStates: string[] | null;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: SchemeEligibility;
  benefitAmount: number;
  requiredDocuments: string[];
}

export interface UserProfile {
  landSize: number;
  cropType: string;
  annualIncome: number;
  irrigationAvailable: boolean;
  state: string;
}

/**
 * Per-scheme explainability for clean AI integration.
 */
export interface SchemeExplainability {
  schemeId: string;
  schemeName: string;
  eligibilityStatus: "eligible" | "not_eligible";
  matchedConditions: string[];
  failedConditions: string[];
  eligibilityScore: number;
  benefitAmount: number;
  requiredDocuments: string[];
  description: string;
}

export interface EligibilityResult {
  eligibleSchemes: SchemeExplainability[];
  notEligibleSchemes: SchemeExplainability[];
  reasons: Record<
    string,
    { eligibleReasons: string[]; rejectionReasons: string[] }
  >;
  topRecommended: SchemeExplainability[];
}
