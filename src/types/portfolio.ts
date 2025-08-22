export interface Investment {
  id: string;
  name: string;
  type: 'equity' | 'mutual_fund' | 'bond' | 'real_estate' | 'crypto' | 'elss' | 'ppf' | 'nsc' | 'fd';
  category: 'stcg' | 'ltcg' | 'debt' | 'tax_saving';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  dividendReceived?: number;
  brokerageFee?: number;
  stampDuty?: number;
  stt?: number;
  gst?: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  name: string;
  investments: Investment[];
  totalValue: number;
  totalGains: number;
  totalLosses: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxRegime {
  name: 'old' | 'new';
  standardDeduction: number;
  taxSlabs: TaxSlab[];
  availableDeductions: Deduction[];
}

export interface TaxSlab {
  min: number;
  max: number;
  rate: number;
}

export interface Deduction {
  section: string;
  name: string;
  maxAmount: number;
  description: string;
  eligibleFor: 'old' | 'new' | 'both';
}

export interface CapitalGain {
  investmentId: string;
  investmentName: string;
  type: 'STCG' | 'LTCG';
  gainAmount: number;
  taxRate: number;
  taxAmount: number;
  holdingPeriod: number;
  exemptionAvailable?: number;
  indexationBenefit?: number;
}

export interface TaxCalculation {
  portfolioId: string;
  regime: 'old' | 'new';
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  incomeTax: number;
  cess: number;
  surcharge: number;
  totalTax: number;
  capitalGains: CapitalGain[];
  capitalGainsTax: number;
  totalTaxLiability: number;
  effectiveRate: number;
  calculatedAt: Date;
}

export interface ScenarioSimulation {
  id: string;
  name: string;
  basePortfolio: Portfolio;
  changes: ScenarioChange[];
  projectedResult: TaxCalculation;
  savings: number;
  createdAt: Date;
}

export interface ScenarioChange {
  type: 'sell' | 'buy' | 'hold' | 'switch_regime';
  investmentId?: string;
  amount?: number;
  date?: Date;
  newRegime?: 'old' | 'new';
  description: string;
}

export interface TaxSavingInsight {
  type: 'holding_period' | 'tax_loss_harvesting' | 'regime_switch' | 'deduction_optimization';
  title: string;
  description: string;
  potentialSaving: number;
  actionRequired: string;
  deadline?: Date;
  priority: 'high' | 'medium' | 'low';
}