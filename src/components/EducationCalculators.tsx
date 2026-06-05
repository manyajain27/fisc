import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TaxCalculator } from '@/lib/taxCalculator';
import { TAX_CONSTANTS_FY_2025_26 as C, SECTION_80_DEDUCTIONS } from '@/lib/taxConstants';
import { loadTaxProfile } from '@/components/TaxProfileSurvey';

const tc = new TaxCalculator();
const profile = loadTaxProfile();
const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

// Whole calendar months between two dates (matches TaxCalculator)
const monthsBetween = (from: Date, to: Date) => {
  let m = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) m -= 1;
  return Math.max(0, m);
};

const Row: React.FC<{ label: string; value: string; strong?: boolean; tone?: 'success' | 'destructive' }> = ({
  label,
  value,
  strong,
  tone,
}) => (
  <div className="flex justify-between text-sm py-1">
    <span className="text-muted-foreground">{label}</span>
    <span
      className={`${strong ? 'font-bold' : 'font-medium'} ${
        tone === 'success' ? 'text-success' : tone === 'destructive' ? 'text-destructive' : ''
      }`}
    >
      {value}
    </span>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1">
    <Label className="text-xs">{label}</Label>
    {children}
  </div>
);

/* ----------------------------- Capital Gains ----------------------------- */
const CapitalGainsCalc: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10);
  const [assetType, setAssetType] = useState<'equity' | 'debt' | 'real_estate' | 'crypto'>('equity');
  const [purchasePrice, setPurchasePrice] = useState(100000);
  const [salePrice, setSalePrice] = useState(180000);
  const [purchaseDate, setPurchaseDate] = useState('2023-01-01');
  const [saleDate, setSaleDate] = useState(today);

  const result = useMemo(() => {
    const holding = monthsBetween(new Date(purchaseDate), new Date(saleDate));
    const ltThreshold = assetType === 'equity' ? C.holdingPeriods.equity : 24;
    const isLT = holding >= ltThreshold;
    const gain = salePrice - purchasePrice;

    let rate = 0;
    let exemption = 0;
    let slabNote = false;

    if (assetType === 'crypto') {
      rate = C.capitalGainsTax.crypto.rate; // 30% flat, no LT/ST
    } else if (assetType === 'equity') {
      if (isLT) {
        rate = C.capitalGainsTax.equity.ltcg.rate;
        exemption = C.capitalGainsTax.equity.ltcg.exemption;
      } else {
        rate = C.capitalGainsTax.equity.stcg;
      }
    } else {
      // debt / real estate
      if (isLT) rate = C.capitalGainsTax.debt.ltcg.rate;
      else slabNote = true; // STCG taxed at slab
    }

    const taxableGain = Math.max(0, gain - exemption);
    const tax = slabNote ? 0 : (taxableGain * rate) / 100;

    return { holding, isLT, gain, rate, exemption, taxableGain, tax, slabNote };
  }, [assetType, purchasePrice, salePrice, purchaseDate, saleDate]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Asset Type">
          <Select value={assetType} onValueChange={(v) => setAssetType(v as typeof assetType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="equity">Equity / Equity MF</SelectItem>
              <SelectItem value="debt">Debt / Bonds</SelectItem>
              <SelectItem value="real_estate">Real Estate</SelectItem>
              <SelectItem value="crypto">Crypto (VDA)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Purchase Price (₹)">
          <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(+e.target.value || 0)} />
        </Field>
        <Field label="Sale Price (₹)">
          <Input type="number" value={salePrice} onChange={(e) => setSalePrice(+e.target.value || 0)} />
        </Field>
        <Field label="Purchase Date">
          <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
        </Field>
        <Field label="Sale Date">
          <Input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
        </Field>
      </div>

      <div className="rounded-lg border p-4 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Result</span>
          {assetType !== 'crypto' && (
            <Badge variant={result.isLT ? 'default' : 'secondary'}>
              {result.isLT ? 'Long Term (LTCG)' : 'Short Term (STCG)'}
            </Badge>
          )}
        </div>
        <Row label="Holding period" value={`${result.holding} months`} />
        <Row label="Capital gain" value={inr(result.gain)} tone={result.gain >= 0 ? 'success' : 'destructive'} />
        {result.exemption > 0 && <Row label="LTCG exemption (Sec 112A)" value={inr(result.exemption)} />}
        {!result.slabNote && <Row label="Tax rate" value={`${result.rate}%`} />}
        {result.slabNote ? (
          <Row label="Tax" value="As per income slab" />
        ) : (
          <Row label="Tax payable (excl. cess)" value={inr(result.tax)} strong />
        )}
        <p className="text-xs text-muted-foreground mt-2">
          FY 2025-26 rates. {assetType === 'equity' ? 'Equity STCG 20% (Sec 111A), LTCG 12.5% above ₹1.25L (Sec 112A).' : ''}
          {assetType === 'crypto' ? 'VDA taxed at flat 30% + 1% TDS, no loss set-off.' : ''}
          {(assetType === 'debt' || assetType === 'real_estate') ? 'LTCG 12.5% without indexation; STCG at slab rate.' : ''}
          {' '}Add 4% health &amp; education cess on the tax.
        </p>
      </div>
    </div>
  );
};

