import { IndustryType, AssessmentResult } from "./types";

/**
 * FRONTEND SERVICE
 * ----------------
 * - Runs in browser
 * - NEVER talks to Gemini directly
 * - Calls backend API only
 */

const BACKEND_URL = "http://localhost:5000"; 
// 🔁 Later (GitHub Pages): change to deployed backend URL

export const analyzeFinancialData = async (
  rawData: string,
  industry: IndustryType,
  lang: string
): Promise<AssessmentResult> => {

  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: rawData,
      industry,
      language: lang
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      errText || "Analysis Failed. Ensure backend is running."
    );
  }

  const result = await response.json();
  return result as AssessmentResult;
};
