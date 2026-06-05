export interface IndianTaxConstants {
  FY: string;
  assessmentYear: string;
  standardDeductions: {
    old: number;
    new: number;
  };
  taxSlabs: {
    old: TaxSlabRate[];
    new: TaxSlabRate[];
  };
  capitalGainsTax: {
    equity: {
      stcg: number; // 20% (Section 111A, w.e.f. 23-Jul-2024)
      ltcg: {
        rate: number; // 12.5% (Section 112A)
        exemption: number; // 1.25 lakh
      };
    };
    debt: {
      stcg: number; // As per income tax slab
      ltcg: {
        rate: number; // 12.5% without indexation (Section 112)
        indexationAvailable: boolean;
      };
    };
    realEstate: {
      stcg: number; // As per income tax slab
      ltcg: {
        rate: number; // 12.5% without indexation (or 20% with indexation for pre-23-Jul-2024 buys)
        indexationAvailable: boolean;
      };
    };
    crypto: {
      rate: number; // 30%
      tds: number; // 1%
      noIndexation: boolean;
    };
  };
  cess: number; // 4%
  // New regime Section 87A rebate (Budget 2025): full rebate up to this taxable income
  rebate: {
    new: { incomeLimit: number; maxRebate: number };
    old: { incomeLimit: number; maxRebate: number };
  };
  surchargeRates: SurchargeRate[];
  // Surcharge under the new regime is capped (37% slab removed)
  maxSurchargeNewRegime: number;
  holdingPeriods: {
    equity: number; // 12 months (listed securities)
    debt: number; // 24 months
    realEstate: number; // 24 months
    gold: number; // 24 months
  };
}

export interface TaxSlabRate {
  min: number;
  max: number | null;
  rate: number;
}

export interface SurchargeRate {
  min: number;
  max: number | null;
  rate: number;
}

export interface Section80Deductions {
  section80C: {
    maxAmount: number;
    investments: string[];
  };
  section80D: {
    individual: number;
    seniorCitizen: number;
    parents: number;
    seniorCitizenParents: number;
  };
  section80E: {
    description: string;
    maxAmount: number | null;
  };
  section80G: {
    description: string;
    deductionRate: number;
  };
  section24B: {
    description: string;
    maxAmount: number;
  };
}

export interface TaxDeduction {
  section: string;
  amount: number;
  eligibleAmount: number;
  claimedAmount: number;
  description: string;
}

export interface TaxOptimizationSuggestion {
  type: 'deduction' | 'investment' | 'timing' | 'regime';
  title: string;
  description: string;
  potentialSaving: number;
  implementation: string[];
  deadline?: Date;
  legalReference: string;
}