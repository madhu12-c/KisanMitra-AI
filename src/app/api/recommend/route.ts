/**
 * POST /api/recommend
 * Body: { userProfile, language? }
 * Returns: { structuredResult, aiExplanation }
 * Eligibility is rule-based; AI only explains.
 */

import { NextResponse } from "next/server";
import schemesData from "@/data/schemes.json";
import { checkEligibility } from "@/lib/eligibility/engine";
import { rankEligibleSchemes, getTopRecommended } from "@/lib/eligibility/ranking";
import { getExplanation, type ExplanationLanguage } from "@/lib/ai/explain";
import type { UserProfile, Scheme, EligibilityResult } from "@/lib/eligibility/types";
import { logger } from "@/lib/logger";

const schemes = schemesData as Scheme[];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userProfile = body.userProfile as UserProfile;
    const language: ExplanationLanguage = body.language === "hi" ? "hi" : "en";

    logger.log(`[API] /recommend called with language: ${language}`);

    if (!userProfile || typeof userProfile.landSize !== "number" || typeof userProfile.annualIncome !== "number") {
      return NextResponse.json(
        { error: "Invalid userProfile: landSize and annualIncome required as numbers." },
        { status: 400 }
      );
    }

    // 1. Rule-based eligibility (no AI)
    const result = checkEligibility(userProfile, schemes);
    logger.log(`[API] Eligibility check complete: ${result.eligibleSchemes.length} eligible, ${result.notEligibleSchemes.length} not eligible`);

    // 2. Rank and ensure top 3
    const ranked = rankEligibleSchemes(result.eligibleSchemes);
    const topRecommended = getTopRecommended(ranked, 3);
    const structuredResult: EligibilityResult = {
      ...result,
      topRecommended,
    };

    // 3. AI explanation only (no eligibility decision)
    const aiExplanation = await getExplanation(structuredResult, language);
    logger.log(`[API] Explanation received (${aiExplanation.length} chars)`);

    return NextResponse.json({
      structuredResult: {
        eligibleSchemes: structuredResult.eligibleSchemes,
        notEligibleSchemes: structuredResult.notEligibleSchemes,
        reasons: structuredResult.reasons,
        topRecommended: structuredResult.topRecommended,
      },
      aiExplanation,
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    logger.error("[API] Recommend API error:", errorMessage);
    return NextResponse.json(
      { error: "Recommendation failed. Please try again later." },
      { status: 500 }
    );
  }
}
