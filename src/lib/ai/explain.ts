/**
 * AI layer: explanation and translation only.
 * AI does NOT decide eligibility. It receives structured result and formats it.
 */

import Groq from "groq-sdk";
import type { EligibilityResult } from "@/lib/eligibility/types";
import { logger } from "@/lib/logger";

export type ExplanationLanguage = "en" | "hi";

function getSystemPrompt(lang: ExplanationLanguage): string {
  const isHindi = lang === "hi";
  return isHindi
    ? `You are a helpful assistant for Indian farmers. You will receive structured eligibility results for government schemes. Your job is to explain the results in simple, conversational Hindi (हिंदी). Write ONLY in Hindi using Devanagari script. Be warm and clear. Do NOT decide or change eligibility—only explain what is given. Format your response as: (1) Short greeting (1 line), (2) Bullet list of eligible schemes with one-line reason per scheme, (3) Encouraging closing line. Keep it concise (max 200 words). Use simple Hindi words that farmers can understand.`
    : `You are a helpful assistant for Indian farmers. You will receive structured eligibility results for government schemes. Your job is to explain the results in simple, conversational English. Be warm and clear. Do NOT decide or change eligibility—only explain what is given. Format your response as: (1) Short greeting (1 line), (2) Bullet list of eligible schemes with one-line reason per scheme, (3) Encouraging closing line. Keep it concise (max 200 words).`;
}

function buildStructuredContext(result: EligibilityResult): string {
  const parts: string[] = [];

  if (result.topRecommended.length > 0) {
    parts.push("TOP RECOMMENDED SCHEMES:");
    result.topRecommended.forEach((s, i) => {
      parts.push(
        `${i + 1}. ${s.schemeName} – Benefit: ₹${s.benefitAmount}. Why eligible: ${s.matchedConditions.join("; ")}. Documents: ${s.requiredDocuments.join(", ")}.`
      );
    });
  }

  if (result.eligibleSchemes.length > result.topRecommended.length) {
    const other = result.eligibleSchemes.filter(
      (e) => !result.topRecommended.some((t) => t.schemeId === e.schemeId)
    );
    if (other.length > 0) {
      parts.push("OTHER ELIGIBLE SCHEMES:");
      other.forEach((s) => {
        parts.push(
          `- ${s.schemeName} – ₹${s.benefitAmount}. Reasons: ${s.matchedConditions.join("; ")}.`
        );
      });
    }
  }

  if (result.notEligibleSchemes.length > 0) {
    parts.push("NOT ELIGIBLE (with reasons):");
    result.notEligibleSchemes.forEach((s) => {
      parts.push(
        `- ${s.schemeName}: ${s.failedConditions.join("; ")}.`
      );
    });
  }

  if (result.eligibleSchemes.length === 0 && result.notEligibleSchemes.length > 0) {
    parts.push("No schemes are eligible based on the provided profile. Explain the main reasons briefly.");
  }

  return parts.join("\n\n");
}

/**
 * Generate conversational explanation or translation from structured eligibility result.
 * Does not perform any eligibility logic.
 */
export async function getExplanation(
  result: EligibilityResult,
  language: ExplanationLanguage
): Promise<string> {
  // Safely access environment variables (server-side only)
  const apiKey =
    (typeof process !== "undefined" && process.env.GROQ_API_KEY) ||
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GROQ_API_KEY) ||
    "";
  
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    logger.error("[AI] GROQ_API_KEY is not set, empty, or still has placeholder value");
    return language === "hi"
      ? "AI व्याख्या उपलब्ध नहीं है। कृपया GROQ_API_KEY सेट करें।"
      : "AI explanation is not available. Please set GROQ_API_KEY environment variable.";
  }
  
  let groq;
  try {
    groq = new Groq({ apiKey });
  } catch (initError: unknown) {
    const errorMessage =
      initError instanceof Error ? initError.message : "Unknown error";
    logger.error("[AI] Failed to initialize Groq client:", errorMessage);
    return language === "hi"
      ? `Groq क्लाइंट आरंभ करने में त्रुटि: ${errorMessage}`
      : `Failed to initialize Groq client: ${errorMessage}`;
  }
  const context = buildStructuredContext(result);
  const systemPrompt = getSystemPrompt(language);

  const userMessage = language === "hi"
    ? `नीचे दिए गए योग्यता परिणामों के आधार पर, किसान के लिए एक छोटा, मित्रतापूर्ण हिंदी में व्याख्या लिखें। किसी योजना की योग्यता को जोड़ें या हटाएं नहीं। केवल हिंदी में लिखें।\n\n${context}`
    : `Based ONLY on the following structured eligibility results, write a short, friendly explanation for the farmer in English. Do not add or remove any scheme's eligibility.\n\n${context}`;

  try {
    logger.log(`[AI] Requesting explanation in ${language === "hi" ? "Hindi" : "English"}`);
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) {
      logger.warn("[AI] Empty response from Groq");
      return language === "hi" ? "व्याख्या उपलब्ध नहीं है।" : "Explanation could not be generated.";
    }
    logger.log(`[AI] Successfully generated explanation (${text.length} chars)`);
    return text;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";
    logger.error("[AI] Groq API error:", errorMessage);
    return language === "hi"
      ? `व्याख्या लोड करने में त्रुटि। बाद में पुनः प्रयास करें।`
      : `Error loading explanation. Please check your API key and try again.`;
  }
}
