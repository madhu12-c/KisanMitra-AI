"use client";

import { useState, useRef, useCallback } from "react";

interface VoiceInputProps {
  onResult: (text: string) => void;
  disabled?: boolean;
  lang?: "en" | "hi";
}

export function VoiceInput({ onResult, disabled, lang = "en" }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: SpeechRecognition }).webkitSpeechRecognition);
    if (!SpeechRecognition) {
      onResult("");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const t = e.results[e.results.length - 1][0].transcript;
      onResult(t);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }, [onResult, lang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  return (
    <button
      type="button"
      aria-label={listening ? "Stop listening" : "Voice input"}
      disabled={disabled}
      onClick={listening ? stopListening : startListening}
      className="glass-card"
      style={{
        padding: "var(--spacing-md)",
        borderRadius: "var(--radius-full)",
        border: `1px solid ${listening ? "var(--red-error)" : "var(--glass-border)"}`,
        background: listening ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.05)",
        color: listening ? "var(--red-error)" : "var(--text-primary)",
        fontSize: "1.2rem",
        minWidth: "48px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all var(--transition-base)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {listening ? "⏹" : "🎤"}
    </button>
  );
}
