"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { SchemeCard, type SchemeCardData } from "./SchemeCard";
import { SummaryBanner } from "./SummaryBanner";
import { SchemeCardGrid } from "./SchemeCardGrid";
import { VoiceInput } from "./VoiceInput";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/useTranslation";
import type { Language } from "@/lib/translations";
import { logger } from "@/lib/logger";
type Lang = "en" | "hi";

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  role: MessageRole;
  text: string;
}

const PROFILE_STEPS_CONFIG = [
  {
    key: "landSize",
    labelKey: "landSizeQuestion" as const,
    parse: (v: string) => parseFloat(v),
  },
  {
    key: "cropType",
    labelKey: "cropTypeQuestion" as const,
    parse: (v: string) => v.trim(),
  },
  {
    key: "annualIncome",
    labelKey: "annualIncomeQuestion" as const,
    parse: (v: string) => parseFloat(v.replace(/\D/g, "")) || 0,
  },
  {
    key: "irrigationAvailable",
    labelKey: "irrigationQuestion" as const,
    parse: (v: string) => /yes|हाँ|हां|y|1/i.test(v.trim()),
  },
  {
    key: "state",
    labelKey: "stateQuestion" as const,
    parse: (v: string) => v.trim(),
  },
] as const;

interface UserProfileState {
  landSize: number;
  cropType: string;
  annualIncome: number;
  irrigationAvailable: boolean;
  state: string;
}

const initialProfile: UserProfileState = {
  landSize: 0,
  cropType: "",
  annualIncome: 0,
  irrigationAvailable: false,
  state: "",
};

