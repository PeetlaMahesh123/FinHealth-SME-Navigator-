// src/services/analysisService.ts

import { AssessmentResult } from "./types";


// Helper: parse numeric substring into number
const parseNumber = (s: string) => {
  if (!s) return NaN;
  const cleaned = s.replace(/[^0-9.\-]/g, '').replace(/\.(?=.*\.)/g, '');
  const n = Number(cleaned);
  return isFinite(n) ? n : NaN;
};

// Analyze CSV/XLSX table data (rows = array of rows, each row = array of cells)
export const analyzeFinancialFromTable = async (
  rows: (string | number)[][],
  industry: string,
  lang: string
): Promise<AssessmentResult> => {
  await new Promise((res) => setTimeout(res, 300));

  // flatten and search for keywords
  let revenue = 0;
  let expenses = 0;
  let receivables = 0;
  let payables = 0;
  let inventory = 0;
  let loans = 0;
  let foundRevenue = false;
  let foundExpenses = false;

  const textRows = rows.map(r => r.map(c => String(c || '').trim()));

  for (const r of textRows) {
    const line = r.join(' ').toLowerCase();
    for (const c of r) {
      const n = parseNumber(String(c));
      if (!isNaN(n)) {
        if (/\b(revenue|sales|total revenue|net sales|turnover)\b/.test(line) || /revenue|sales/.test(String(r[0] || '').toLowerCase())) {
          revenue += Math.abs(Math.round(n));
          foundRevenue = true;
        } else if (/\b(expense|expenses|cost|cogs|operating expense)\b/.test(line) || /expense|cogs|cost/.test(String(r[0] || '').toLowerCase())) {
          expenses += Math.abs(Math.round(n));
          foundExpenses = true;
        } else if (/\b(receivable|accounts receivable|debtor)\b/.test(line)) {
          receivables += Math.abs(Math.round(n));
        } else if (/\b(payable|accounts payable|creditor)\b/.test(line)) {
          payables += Math.abs(Math.round(n));
        } else if (/\b(inventory|stock)\b/.test(line)) {
          inventory += Math.abs(Math.round(n));
        } else if (/\b(loan|debt|borrow)\b/.test(line)) {
          loans += Math.abs(Math.round(n));
        } else {
          // if no keyword, heuristic: treat large numbers as revenue candidates
          if (!foundRevenue && n > revenue && n > 10000) revenue = Math.round(n);
        }
      }
    }
  }

  // fallback defaults
  if (!foundRevenue && revenue === 0) revenue = 50000;
  if (!foundExpenses && expenses === 0) expenses = Math.round(revenue * 0.7);

  const net = revenue - expenses;
  let score = 50 + Math.round((net / Math.max(1, revenue)) * 50);
  score = Math.max(0, Math.min(100, score));

  const grade = score >= 80 ? 'A+' : score >= 70 ? 'A' : score >= 55 ? 'B' : score >= 40 ? 'C' : 'D';

  const result: AssessmentResult = {
    id: `res_table_${Date.now()}`,
    timestamp: Date.now(),
    score,
    creditRisk: {
      grade: grade as any,
      borrowingCapacity: Math.max(0, Math.round(net * 2)),
      riskDrivers: loans > 0 ? ['Existing loan obligations'] : [],
      loanObligations: loans,
      debtServiceRatio: parseFloat((net === 0 ? 0 : net / Math.max(1, loans || revenue * 0.1)).toFixed(2)),
      liquidityRatio: parseFloat((Math.max(0.5, Math.min(2, revenue / Math.max(1, expenses)))).toFixed(2))
    },
    metrics: [
      { label: 'Revenue', value: revenue, change: 0, status: 'positive' },
      { label: 'Net Profit', value: net, change: net > 0 ? 5 : -10, status: net > 0 ? 'positive' : 'negative' },
      { label: 'Receivables', value: receivables, change: 0, status: 'neutral' }
    ],
    statements: {
      pl: [
        { label: 'Revenue', value: revenue, isHeader: true },
        { label: 'Expenses', value: expenses },
        { label: 'Net Profit', value: net }
      ],
      balanceSheet: [
        { label: 'Total Assets', value: Math.round(revenue * 1.2), isHeader: true },
        { label: 'Total Liabilities', value: Math.round(expenses * 1.1) }
      ],
      cashFlow: [
        { label: 'Cash Inflows', value: revenue, isHeader: true },
        { label: 'Cash Outflows', value: expenses }
      ]
    },
    bookkeeping: { healthScore: score, discrepancies: [], automationTips: [] },
    optimization: [{ area: 'Working Capital', currentSpend: expenses, potentialSaving: Math.round(expenses * 0.12), actionPlan: 'Better receivable collections' }],
    recommendations: [{ productName: 'Short-term Working Capital', provider: 'Partner Bank', benefit: 'Improve liquidity', relevanceScore: 80 }],
    forecast: Array.from({ length: 6 }).map((_, i) => ({ month: `M${i + 1}`, inflow: Math.round(revenue * (1 + i * 0.01)), outflow: Math.round(expenses * (1 + i * 0.005)), net: Math.round(revenue * (1 + i * 0.01) - expenses * (1 + i * 0.005)) })),
    scenarios: [
      { label: '10% sales shock', description: 'Simulate 10% revenue decline', impactOnNetProfit: Math.round(net * -0.1), riskLevel: 'High' }
    ],
    taxCompliance: { status: 'Compliant', score: 75, nextFilingDate: '', gstCreditsIdentified: 0, potentialDeductions: [], auditRisk: 15 },
    benchmarking: { industryAverage: Math.round(revenue * 0.9), percentile: Math.min(99, score), radarData: [{ category: 'Liquidity', business: Math.min(100, Math.round(40 + score / 2)), industry: 55 }] },
    workingCapital: { receivables, payables, inventory, cycleDays: 45, burnRate: Math.round(expenses / 3) }
  };

  return result;
};

