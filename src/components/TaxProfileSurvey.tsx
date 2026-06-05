import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { User, Wallet, PiggyBank, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface TaxProfile {
  ageGroup: 'below60' | '60to80' | 'above80';
  cityType: 'metro' | 'non-metro';
  employment: 'salaried' | 'self-employed' | 'business';
  grossIncome: number;
  basicMonthly: number;
  hraReceivedMonthly: number;
  rentMonthly: number;
  d80C: number;
  d80D: number;
  d24B: number;
  d80E: number;
  nps80CCD1B: number;
  realisedSTCG: number;
  realisedLTCG: number;
}

export const loadTaxProfile = (): Partial<TaxProfile> => {
  try {
    const raw = localStorage.getItem('fisc_tax_profile');
    return raw ? (JSON.parse(raw) as TaxProfile) : {};
  } catch {
    return {};
  }
};

const DEFAULTS: TaxProfile = {
  ageGroup: 'below60',
  cityType: 'metro',
  employment: 'salaried',
  grossIncome: 1500000,
  basicMonthly: 50000,
  hraReceivedMonthly: 20000,
  rentMonthly: 18000,
  d80C: 150000,
  d80D: 25000,
  d24B: 0,
  d80E: 0,
  nps80CCD1B: 0,
  realisedSTCG: 0,
  realisedLTCG: 0,
};

const Num: React.FC<{
  id: keyof TaxProfile;
  label: string;
  value: number;
  onChange: (k: keyof TaxProfile, v: number) => void;
  hint?: string;
}> = ({ id, label, value, onChange, hint }) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-sm">
      {label}
    </Label>
    <Input
      id={id}
      type="number"
      value={value}
      onChange={(e) => onChange(id, parseFloat(e.target.value) || 0)}
    />
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const TaxProfileSurvey: React.FC = () => {
  const [profile, setProfile] = useState<TaxProfile>(DEFAULTS);
  const navigate = useNavigate();
  const { toast } = useToast();

  const set = (k: keyof TaxProfile, v: number) => setProfile((p) => ({ ...p, [k]: v }));
  const setStr = (k: keyof TaxProfile, v: string) => setProfile((p) => ({ ...p, [k]: v as never }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('fisc_tax_profile', JSON.stringify(profile));
    toast({
      title: 'Profile saved',
      description: 'Your details will be used across the calculators and analysis.',
    });
    navigate('/dashboard');
  };

  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <User className="w-5 h-5 text-primary" />
          Tax Profile Survey
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Fill this once and we'll pre-fill every calculator and tailor your tax analysis.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="w-4 h-4 text-primary" /> About you
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-sm">Age group</Label>
                <Select value={profile.ageGroup} onValueChange={(v) => setStr('ageGroup', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below60">Below 60</SelectItem>
                    <SelectItem value="60to80">60 to 80 (Senior)</SelectItem>
                    <SelectItem value="above80">Above 80 (Super senior)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">City type</Label>
                <Select value={profile.cityType} onValueChange={(v) => setStr('cityType', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="non-metro">Non-metro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Employment</Label>
                <Select value={profile.employment} onValueChange={(v) => setStr('employment', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salaried">Salaried</SelectItem>
                    <SelectItem value="self-employed">Self-employed</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Income & salary */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wallet className="w-4 h-4 text-primary" /> Income &amp; salary
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Num id="grossIncome" label="Annual gross income (₹)" value={profile.grossIncome} onChange={set} />
              <Num id="basicMonthly" label="Basic + DA (monthly ₹)" value={profile.basicMonthly} onChange={set} hint="Used for HRA exemption" />
              <Num id="hraReceivedMonthly" label="HRA received (monthly ₹)" value={profile.hraReceivedMonthly} onChange={set} />
              <Num id="rentMonthly" label="Rent paid (monthly ₹)" value={profile.rentMonthly} onChange={set} />
            </div>
          </section>

          {/* Deductions */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PiggyBank className="w-4 h-4 text-primary" /> Deductions &amp; investments (old regime)
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Num id="d80C" label="Section 80C (₹)" value={profile.d80C} onChange={set} hint="ELSS, PPF, EPF, insurance — max ₹1.5L" />
              <Num id="d80D" label="Section 80D — health insurance (₹)" value={profile.d80D} onChange={set} />
              <Num id="d24B" label="Home loan interest 24B (₹)" value={profile.d24B} onChange={set} hint="Max ₹2L (self-occupied)" />
              <Num id="d80E" label="Education loan interest 80E (₹)" value={profile.d80E} onChange={set} />
              <Num id="nps80CCD1B" label="NPS 80CCD(1B) (₹)" value={profile.nps80CCD1B} onChange={set} hint="Extra ₹50K" />
            </div>
          </section>

          {/* Capital gains */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <TrendingUp className="w-4 h-4 text-primary" /> Capital gains this year
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Num id="realisedSTCG" label="Realised equity STCG (₹)" value={profile.realisedSTCG} onChange={set} hint="Taxed at 20%" />
              <Num id="realisedLTCG" label="Realised equity LTCG (₹)" value={profile.realisedLTCG} onChange={set} hint="12.5% above ₹1.25L" />
            </div>
          </section>

          <Button type="submit" className="w-full">
            <CheckCircle className="w-4 h-4 mr-2" />
            Save profile &amp; view analysis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaxProfileSurvey;
