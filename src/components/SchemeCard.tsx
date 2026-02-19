"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/useTranslation";

export interface SchemeCardData {
  schemeId: string;
  schemeName: string;
  eligibilityStatus: "eligible" | "not_eligible";
  matchedConditions: string[];
  failedConditions: string[];
  eligibilityScore: number;
  benefitAmount: number;
  requiredDocuments: string[];
  description: string;
  isTop?: boolean;
}

interface SchemeCardProps {
  scheme: SchemeCardData;
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const isEligible = scheme.eligibilityStatus === "eligible";
  const reasons = isEligible ? scheme.matchedConditions : scheme.failedConditions;

  return (
    <article
      className="glass-card hover-lift"
      style={{
        borderRadius: "var(--radius-xl)",
        padding: "var(--spacing-lg)",
        background: isEligible
          ? "linear-gradient(145deg, rgba(34, 168, 83, 0.1) 0%, rgba(22, 197, 94, 0.05) 100%)"
          : "rgba(0, 0, 0, 0.2)",
        border: `1px solid ${isEligible ? "rgba(34, 168, 83, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
        transition: "all var(--transition-base)",
        opacity: isEligible ? 1 : 0.7,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "var(--spacing-md)",
          marginBottom: "var(--spacing-md)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              lineHeight: 1.3,
            }}
          >
            {scheme.schemeName}
          </h3>
          {scheme.isTop && (
            <span
              className="gradient-gold"
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.25rem 0.75rem",
                borderRadius: "var(--radius-full)",
                color: "#000",
                marginTop: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              ⭐ Top Pick
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 600,
            padding: "0.375rem 0.875rem",
            borderRadius: "var(--radius-full)",
            background: isEligible
              ? "rgba(34, 168, 83, 0.2)"
              : "rgba(239, 68, 68, 0.2)",
            border: `1px solid ${isEligible ? "var(--green-success)" : "var(--red-error)"}`,
            color: isEligible ? "var(--green-success)" : "var(--red-error)",
            whiteSpace: "nowrap",
          }}
        >
          {isEligible ? `✓ ${t("eligible")}` : `✗ ${t("notEligible")}`}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--text-secondary)",
          marginBottom: "var(--spacing-md)",
          lineHeight: 1.6,
        }}
      >
        {scheme.description}
      </p>

      {/* Benefit Amount */}
      <div
        style={{
          marginBottom: "var(--spacing-md)",
          padding: "var(--spacing-md)",
          borderRadius: "var(--radius-md)",
          background: "rgba(255, 215, 0, 0.1)",
          border: "1px solid rgba(255, 215, 0, 0.2)",
        }}
      >
        <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
          Benefit Amount
        </div>
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--gold)",
            lineHeight: 1,
          }}
        >
          ₹{scheme.benefitAmount.toLocaleString("en-IN")}
        </div>
      </div>

      {/* Eligibility Score Progress Bar */}
      <div style={{ marginBottom: "var(--spacing-md)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
          }}
        >
          <span>{t("matchScore")}</span>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
            {scheme.eligibilityScore}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "var(--radius-full)",
            background: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${scheme.eligibilityScore}%`,
              height: "100%",
              borderRadius: "var(--radius-full)",
              background: isEligible
                ? "linear-gradient(90deg, var(--green-success) 0%, var(--green-accent) 100%)"
                : "linear-gradient(90deg, var(--red-error) 0%, #dc2626 100%)",
              transition: "width var(--transition-slow)",
            }}
          />
        </div>
      </div>

      {/* Expandable Why Eligible/Not Eligible */}
      {reasons.length > 0 && (
        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "var(--spacing-sm) 0",
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>Why {isEligible ? "eligible" : "not eligible"}?</span>
            <span style={{ fontSize: "1.2rem", transition: "transform var(--transition-base)" }}>
              {showDetails ? "−" : "+"}
            </span>
          </button>
          {showDetails && (
            <div
              style={{
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.05)",
                marginTop: "var(--spacing-sm)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {reasons.map((reason, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: "0.5rem 0",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      borderBottom:
                        idx < reasons.length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
                    }}
                  >
                    {isEligible ? "✓" : "✗"} {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Expandable Documents */}
      {scheme.requiredDocuments.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowDocuments(!showDocuments)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "var(--spacing-sm) 0",
              background: "transparent",
              border: "none",
              color: "var(--text-primary)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <span>{t("requiredDocuments")} ({scheme.requiredDocuments.length})</span>
            <span style={{ fontSize: "1.2rem", transition: "transform var(--transition-base)" }}>
              {showDocuments ? "−" : "+"}
            </span>
          </button>
          {showDocuments && (
            <div
              style={{
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.05)",
                marginTop: "var(--spacing-sm)",
                animation: "fadeIn 0.3s ease",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {scheme.requiredDocuments.map((doc, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: "0.5rem 0",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      borderBottom:
                        idx < scheme.requiredDocuments.length - 1
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "none",
                    }}
                  >
                    📄 {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
