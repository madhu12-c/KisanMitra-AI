"use client";

import { LanguageToggle } from "./LanguageToggle";
import { useTranslation } from "@/lib/useTranslation";

export function Hero() {
  const { t } = useTranslation();

  return (
    <header
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1rem 1.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }} />
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #f0f4e8 0%, #d4e8d4 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          KisanMitra AI
        </h1>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", minWidth: "200px" }}>
          <LanguageToggle />
        </div>
      </div>
      <p
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "var(--text-secondary)",
          maxWidth: "600px",
          margin: "0 auto",
          fontWeight: 400,
          lineHeight: 1.6,
        }}
      >
        {t("heroSubtitle")}
      </p>
    </header>
  );
}
