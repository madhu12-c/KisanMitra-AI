"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

export type Lang = Language;

interface LanguageToggleProps {
  disabled?: boolean;
}

export function LanguageToggle({ disabled }: LanguageToggleProps = {}) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className="glass-card"
      style={{
        display: "inline-flex",
        gap: 0,
        borderRadius: "var(--radius-full)",
        overflow: "hidden",
        border: "1px solid var(--glass-border)",
      }}
    >
      <button
        type="button"
        aria-pressed={language === "en"}
        disabled={disabled}
        onClick={() => setLanguage("en")}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          background: language === "en" ? "rgba(255,255,255,0.15)" : "transparent",
          color: "var(--text-primary)",
          fontWeight: language === "en" ? 700 : 500,
          fontSize: "0.875rem",
          transition: "all var(--transition-base)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        English
      </button>
      <button
        type="button"
        aria-pressed={language === "hi"}
        disabled={disabled}
        onClick={() => setLanguage("hi")}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          background: language === "hi" ? "rgba(255,255,255,0.15)" : "transparent",
          color: "var(--text-primary)",
          fontWeight: language === "hi" ? 700 : 500,
          fontSize: "0.875rem",
          transition: "all var(--transition-base)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        हिंदी
      </button>
    </div>
  );
}
