import { IndianTaxConstants, Section80Deductions } from '@/types/tax';

export const TAX_CONSTANTS_FY_2024_25: IndianTaxConstants = {
  FY: '2024-25',
  assessmentYear: '2025-26',
  standardDeductions: {
    old: 50000, // Standard deduction under old regime
    new: 75000, // Standard deduction under new regime (updated)
  },
  taxSlabs: {
    old: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: null, rate: 30 }
    ],
    new: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 700000, rate: 5 },
      { min: 700000, max: 1000000, rate: 10 },
      { min: 1000000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: null, rate: 30 }
    ]
  },
  capitalGainsTax: {
    equity: {
      stcg: 15,
      ltcg: {
        rate: 10,
        exemption: 100000
      }
    },
    debt: {
      stcg: 0, // As per income tax slab
      ltcg: {
        rate: 20,
        indexationAvailable: true
      }
    },
    realEstate: {
      stcg: 0, // As per income tax slab
      ltcg: {
        rate: 20,
        indexationAvailable: true
      }
    },
    crypto: {
      rate: 30,
      tds: 1,
      noIndexation: true
    }
  },
  cess: 4, // 4% Health and Education Cess
  surchargeRates: [
    { min: 0, max: 5000000, rate: 0 },
    { min: 5000000, max: 10000000, rate: 10 },
    { min: 10000000, max: 20000000, rate: 15 },
    { min: 20000000, max: 50000000, rate: 25 },
    { min: 50000000, max: null, rate: 37 }
  ],
  holdingPeriods: {
    equity: 12, // months
    debt: 36,   // months
    realEstate: 24, // months
    gold: 36    // months
  }
};

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

export const TAX_DEADLINES = {
  advance_tax: {
    q1: '2024-06-15',
    q2: '2024-09-15',
    q3: '2024-12-15',
    q4: '2025-03-15'
  },
  itr_filing: {
    individual: '2024-07-31',
    audit_required: '2024-10-31'
  },
  tds_payment: '2024-07-07', // Monthly by 7th
  quarterly_returns: '2024-07-31'
};