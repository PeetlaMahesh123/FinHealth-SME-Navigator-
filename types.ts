
export enum IndustryType {
  MANUFACTURING = 'Manufacturing',
  RETAIL = 'Retail',
  AGRICULTURE = 'Agriculture',
  SERVICES = 'Services',
  LOGISTICS = 'Logistics',
  ECOMMERCE = 'E-commerce'
}

export enum Language {
  EN = 'English',
  HI = 'Hindi',
  GUJ = 'Gujarati',
  MR = 'Marathi',
  BN = 'Bengali',
  TA = 'Tamil',
  TE = 'Telugu'
}

export interface BookkeepingDiscrepancy {
  transactionId: string;
  issue: string;
  suggestion: string;
  amount: number;
}

export interface OptimizationStrategy {
  area: string;
  currentSpend: number;
  potentialSaving: number;
  actionPlan: string;
}

export interface FinancialStatementRow {
  label: string;
  value: number;
  isHeader?: boolean;
}

export interface AssessmentResult {
  id: string;
  timestamp: number;
  score: number;
  creditRisk: {
    grade: 'A+' | 'A' | 'B' | 'C' | 'D';
    borrowingCapacity: number;
    riskDrivers: string[];
    loanObligations: number;
    debtServiceRatio: number;
    liquidityRatio: number;
  };
  metrics: {
    label: string;
    value: number;
    change: number;
    status: 'positive' | 'negative' | 'neutral';
  }[];
  statements: {
    pl: FinancialStatementRow[];
    balanceSheet: FinancialStatementRow[];
    cashFlow: FinancialStatementRow[];
  };
  bookkeeping: {
    healthScore: number;
    discrepancies: BookkeepingDiscrepancy[];
    automationTips: string[];
  };
  optimization: OptimizationStrategy[];
  recommendations: {
    productName: string;
    provider: string;
    benefit: string;
    relevanceScore: number;
  }[];
  forecast: {
    month: string;
    inflow: number;
    outflow: number;
    net: number;
  }[];
  scenarios: {
    label: string;
    description: string;
    impactOnNetProfit: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  }[];
  taxCompliance: {
    status: 'Compliant' | 'At Risk' | 'Non-Compliant';
    score: number;
    nextFilingDate: string;
    gstCreditsIdentified: number;
    potentialDeductions: string[];
    auditRisk: number;
  };
  benchmarking: {
    industryAverage: number;
    percentile: number;
    radarData: { category: string; business: number; industry: number }[];
  };
  workingCapital: {
    receivables: number;
    payables: number;
    inventory: number;
    cycleDays: number;
    burnRate: number;
  };
}

export interface IntegrationStatus {
  [key: string]: {
    connected: boolean;
    lastSync?: string;
  };
}
