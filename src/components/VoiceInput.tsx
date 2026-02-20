"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface VoiceInputProps {
  onResult: (text: string) => void;
  disabled?: boolean;
  lang?: "en" | "hi";
}

export function VoiceInput({ onResult, disabled, lang = "en" }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if Speech Recognition is supported (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognitionClass);
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      onResult("");
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";
      recognition.onresult = (e: SpeechRecognitionEvent) => {
        const result = e.results[e.results.length - 1];
        if (result && result.length > 0) {
          const transcript = result[0].transcript;
          onResult(transcript);
        }
      };
      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
      };
      recognition.onerror = () => {
        setListening(false);
        recognitionRef.current = null;
      };
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch (error) {
      console.error("[VoiceInput] Failed to start recognition:", error);
      setListening(false);
    }
  }, [onResult, lang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("[VoiceInput] Error stopping recognition:", error);
      }
      recognitionRef.current = null;
    }
    setListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  if (!isSupported) {
    return null; // Don't show button if Speech Recognition is not supported
  }

  return (
    <button
      type="button"
      aria-label={listening ? "Stop listening" : "Voice input"}
      disabled={disabled || !isSupported}
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
        cursor: disabled || !isSupported ? "not-allowed" : "pointer",
      }}
    >
      {listening ? "⏹" : "🎤"}
    </button>
  );
}