export const analyzeFinancialData = async (
  text: string,
  industry: string,
  lang: string
): Promise<AssessmentResult> => {
  // simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 600));

  // basic text checks
  if (!text || text.trim().length === 0) {
    const emptyResult: any = {
      id: `res_${Date.now()}`,
      timestamp: Date.now(),
      score: 0,
      creditRisk: {
        grade: 'D',
        borrowingCapacity: 0,
        riskDrivers: ['No data'],
        loanObligations: 0,
        debtServiceRatio: 0,
        liquidityRatio: 0
      },
      metrics: [],
      statements: { pl: [], balanceSheet: [], cashFlow: [] },
      bookkeeping: { healthScore: 0, discrepancies: [], automationTips: [] },
      optimization: [],
      recommendations: [],
      forecast: [],
      scenarios: [],
      taxCompliance: { status: 'At Risk', score: 0, nextFilingDate: '', gstCreditsIdentified: 0, potentialDeductions: [], auditRisk: 0 },
      benchmarking: { industryAverage: 0, percentile: 0, radarData: [] },
      workingCapital: { receivables: 0, payables: 0, inventory: 0, cycleDays: 0, burnRate: 0 }
    };
    return emptyResult as AssessmentResult;
  }

  const t = text.toLowerCase();
  // simple keyword scoring
  let score = 50;
  if (t.includes('profit')) score += 20;
  if (t.includes('growth')) score += 10;
  if (t.includes('revenue')) score += 10;
  if (t.includes('loss')) score -= 20;
  if (t.includes('debt')) score -= 15;

  // extract first monetary value if present
  const moneyMatches = text.match(/\d{1,3}(?:[.,]\d{3})*(?:\.\d+)?/g);
  let sampleValue = 100000;
  if (moneyMatches && moneyMatches.length > 0) {
    // take the largest found number as revenue proxy
    sampleValue = Math.max(...moneyMatches.map(m => Number(m.replace(/,/g, ''))));
  }

  const revenue = Math.max(50000, Math.round(sampleValue));
  // crude estimates
  const expenses = Math.round(revenue * (t.includes('profit') ? 0.6 : 0.85));
  const net = revenue - expenses;

  const grade = score >= 80 ? 'A+' : score >= 70 ? 'A' : score >= 55 ? 'B' : score >= 40 ? 'C' : 'D';

  const result: AssessmentResult = {
    id: `res_${Date.now()}`,
    timestamp: Date.now(),
    score: Math.max(0, Math.min(100, score)),
    creditRisk: {
      grade: grade as any,
      borrowingCapacity: Math.max(0, Math.round(net * 2)),
      riskDrivers: t.includes('debt') ? ['High debt levels'] : [],
      loanObligations: t.includes('loan') ? Math.round(sampleValue * 0.5) : 0,
      debtServiceRatio: parseFloat((net === 0 ? 0 : (net / Math.max(1, t.includes('loan') ? sampleValue * 0.2 : sampleValue * 0.1))).toFixed(2)),
      liquidityRatio: parseFloat((Math.max(0.5, Math.min(2, revenue / Math.max(1, expenses)))).toFixed(2))
    },
    metrics: [
      { label: 'Revenue', value: revenue, change: 5, status: 'positive' },
      { label: 'Net Profit', value: net, change: net > 0 ? 8 : -12, status: net > 0 ? 'positive' : 'negative' },
      { label: 'Operating Margin', value: Math.round((net / Math.max(1, revenue)) * 100), change: 1, status: 'neutral' }
    ],
    statements: {
      pl: [
        { label: 'Revenue', value: revenue, isHeader: true },
        { label: 'COGS / Expenses', value: expenses },
        { label: 'Net Profit', value: net }
      ],
      balanceSheet: [
        { label: 'Total Assets', value: Math.round(revenue * 1.2), isHeader: true },
        { label: 'Total Liabilities', value: Math.round(expenses * 1.1) }
      ],
      cashFlow: [
        { label: 'Cash Inflows', value: revenue, isHeader: true },
        { label: 'Cash Outflows', value: expenses }
      ]
    },
    bookkeeping: { healthScore: Math.round(score), discrepancies: [], automationTips: ['Use consistent bookkeeping codes', 'Automate bank reconciliations'] },
    optimization: [{ area: 'Expense Control', currentSpend: expenses, potentialSaving: Math.round(expenses * 0.15), actionPlan: 'Negotiate supplier terms' }],
    recommendations: [{ productName: 'Working Capital Loan', provider: 'Partner Bank', benefit: 'Improve liquidity', relevanceScore: 80 }],
    forecast: Array.from({ length: 6 }).map((_, i) => ({ month: `M${i + 1}`, inflow: Math.round(revenue * (1 + i * 0.02)), outflow: Math.round(expenses * (1 + i * 0.01)), net: Math.round(revenue * (1 + i * 0.02) - expenses * (1 + i * 0.01)) })),
    scenarios: [
      { label: 'Sales drop 10%', description: 'Simulate 10% revenue drop', impactOnNetProfit: Math.round(net * -0.1), riskLevel: 'High' }
    ],
    taxCompliance: { status: 'Compliant', score: 85, nextFilingDate: '', gstCreditsIdentified: 0, potentialDeductions: [], auditRisk: 10 },
    benchmarking: { industryAverage: Math.round(revenue * 0.9), percentile: Math.min(99, Math.round(score)), radarData: [{ category: 'Liquidity', business: Math.min(100, Math.round(50 + score / 2)), industry: 60 }, { category: 'Profitability', business: Math.min(100, Math.round(40 + score / 1.5)), industry: 55 }] },
    workingCapital: { receivables: Math.round(revenue * 0.2), payables: Math.round(expenses * 0.15), inventory: Math.round(revenue * 0.1), cycleDays: 45, burnRate: Math.round(expenses / 3) }
  };

  return result;
};
  