export function Chat() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfileState>(initialProfile);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    structuredResult: {
      eligibleSchemes: SchemeCardData[];
      notEligibleSchemes: SchemeCardData[];
      topRecommended: SchemeCardData[];
    };
    aiExplanation: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = useCallback((role: MessageRole, text: string) => {
    setMessages((prev) => [...prev, { id: String(Date.now()), role, text }]);
  }, []);

  const fetchRecommendations = useCallback(
    async (lang: Lang) => {
      setLoading(true);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userProfile: {
              landSize: profile.landSize,
              cropType: profile.cropType,
              annualIncome: profile.annualIncome,
              irrigationAvailable: profile.irrigationAvailable,
              state: profile.state,
            },
            language: lang,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const errorMsg = data.error || t("somethingWentWrong");
          addMessage("assistant", errorMsg);
          return;
        }
        setResult({
          structuredResult: data.structuredResult,
          aiExplanation: data.aiExplanation,
        });
        addMessage("assistant", data.aiExplanation);
      } catch {
        addMessage("assistant", t("couldNotFetch"));
      } finally {
        setLoading(false);
      }
    },
    [profile, addMessage]
  );

  const sendForRecommendations = useCallback(async () => {
    setResult(null);
    addMessage("user", t("getRecommendations"));
    await fetchRecommendations(language);
  }, [language, fetchRecommendations, addMessage, t]);

  const prevLangRef = useRef<Language>(language);
  useEffect(() => {
    // Only re-fetch if language changed AND we have results
    if (!result) {
      prevLangRef.current = language;
      return;
    }
    
    if (prevLangRef.current === language) {
      return; // Language hasn't changed
    }
    
    const previousLang = prevLangRef.current;
    prevLangRef.current = language;
    
    logger.log(`[Chat] Language changed from ${previousLang} to ${language}, re-fetching explanation...`);
    
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userProfile: {
              landSize: profile.landSize,
              cropType: profile.cropType,
              annualIncome: profile.annualIncome,
              irrigationAvailable: profile.irrigationAvailable,
              state: profile.state,
            },
            language,
          }),
        });
        const data = await res.json();
        if (res.ok && data.aiExplanation) {
          logger.log(`[Chat] Updated explanation in ${language}`);
          setResult((r) => (r ? { ...r, aiExplanation: data.aiExplanation } : r));
          setMessages((prev) => {
            const idx = prev.findLastIndex((m) => m.role === "assistant");
            if (idx < 0) return prev;
            const next = [...prev];
            next[idx] = { ...next[idx], text: data.aiExplanation };
            return next;
          });
        } else {
          logger.error("[Chat] Failed to fetch explanation:", data.error);
        }
      } catch (err) {
        logger.error("[Chat] Error re-fetching explanation:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [language, profile, result]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;

    setInput("");
    addMessage("user", raw);

    if (step < PROFILE_STEPS_CONFIG.length) {
      const current = PROFILE_STEPS_CONFIG[step];
      if (!current) {
        logger.error(`[Chat] Invalid step index: ${step}`);
        return;
      }
      const value = current.parse(raw);
      setProfile((prev) => ({ ...prev, [current.key]: value }));
      if (step === PROFILE_STEPS_CONFIG.length - 1) {
        setStep(step + 1);
        addMessage("assistant", t("thanksFetching"));
        sendForRecommendations();
      } else {
        setStep(step + 1);
        const nextStep = PROFILE_STEPS_CONFIG[step + 1];
        if (nextStep) {
          addMessage("assistant", t(nextStep.labelKey));
        } else {
          logger.error(`[Chat] Could not get label for step ${step + 1}`);
        }
      }
    }
  };

  const startOver = () => {
    setMessages([]);
    setStep(0);
    setProfile(initialProfile);
    setResult(null);
    setInput("");
    const firstStep = PROFILE_STEPS_CONFIG[0];
    if (firstStep) {
      addMessage("assistant", t(firstStep.labelKey));
    }
  };

  const firstQuestionLabel = useMemo(() => {
    const firstStep = PROFILE_STEPS_CONFIG[0];
    return firstStep ? t(firstStep.labelKey) : "";
  }, [language, t]);

  const showForm = step === 0 && messages.length === 0;
  if (showForm) {
    return (
      <div className="glass-card" style={{ padding: "var(--spacing-xl)", maxWidth: "600px", margin: "0 auto", borderRadius: "var(--radius-xl)" }}>
        <p style={{ marginBottom: "var(--spacing-md)", fontSize: "1.1rem", fontWeight: 500 }}>
          {firstQuestionLabel}
        </p>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", alignItems: "center" }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 2.5"
            autoFocus
            className="glass-card"
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "var(--spacing-md)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--glass-border)",
              background: "rgba(0,0,0,0.2)",
              color: "var(--text-primary)",
              fontSize: "1rem",
            }}
          />
          <VoiceInput
            onResult={(t) => setInput((prev) => (prev ? prev + " " + t : t))}
            lang={language}
          />
          <button
            type="submit"
            className="gradient-primary"
            style={{
              padding: "var(--spacing-md) var(--spacing-lg)",
              borderRadius: "var(--radius-full)",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              boxShadow: "0 4px 12px rgba(34, 168, 83, 0.3)",
            }}
          >
            {t("next")} →
          </button>
        </form>
      </div>
    );
  }

  // Calculate summary stats
  const totalBenefit = result
    ? result.structuredResult.eligibleSchemes.reduce((sum, s) => sum + s.benefitAmount, 0)
    : 0;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 var(--spacing-md)" }}>
      {/* Chat Messages */}
      <div className="glass-card" style={{ padding: "var(--spacing-xl)", borderRadius: "var(--radius-xl)", marginBottom: "var(--spacing-xl)", minHeight: "300px", maxHeight: "500px", overflowY: "auto" }}>
        <div style={{ marginBottom: "var(--spacing-md)" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                textAlign: m.role === "user" ? "right" : "left",
                marginBottom: "var(--spacing-md)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <span
                className="glass-card"
                style={{
                  display: "inline-block",
                  maxWidth: "85%",
                  padding: "var(--spacing-md) var(--spacing-lg)",
                  borderRadius: m.role === "user" ? "var(--radius-lg) var(--radius-lg) 0 var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) var(--radius-lg) 0",
                  background: m.role === "user"
                    ? "linear-gradient(135deg, rgba(34, 168, 83, 0.2) 0%, rgba(22, 197, 94, 0.15) 100%)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${m.role === "user" ? "rgba(34, 168, 83, 0.3)" : "var(--glass-border)"}`,
                  lineHeight: 1.6,
                }}
              >
                {m.text}
              </span>
            </div>
          ))}
          {loading && (
            <div style={{ textAlign: "left", marginBottom: "var(--spacing-md)" }}>
              <span
                className="glass-card"
                style={{
                  display: "inline-block",
                  padding: "var(--spacing-md) var(--spacing-lg)",
                  borderRadius: "var(--radius-lg)",
                  background: "rgba(255, 255, 255, 0.05)",
                }}
              >
                {t("checkingSchemes")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <section style={{ marginTop: "var(--spacing-2xl)", marginBottom: "var(--spacing-2xl)" }}>
          {/* Summary Banner */}
          <SummaryBanner
            eligibleCount={result.structuredResult.eligibleSchemes.length}
            totalBenefit={totalBenefit}
            topRecommendedCount={result.structuredResult.topRecommended.length}
          />

          {/* Scheme Cards Grid */}
          <SchemeCardGrid
            eligibleSchemes={result.structuredResult.eligibleSchemes}
            notEligibleSchemes={result.structuredResult.notEligibleSchemes}
            topRecommended={result.structuredResult.topRecommended}
          />
        </section>
      )}

      {/* Input Form */}
      {step <= PROFILE_STEPS_CONFIG.length && !loading && (
        <div className="glass-card" style={{ padding: "var(--spacing-lg)", borderRadius: "var(--radius-xl)", marginTop: "var(--spacing-xl)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "var(--spacing-sm)", flexWrap: "wrap", alignItems: "center" }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                step < PROFILE_STEPS_CONFIG.length
                  ? language === "hi"
                    ? "अपना उत्तर टाइप करें…"
                    : "Type your answer…"
                  : language === "hi"
                  ? "कुछ पूछें या फिर से शुरू करें"
                  : "Ask something or start over"
              }
              className="glass-card"
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--glass-border)",
                background: "rgba(0,0,0,0.2)",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            />
            <VoiceInput
              onResult={(t) => setInput((prev) => (prev ? prev + " " + t : t))}
              disabled={loading}
              lang={language}
            />
            <button
              type="submit"
              className="gradient-primary"
              style={{
                padding: "var(--spacing-md) var(--spacing-lg)",
                borderRadius: "var(--radius-full)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 4px 12px rgba(34, 168, 83, 0.3)",
              }}
            >
              {t("send")} →
            </button>
            {result && (
              <button
                type="button"
                onClick={startOver}
                className="glass-card"
                style={{
                  padding: "var(--spacing-md) var(--spacing-lg)",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--glass-border)",
                  background: "transparent",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {t("startOver")}
              </button>
            )}
          </form>
        </div>
      )}

      {result && (
        <p style={{ marginTop: "var(--spacing-md)", fontSize: "0.875rem", color: "var(--text-muted)", textAlign: "center" }}>
          {t("languageToggleHint")}
        </p>
      )}
    </div>
  );
}
