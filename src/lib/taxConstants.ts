import { IndianTaxConstants, Section80Deductions } from '@/types/tax';

export const TAX_CONSTANTS_FY_2025_26: IndianTaxConstants = {
  FY: '2025-26',
  assessmentYear: '2026-27',
  standardDeductions: {
    old: 50000, // Standard deduction under old regime
    new: 75000, // Standard deduction under new regime
  },
  taxSlabs: {
    old: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: null, rate: 30 }
    ],
    // New regime slabs revised in Budget 2025 (w.e.f. FY 2025-26)
    new: [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 5 },
      { min: 800000, max: 1200000, rate: 10 },
      { min: 1200000, max: 1600000, rate: 15 },
      { min: 1600000, max: 2000000, rate: 20 },
      { min: 2000000, max: 2400000, rate: 25 },
      { min: 2400000, max: null, rate: 30 }
    ]
  },
  capitalGainsTax: {
    equity: {
      stcg: 20, // Section 111A (w.e.f. 23-Jul-2024)
      ltcg: {
        rate: 12.5, // Section 112A
        exemption: 125000 // ₹1.25 lakh
      }
    },
    debt: {
      stcg: 0, // As per income tax slab
      ltcg: {
        rate: 12.5, // Section 112, no indexation (w.e.f. 23-Jul-2024)
        indexationAvailable: false
      }
    },
    realEstate: {
      stcg: 0, // As per income tax slab
      ltcg: {
        rate: 12.5, // 12.5% without indexation (or 20% with indexation for pre-23-Jul-2024 buys)
        indexationAvailable: false
      }
    },
    crypto: {
      rate: 30,
      tds: 1,
      noIndexation: true
    }
  },
  cess: 4, // 4% Health and Education Cess
  rebate: {
    // Section 87A: new regime gives full rebate up to ₹12L taxable income (Budget 2025)
    new: { incomeLimit: 1200000, maxRebate: 60000 },
    old: { incomeLimit: 500000, maxRebate: 12500 }
  },
  surchargeRates: [
    { min: 0, max: 5000000, rate: 0 },
    { min: 5000000, max: 10000000, rate: 10 },
    { min: 10000000, max: 20000000, rate: 15 },
    { min: 20000000, max: 50000000, rate: 25 },
    { min: 50000000, max: null, rate: 37 }
  ],
  maxSurchargeNewRegime: 25, // 37% slab not applicable under new regime
  holdingPeriods: {
    equity: 12, // months (listed securities)
    debt: 24,   // months (w.e.f. 23-Jul-2024)
    realEstate: 24, // months
    gold: 24    // months (w.e.f. 23-Jul-2024)
  }
};

// Backwards-compatible alias
export const TAX_CONSTANTS_FY_2024_25 = TAX_CONSTANTS_FY_2025_26;

export const SECTION_80_DEDUCTIONS: Section80Deductions = {
  section80C: {
    maxAmount: 150000,
    investments: [
      'ELSS Mutual Funds',
      'Public Provident Fund (PPF)',
      'National Savings Certificate (NSC)',
      'Unit Linked Insurance Plans (ULIP)',
      'Life Insurance Premiums',
      'Home Loan Principal Repayment',
      'Tax-Saving Fixed Deposits',
      'Employee Provident Fund (EPF)',
      'Voluntary Provident Fund (VPF)',
      'Children Tuition Fees'
    ]
  },
  section80D: {
    individual: 25000,
    seniorCitizen: 50000,
    parents: 25000,
    seniorCitizenParents: 50000
  },
  section80E: {
    description: 'Interest on Education Loan',
    maxAmount: null // No upper limit
  },
  section80G: {
    description: 'Donations to Charitable Organizations',
    deductionRate: 50 // 50% or 100% based on organization
  },
  section24B: {
    description: 'Home Loan Interest Deduction',
    maxAmount: 200000 // For self-occupied property
  }
};

// Deadlines for FY 2025-26 (AY 2026-27)
export const TAX_DEADLINES = {
  advance_tax: {
    q1: '2025-06-15',
    q2: '2025-09-15',
    q3: '2025-12-15',
    q4: '2026-03-15'
  },
  itr_filing: {
    individual: '2026-07-31',
    audit_required: '2026-10-31'
  },
  tds_payment: '2026-07-07', // Monthly by 7th
  quarterly_returns: '2026-07-31'
};