"use client";

import { Hero } from "@/components/Hero";
import { Chat } from "@/components/Chat";

export default function AnalyzePage() {
  return (
    <main style={{ minHeight: "100vh", padding: "var(--spacing-lg) var(--spacing-md)" }}>
      <Hero />
      <Chat />
    </main>
  );
}

