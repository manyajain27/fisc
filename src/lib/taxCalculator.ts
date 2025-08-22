import { Investment, Portfolio, TaxCalculation, CapitalGain, TaxDeduction } from '@/types/portfolio';
import { TaxSlabRate, IndianTaxConstants } from '@/types/tax';
import { TAX_CONSTANTS_FY_2024_25, SECTION_80_DEDUCTIONS } from './taxConstants';

export class TaxCalculator {
  private constants: IndianTaxConstants;

  constructor() {
    this.constants = TAX_CONSTANTS_FY_2024_25;
  }

  calculateHoldingPeriod(purchaseDate: Date, saleDate: Date = new Date()): number {
    const diffTime = Math.abs(saleDate.getTime() - purchaseDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)); // in months
  }

  isLongTermCapitalGain(investment: Investment, saleDate: Date = new Date()): boolean {
    const holdingPeriod = this.calculateHoldingPeriod(investment.purchaseDate, saleDate);
    
    switch (investment.type) {
      case 'equity':
      case 'mutual_fund':
        return holdingPeriod >= this.constants.holdingPeriods.equity;
      case 'bond':
      case 'fd':
        return holdingPeriod >= this.constants.holdingPeriods.debt;
      case 'real_estate':
        return holdingPeriod >= this.constants.holdingPeriods.realEstate;
      default:
        return holdingPeriod >= this.constants.holdingPeriods.debt;
    }
  }

  calculateCapitalGain(investment: Investment, salePrice?: number): CapitalGain {
    const currentPrice = salePrice || investment.currentPrice;
    const purchaseValue = investment.quantity * investment.purchasePrice;
    const currentValue = investment.quantity * currentPrice;
    const totalCosts = (investment.brokerageFee || 0) + (investment.stampDuty || 0) + 
                      (investment.stt || 0) + (investment.gst || 0);
    
    const gainAmount = currentValue - purchaseValue - totalCosts;
    const isLTCG = this.isLongTermCapitalGain(investment);
    const holdingPeriod = this.calculateHoldingPeriod(investment.purchaseDate);

    let taxRate = 0;
    let exemptionAvailable = 0;

    if (investment.type === 'equity' || investment.type === 'mutual_fund') {
      if (isLTCG) {
        taxRate = this.constants.capitalGainsTax.equity.ltcg.rate;
        exemptionAvailable = this.constants.capitalGainsTax.equity.ltcg.exemption;
      } else {
        taxRate = this.constants.capitalGainsTax.equity.stcg;
      }
    } else if (investment.type === 'bond' || investment.type === 'fd') {
      if (isLTCG) {
        taxRate = this.constants.capitalGainsTax.debt.ltcg.rate;
      } else {
        taxRate = 0; // Will be taxed as per income tax slab
      }
    } else if (investment.type === 'crypto') {
      taxRate = this.constants.capitalGainsTax.crypto.rate;
    }

    const taxableGain = Math.max(0, gainAmount - exemptionAvailable);
    const taxAmount = (taxableGain * taxRate) / 100;

    return {
      investmentId: investment.id,
      investmentName: investment.name,
      type: isLTCG ? 'LTCG' : 'STCG',
      gainAmount,
      taxRate,
      taxAmount,
      holdingPeriod,
      exemptionAvailable: exemptionAvailable > 0 ? exemptionAvailable : undefined,
      indexationBenefit: isLTCG && this.constants.capitalGainsTax.debt.ltcg.indexationAvailable ? 
                        purchaseValue * 0.05 : undefined // Simplified indexation
    };
  }

  calculateIncomeTax(taxableIncome: number, regime: 'old' | 'new'): number {
    const slabs = this.constants.taxSlabs[regime];
    let tax = 0;

    for (const slab of slabs) {
      if (taxableIncome <= slab.min) break;
      
      const taxableAtSlab = slab.max ? 
        Math.min(taxableIncome, slab.max) - slab.min :
        taxableIncome - slab.min;
      
      tax += (taxableAtSlab * slab.rate) / 100;
    }

    return tax;
  }

  calculateSurcharge(income: number, tax: number): number {
    for (const rate of this.constants.surchargeRates) {
      if (income >= rate.min && (rate.max === null || income <= rate.max)) {
        return (tax * rate.rate) / 100;
      }
    }
    return 0;
  }

  calculateCess(taxPlusSurcharge: number): number {
    return (taxPlusSurcharge * this.constants.cess) / 100;
  }

  optimizeDeductions(income: number, regime: 'old' | 'new'): TaxDeduction[] {
    const deductions: TaxDeduction[] = [];

    if (regime === 'old') {
      // Section 80C
      deductions.push({
        section: '80C',
        amount: SECTION_80_DEDUCTIONS.section80C.maxAmount,
        eligibleAmount: SECTION_80_DEDUCTIONS.section80C.maxAmount,
        claimedAmount: 0,
        description: 'Tax-saving investments and expenses'
      });

      // Section 80D
      deductions.push({
        section: '80D',
        amount: SECTION_80_DEDUCTIONS.section80D.individual,
        eligibleAmount: SECTION_80_DEDUCTIONS.section80D.individual,
        claimedAmount: 0,
        description: 'Health insurance premiums'
      });

      // Section 24B (Home loan interest)
      deductions.push({
        section: '24B',
        amount: SECTION_80_DEDUCTIONS.section24B.maxAmount,
        eligibleAmount: SECTION_80_DEDUCTIONS.section24B.maxAmount,
        claimedAmount: 0,
        description: 'Home loan interest deduction'
      });
    }

    return deductions;
  }

  calculatePortfolioTax(
    portfolio: Portfolio, 
    grossIncome: number, 
    regime: 'old' | 'new',
    deductions: TaxDeduction[] = []
  ): TaxCalculation {
    // Calculate capital gains
    const capitalGains = portfolio.investments.map(investment => 
      this.calculateCapitalGain(investment)
    ).filter(gain => gain.gainAmount > 0);

    const capitalGainsTax = capitalGains.reduce((total, gain) => total + gain.taxAmount, 0);
    const totalCapitalGains = capitalGains.reduce((total, gain) => total + gain.gainAmount, 0);

    // Standard deduction
    const standardDeduction = this.constants.standardDeductions[regime];

    // Total deductions
    const totalDeductions = deductions.reduce((total, deduction) => 
      total + deduction.claimedAmount, 0) + standardDeduction;

    // Taxable income (excluding capital gains)
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    // Income tax calculation
    const incomeTax = this.calculateIncomeTax(taxableIncome, regime);
    const surcharge = this.calculateSurcharge(taxableIncome, incomeTax);
    const cess = this.calculateCess(incomeTax + surcharge);

    const totalTax = incomeTax + surcharge + cess;
    const totalTaxLiability = totalTax + capitalGainsTax;
    const effectiveRate = grossIncome > 0 ? (totalTaxLiability / grossIncome) * 100 : 0;

    return {
      portfolioId: portfolio.id,
      regime,
      grossIncome,
      standardDeduction,
      totalDeductions,
      taxableIncome,
      incomeTax,
      cess,
      surcharge,
      totalTax,
      capitalGains,
      capitalGainsTax,
      totalTaxLiability,
      effectiveRate,
      calculatedAt: new Date()
    };
  }

  compareRegimes(
    portfolio: Portfolio, 
    grossIncome: number, 
    oldRegimeDeductions: TaxDeduction[] = [],
    newRegimeDeductions: TaxDeduction[] = []
  ): { old: TaxCalculation; new: TaxCalculation; savings: number; recommendation: 'old' | 'new' } {
    const oldRegimeCalculation = this.calculatePortfolioTax(portfolio, grossIncome, 'old', oldRegimeDeductions);
    const newRegimeCalculation = this.calculatePortfolioTax(portfolio, grossIncome, 'new', newRegimeDeductions);

    const savings = oldRegimeCalculation.totalTaxLiability - newRegimeCalculation.totalTaxLiability;
    const recommendation = savings > 0 ? 'new' : 'old';

    return {
      old: oldRegimeCalculation,
      new: newRegimeCalculation,
      savings: Math.abs(savings),
      recommendation
    };
  }

  generateTaxSavingInsights(portfolio: Portfolio, calculation: TaxCalculation) {
    const insights = [];

    // Check holding period optimization
    for (const investment of portfolio.investments) {
      const holdingPeriod = this.calculateHoldingPeriod(investment.purchaseDate);
      const requiredPeriod = investment.type === 'equity' ? 12 : 36;
      
      if (holdingPeriod < requiredPeriod) {
        const monthsToLTCG = requiredPeriod - holdingPeriod;
        insights.push({
          type: 'holding_period' as const,
          title: `Hold ${investment.name} for ${monthsToLTCG} more months`,
          description: `Converting to LTCG can reduce tax rate from 15% to 10%`,
          potentialSaving: investment.quantity * (investment.currentPrice - investment.purchasePrice) * 0.05,
          actionRequired: `Wait ${monthsToLTCG} months before selling`,
          priority: 'medium' as const
        });
      }
    }

    return insights;
  }
}