"use client";

import { useTranslation } from "@/lib/useTranslation";

interface SummaryBannerProps {
  eligibleCount: number;
  totalBenefit: number;
  topRecommendedCount: number;
}

export function SummaryBanner({ eligibleCount, totalBenefit, topRecommendedCount }: SummaryBannerProps) {
  const { t } = useTranslation();
  return (
    <div
      className="glass-card"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "var(--spacing-xl)",
        marginBottom: "var(--spacing-xl)",
        background: "linear-gradient(135deg, rgba(34, 168, 83, 0.15) 0%, rgba(22, 197, 94, 0.1) 100%)",
        border: "1px solid rgba(34, 168, 83, 0.3)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--spacing-lg)",
          textAlign: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--green-success)",
              marginBottom: "0.25rem",
            }}
          >
            {eligibleCount}
          </div>
          <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            {eligibleCount === 1 ? "Scheme" : "Schemes"} Available
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--gold)",
              marginBottom: "0.25rem",
            }}
          >
            ₹{totalBenefit.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
            {t("totalPotentialBenefit")}
          </div>
        </div>
        {topRecommendedCount > 0 && (
          <div>
            <div
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.25rem",
              }}
            >
              {topRecommendedCount}
            </div>
            <div style={{ fontSize: "0.95rem", color: "var(--text-secondary)" }}>
              {topRecommendedCount === 1 ? t("topRecommendation") : t("topRecommendations")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
