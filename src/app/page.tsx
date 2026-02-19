"use client";

import Link from "next/link";
import { Hero } from "@/components/Hero";
import { useTranslation } from "@/lib/useTranslation";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main style={{ minHeight: "100vh", padding: "var(--spacing-lg) var(--spacing-md)" }}>
      <Hero />

      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1rem" }}>
        <div
          className="glass-card"
          style={{
            borderRadius: "var(--radius-xl)",
            padding: "var(--spacing-2xl)",
            marginTop: "var(--spacing-xl)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "var(--spacing-2xl)",
            }}
          >
            <div>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 800, marginBottom: "0.75rem" }}>
                {t("landingProblemTitle")}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", marginBottom: "var(--spacing-lg)" }}>
                {t("landingProblemText")}
              </p>

              <Link
                href="/analyze"
                className="gradient-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.9rem 1.25rem",
                  borderRadius: "var(--radius-full)",
                  color: "#fff",
                  fontWeight: 800,
                  boxShadow: "0 8px 24px rgba(34, 168, 83, 0.25)",
                }}
              >
                {t("landingCta")} <span aria-hidden>→</span>
              </Link>
            </div>

            <div style={{ alignSelf: "center" }}>
              <div
                style={{
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--spacing-lg)",
                  background: "linear-gradient(145deg, rgba(34, 168, 83, 0.12), rgba(255, 215, 0, 0.08))",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: "0.5rem" }}>{t("landingTrustTitle")}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-secondary)", display: "grid", gap: "0.5rem" }}>
                  <li>✓ {t("landingTrust1")}</li>
                  <li>✓ {t("landingTrust2")}</li>
                  <li>✓ {t("landingTrust3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--spacing-2xl)" }}>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "var(--spacing-md)" }}>
            {t("landingHowTitle")}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-lg)" }}>
            {[
              { n: "01", title: t("landingHow1Title"), text: t("landingHow1Text") },
              { n: "02", title: t("landingHow2Title"), text: t("landingHow2Text") },
              { n: "03", title: t("landingHow3Title"), text: t("landingHow3Text") },
            ].map((s) => (
              <div key={s.n} className="glass-card hover-lift" style={{ borderRadius: "var(--radius-xl)", padding: "var(--spacing-lg)" }}>
                <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>{s.n}</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, marginTop: "0.5rem" }}>{s.title}</div>
                <div style={{ color: "var(--text-secondary)", marginTop: "0.35rem" }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "var(--spacing-2xl)", marginBottom: "var(--spacing-2xl)" }}>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "var(--spacing-md)" }}>
            {t("landingFeaturesTitle")}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-lg)" }}>
            {[
              { title: t("landingFeature1Title"), text: t("landingFeature1Text") },
              { title: t("landingFeature2Title"), text: t("landingFeature2Text") },
              { title: t("landingFeature3Title"), text: t("landingFeature3Text") },
              { title: t("landingFeature4Title"), text: t("landingFeature4Text") },
            ].map((f) => (
              <div key={f.title} className="glass-card hover-lift" style={{ borderRadius: "var(--radius-xl)", padding: "var(--spacing-lg)" }}>
                <div style={{ fontSize: "1.05rem", fontWeight: 800 }}>{f.title}</div>
                <div style={{ color: "var(--text-secondary)", marginTop: "0.35rem" }}>{f.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