/* ----------------------------- Regime Comparator ----------------------------- */
const regimeTax = (taxable: number, regime: 'old' | 'new') => {
  const gross = tc.calculateIncomeTax(taxable, regime);
  const rebate = tc.calculateRebate(taxable, gross, regime, taxable);
  const net = Math.max(0, gross - rebate);
  const surcharge = tc.calculateSurcharge(taxable, net, regime);
  const cess = tc.calculateCess(net + surcharge);
  return { net, surcharge, cess, total: net + surcharge + cess, rebate };
};

const RegimeComparatorCalc: React.FC = () => {
  const [income, setIncome] = useState(profile.grossIncome ?? 1500000);
  const [d80C, setD80C] = useState(profile.d80C ?? 150000);
  const [d80D, setD80D] = useState(profile.d80D ?? 25000);
  const [hra, setHra] = useState(0);
  const [d24B, setD24B] = useState(profile.d24B ?? 0);

  const r = useMemo(() => {
    const oldDeductions =
      C.standardDeductions.old +
      Math.min(d80C, SECTION_80_DEDUCTIONS.section80C.maxAmount) +
      d80D +
      hra +
      Math.min(d24B, SECTION_80_DEDUCTIONS.section24B.maxAmount);
    const oldTaxable = Math.max(0, income - oldDeductions);
    const newTaxable = Math.max(0, income - C.standardDeductions.new);

    const oldR = regimeTax(oldTaxable, 'old');
    const newR = regimeTax(newTaxable, 'new');
    const better = newR.total <= oldR.total ? 'new' : 'old';
    return { oldTaxable, newTaxable, oldR, newR, better, savings: Math.abs(oldR.total - newR.total) };
  }, [income, d80C, d80D, hra, d24B]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Annual Gross Income (₹)">
          <Input type="number" value={income} onChange={(e) => setIncome(+e.target.value || 0)} />
        </Field>
        <Field label="Section 80C (max ₹1.5L)">
          <Input type="number" value={d80C} onChange={(e) => setD80C(+e.target.value || 0)} />
        </Field>
        <Field label="Section 80D (health)">
          <Input type="number" value={d80D} onChange={(e) => setD80D(+e.target.value || 0)} />
        </Field>
        <Field label="HRA exemption">
          <Input type="number" value={hra} onChange={(e) => setHra(+e.target.value || 0)} />
        </Field>
        <Field label="Home loan interest (24B, max ₹2L)">
          <Input type="number" value={d24B} onChange={(e) => setD24B(+e.target.value || 0)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`rounded-lg border p-3 ${r.better === 'old' ? 'ring-2 ring-primary' : ''}`}>
          <div className="font-medium mb-1 text-sm">Old Regime</div>
          <Row label="Taxable" value={inr(r.oldTaxable)} />
          <Row label="Tax" value={inr(r.oldR.net)} />
          <Row label="Cess + surcharge" value={inr(r.oldR.cess + r.oldR.surcharge)} />
          <Row label="Total" value={inr(r.oldR.total)} strong />
        </div>
        <div className={`rounded-lg border p-3 ${r.better === 'new' ? 'ring-2 ring-primary' : ''}`}>
          <div className="font-medium mb-1 text-sm">New Regime</div>
          <Row label="Taxable" value={inr(r.newTaxable)} />
          <Row label="Tax" value={inr(r.newR.net)} />
          {r.newR.rebate > 0 && <Row label="87A rebate" value={'-' + inr(r.newR.rebate)} tone="success" />}
          <Row label="Cess + surcharge" value={inr(r.newR.cess + r.newR.surcharge)} />
          <Row label="Total" value={inr(r.newR.total)} strong />
        </div>
      </div>

      <div className="text-center rounded-lg bg-success/10 p-3">
        <Badge className="mb-1">{r.better === 'new' ? 'New Regime' : 'Old Regime'} is better</Badge>
        <p className="text-success font-bold text-lg">You save {inr(r.savings)}</p>
        <p className="text-xs text-muted-foreground">FY 2025-26 slabs. New regime is the default; income up to ₹12L is rebated to nil.</p>
      </div>
    </div>
  );
};

