/**
 * Test endpoint to verify Groq API key is working
 * GET /api/test-groq
 */

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
  
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_groq_api_key_here") {
    return NextResponse.json({
      success: false,
      error: "GROQ_API_KEY not found in environment variables",
      hint: "Make sure .env.local exists and contains GROQ_API_KEY=your_key_here, then restart the dev server",
    });
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: "Say 'API key is working' in one sentence." }],
      max_tokens: 50,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({
      success: true,
      message: "Groq API is working!",
      response: text,
      apiKeyLength: apiKey.length,
      apiKeyPrefix: apiKey.substring(0, 7) + "...",
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || String(err),
      details: err?.response?.data || err?.status || "Unknown error",
      hint: "Check your API key at https://console.groq.com",
    });
  }
}
