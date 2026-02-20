import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "KisanMitra AI - Government Scheme Discovery for Farmers",
  description: "Discover government schemes you are eligible for. Rule-based eligibility checking with AI-powered explanations in Hindi and English.",
  keywords: ["government schemes", "farmer benefits", "agricultural schemes", "India", "eligibility checker"],
  authors: [{ name: "KisanMitra AI" }],
  openGraph: {
    title: "KisanMitra AI - Government Scheme Discovery",
    description: "Discover government schemes you are eligible for. Rule-based eligibility checking with AI-powered explanations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <LanguageProvider>{children}</LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