/* ----------------------------- SIP Tax Calculator ----------------------------- */
const SipTaxCalc: React.FC = () => {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [assetType, setAssetType] = useState<'equity' | 'debt'>('equity');

  const r = useMemo(() => {
    const months = years * 12;
    const i = annualReturn / 100 / 12;
    const invested = monthly * months;
    const fv = i > 0 ? monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i) : invested;
    const gains = fv - invested;
    // SIPs held over the full horizon are treated as long term
    const exemption = assetType === 'equity' ? C.capitalGainsTax.equity.ltcg.exemption : 0;
    const rate = assetType === 'equity' ? C.capitalGainsTax.equity.ltcg.rate : C.capitalGainsTax.debt.ltcg.rate;
    const taxableGain = Math.max(0, gains - exemption);
    const tax = (taxableGain * rate) / 100;
    return { invested, fv, gains, tax, postTax: fv - tax, rate, exemption };
  }, [monthly, years, annualReturn, assetType]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Monthly SIP (₹)">
          <Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value || 0)} />
        </Field>
        <Field label="Duration (years)">
          <Input type="number" value={years} onChange={(e) => setYears(+e.target.value || 0)} />
        </Field>
        <Field label="Expected Return (% p.a.)">
          <Input type="number" value={annualReturn} onChange={(e) => setAnnualReturn(+e.target.value || 0)} />
        </Field>
        <Field label="Fund Type">
          <Select value={assetType} onValueChange={(v) => setAssetType(v as typeof assetType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="equity">Equity / ELSS</SelectItem>
              <SelectItem value="debt">Debt</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="rounded-lg border p-4 bg-muted/30">
        <Row label="Total invested" value={inr(r.invested)} />
        <Row label="Future value" value={inr(r.fv)} tone="success" />
        <Row label="Estimated gains" value={inr(r.gains)} />
        {r.exemption > 0 && <Row label="LTCG exemption" value={inr(r.exemption)} />}
        <Row label={`Estimated LTCG tax (${r.rate}%)`} value={inr(r.tax)} />
        <Row label="Post-tax value" value={inr(r.postTax)} strong tone="success" />
        <p className="text-xs text-muted-foreground mt-2">
          Assumes the corpus is redeemed as long-term. Equity LTCG 12.5% above ₹1.25L; ELSS has a 3-year lock-in.
        </p>
      </div>
    </div>
  );
};

/* ----------------------------- HRA Exemption ----------------------------- */
const HraCalc: React.FC = () => {
  const [basic, setBasic] = useState(profile.basicMonthly ?? 50000);
  const [hraReceived, setHraReceived] = useState(profile.hraReceivedMonthly ?? 20000);
  const [rent, setRent] = useState(profile.rentMonthly ?? 18000);
  const [metro, setMetro] = useState<'metro' | 'non-metro'>(profile.cityType ?? 'metro');

  const r = useMemo(() => {
    // Monthly inputs -> annualise
    const basicA = basic * 12;
    const hraA = hraReceived * 12;
    const rentA = rent * 12;
    const ruleA = hraA;
    const ruleB = Math.max(0, rentA - 0.1 * basicA);
    const ruleC = (metro === 'metro' ? 0.5 : 0.4) * basicA;
    const exempt = Math.max(0, Math.min(ruleA, ruleB, ruleC));
    const taxable = Math.max(0, hraA - exempt);
    return { ruleA, ruleB, ruleC, exempt, taxable };
  }, [basic, hraReceived, rent, metro]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Basic + DA (monthly ₹)">
          <Input type="number" value={basic} onChange={(e) => setBasic(+e.target.value || 0)} />
        </Field>
        <Field label="HRA received (monthly ₹)">
          <Input type="number" value={hraReceived} onChange={(e) => setHraReceived(+e.target.value || 0)} />
        </Field>
        <Field label="Rent paid (monthly ₹)">
          <Input type="number" value={rent} onChange={(e) => setRent(+e.target.value || 0)} />
        </Field>
        <Field label="City">
          <Select value={metro} onValueChange={(v) => setMetro(v as typeof metro)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="metro">Metro (50%)</SelectItem>
              <SelectItem value="non-metro">Non-metro (40%)</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="rounded-lg border p-4 bg-muted/30">
        <p className="text-xs font-medium mb-1">Exemption is the least of (annual):</p>
        <Row label="Actual HRA received" value={inr(r.ruleA)} />
        <Row label="Rent − 10% of basic" value={inr(r.ruleB)} />
        <Row label={`${metro === 'metro' ? '50%' : '40%'} of basic`} value={inr(r.ruleC)} />
        <hr className="my-2" />
        <Row label="Exempt HRA (per year)" value={inr(r.exempt)} strong tone="success" />
        <Row label="Taxable HRA (per year)" value={inr(r.taxable)} />
        <p className="text-xs text-muted-foreground mt-2">
          HRA exemption under Section 10(13A) is available only in the old regime.
        </p>
      </div>
    </div>
  );
};

/* ----------------------------- Dialog wrapper ----------------------------- */
const CALCULATORS: Record<string, { title: string; body: React.ReactNode }> = {
  'capital-gains-calc': { title: 'Capital Gains Calculator', body: <CapitalGainsCalc /> },
  'regime-comparison': { title: 'Tax Regime Comparator', body: <RegimeComparatorCalc /> },
  'sip-tax-calc': { title: 'SIP Tax Calculator', body: <SipTaxCalc /> },
  'hra-calc': { title: 'HRA Exemption Calculator', body: <HraCalc /> },
};

export const CalculatorDialog: React.FC<{ calcId: string; trigger: React.ReactNode }> = ({ calcId, trigger }) => {
  const calc = CALCULATORS[calcId];
  if (!calc) return <>{trigger}</>;
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{calc.title}</DialogTitle>
        </DialogHeader>
        {calc.body}
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorDialog;
