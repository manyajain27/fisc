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
      stcg: number; // 15%
      ltcg: {
        rate: number; // 10%
        exemption: number; // 1 lakh
      };
    };
    debt: {
      stcg: number; // As per income tax slab
      ltcg: {
        rate: number; // 20% with indexation
        indexationAvailable: boolean;
      };
    };
    realEstate: {
      stcg: number; // As per income tax slab
      ltcg: {
        rate: number; // 20% with indexation
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
  surchargeRates: SurchargeRate[];
  holdingPeriods: {
    equity: number; // 12 months
    debt: number; // 36 months
    realEstate: number; // 24 months
    gold: number; // 36 months
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