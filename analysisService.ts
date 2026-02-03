// src/services/analysisService.ts

export const analyzeFinancialData = async (
    text: string,
    industry: string,
    lang: string
  ) => {
    await new Promise(resolve => setTimeout(resolve, 500));
  
    if (!text || text.trim().length === 0) {
      return {
        score: 0,
        riskLevel: "High",
        summary: "No financial data provided",
        insights: ["Please enter text-based financial data"],
        recommendations: ["Provide revenue, expenses, profit, debt details"],
        language: lang
      };
    }
  
    let score = 60;
    const t = text.toLowerCase();
  
    if (t.includes("profit")) score += 15;
    if (t.includes("growth")) score += 10;
    if (t.includes("loss")) score -= 20;
    if (t.includes("debt")) score -= 10;
  
    return {
      score,
      riskLevel: score >= 75 ? "Low" : score >= 50 ? "Medium" : "High",
      summary: `Financial analysis completed for ${industry}`,
      insights: [
        "Frontend rule-based analysis applied",
        "Cash flow indicators evaluated"
      ],
      recommendations: [
        "Improve expense control",
        "Maintain healthy cash reserves",
        "Add backend for AI-powered insights"
      ],
      language: lang
    };
  };
  