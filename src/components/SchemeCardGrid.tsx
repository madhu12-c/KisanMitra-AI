"use client";

import { SchemeCard, type SchemeCardData } from "./SchemeCard";
import { useTranslation } from "@/lib/useTranslation";

interface SchemeCardGridProps {
  eligibleSchemes: SchemeCardData[];
  notEligibleSchemes: SchemeCardData[];
  topRecommended: SchemeCardData[];
}

export function SchemeCardGrid({
  eligibleSchemes,
  notEligibleSchemes,
  topRecommended,
}: SchemeCardGridProps) {
  const { t } = useTranslation();
  const otherEligible = eligibleSchemes.filter(
    (e) => !topRecommended.some((t) => t.schemeId === e.schemeId)
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Eligible Schemes Section */}
      {eligibleSchemes.length > 0 && (
        <section style={{ marginBottom: "var(--spacing-2xl)" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              marginBottom: "var(--spacing-lg)",
              color: "var(--green-success)",
            }}
          >
            Eligible Schemes
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
            {topRecommended.map((scheme) => (
              <SchemeCard key={scheme.schemeId} scheme={{ ...scheme, isTop: true }} />
            ))}
            {otherEligible.map((scheme) => (
              <SchemeCard key={scheme.schemeId} scheme={scheme} />
            ))}
          </div>
        </section>
      )}

      {/* Not Eligible Schemes Section */}
      {notEligibleSchemes.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              marginBottom: "var(--spacing-lg)",
              color: "var(--text-secondary)",
              opacity: 0.8,
            }}
          >
            {t("notEligibleSection")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--spacing-lg)",
            }}
          >
            {notEligibleSchemes.map((scheme) => (
              <SchemeCard key={scheme.schemeId} scheme={scheme} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
