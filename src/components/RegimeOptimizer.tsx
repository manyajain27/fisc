import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingDown, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { TaxCalculator } from '@/lib/taxCalculator';
import { Portfolio, TaxDeduction } from '@/types/portfolio';
import { SECTION_80_DEDUCTIONS } from '@/lib/taxConstants';

interface RegimeOptimizerProps {
  portfolio?: Portfolio;
}

const RegimeOptimizer: React.FC<RegimeOptimizerProps> = ({ portfolio }) => {
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [deductions, setDeductions] = useState<{[key: string]: number}>({
    '80C': 150000,
    '80D': 25000,
    '24B': 200000,
    '80E': 0,
    '80G': 0
  });
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const taxCalculator = new TaxCalculator();

  const calculateComparison = async () => {
    if (!portfolio) return;
    
    setLoading(true);
    
    try {
      // Prepare deductions for old regime
      const oldRegimeDeductions: TaxDeduction[] = [
        {
          section: '80C',
          amount: deductions['80C'],
          eligibleAmount: SECTION_80_DEDUCTIONS.section80C.maxAmount,
          claimedAmount: Math.min(deductions['80C'], SECTION_80_DEDUCTIONS.section80C.maxAmount),
          description: 'Tax-saving investments'
        },
        {
          section: '80D',
          amount: deductions['80D'],
          eligibleAmount: SECTION_80_DEDUCTIONS.section80D.individual,
          claimedAmount: Math.min(deductions['80D'], SECTION_80_DEDUCTIONS.section80D.individual),
          description: 'Health insurance premiums'
        },
        {
          section: '24B',
          amount: deductions['24B'],
          eligibleAmount: SECTION_80_DEDUCTIONS.section24B.maxAmount,
          claimedAmount: Math.min(deductions['24B'], SECTION_80_DEDUCTIONS.section24B.maxAmount),
          description: 'Home loan interest'
        }
      ];

      const result = taxCalculator.compareRegimes(portfolio, grossIncome, oldRegimeDeductions, []);
      setComparison(result);
    } catch (error) {
      console.error('Error calculating tax comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (portfolio) {
      calculateComparison();
    }
  }, [grossIncome, deductions, portfolio]);

  const handleDeductionChange = (section: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setDeductions(prev => ({
      ...prev,
      [section]: numValue
    }));
  };

  if (!portfolio) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please upload a portfolio to use the regime optimizer</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Tax Regime & Deduction Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Income Input */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="gross-income">Annual Gross Income (₹)</Label>
                <Input
                  id="gross-income"
                  type="number"
                  value={grossIncome}
                  onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                  placeholder="Enter your annual income"
                />
              </div>

              {/* Deductions for Old Regime */}
              <div className="space-y-3">
                <h4 className="font-medium">Deductions (Old Regime)</h4>
                
                <div>
                  <Label htmlFor="80c">Section 80C (Max: ₹1.5L)</Label>
                  <Input
                    id="80c"
                    type="number"
                    value={deductions['80C']}
                    onChange={(e) => handleDeductionChange('80C', e.target.value)}
                    max={150000}
                    placeholder="ELSS, PPF, Insurance, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="80d">Section 80D (Max: ₹25K)</Label>
                  <Input
                    id="80d"
                    type="number"
                    value={deductions['80D']}
                    onChange={(e) => handleDeductionChange('80D', e.target.value)}
                    max={25000}
                    placeholder="Health insurance premiums"
                  />
                </div>

                <div>
                  <Label htmlFor="24b">Section 24B (Max: ₹2L)</Label>
                  <Input
                    id="24b"
                    type="number"
                    value={deductions['24B']}
                    onChange={(e) => handleDeductionChange('24B', e.target.value)}
                    max={200000}
                    placeholder="Home loan interest"
                  />
                </div>
              </div>
            </div>

            {/* Comparison Results */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Calculating...</p>
                </div>
              ) : comparison ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge 
                      variant={comparison.recommendation === 'new' ? 'default' : 'secondary'}
                      className="text-lg px-4 py-2"
                    >
                      {comparison.recommendation === 'new' ? 'New Regime' : 'Old Regime'} Recommended
                    </Badge>
                    <p className="text-2xl font-bold text-success mt-2">
                      Save ₹{comparison.savings.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className={comparison.recommendation === 'old' ? 'ring-2 ring-primary' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          Old Regime
                          {comparison.recommendation === 'old' && <CheckCircle className="w-4 h-4 text-success" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Income Tax:</span>
                          <span>₹{comparison.old.incomeTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Capital Gains Tax:</span>
                          <span>₹{comparison.old.capitalGainsTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Cess & Surcharge:</span>
                          <span>₹{(comparison.old.cess + comparison.old.surcharge).toLocaleString()}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-medium">
                          <span>Total Tax:</span>
                          <span>₹{comparison.old.totalTaxLiability.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Effective Rate:</span>
                          <span>{comparison.old.effectiveRate.toFixed(1)}%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={comparison.recommendation === 'new' ? 'ring-2 ring-primary' : ''}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          New Regime
                          {comparison.recommendation === 'new' && <CheckCircle className="w-4 h-4 text-success" />}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Income Tax:</span>
                          <span>₹{comparison.new.incomeTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Capital Gains Tax:</span>
                          <span>₹{comparison.new.capitalGainsTax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Cess & Surcharge:</span>
                          <span>₹{(comparison.new.cess + comparison.new.surcharge).toLocaleString()}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-medium">
                          <span>Total Tax:</span>
                          <span>₹{comparison.new.totalTaxLiability.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Effective Rate:</span>
                          <span>{comparison.new.effectiveRate.toFixed(1)}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deduction Recommendations */}
      {comparison && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deduction Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="80c">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="80c">Section 80C</TabsTrigger>
                <TabsTrigger value="80d">Section 80D</TabsTrigger>
                <TabsTrigger value="24b">Section 24B</TabsTrigger>
              </TabsList>
              
              <TabsContent value="80c" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Section 80C - Tax Saving Investments</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Under Section 80C of Income Tax Act, 1961, you can claim deduction up to ₹1.5 lakhs.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Recommended Investments:</h5>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• ELSS Mutual Funds (3-year lock-in)</li>
                        <li>• Public Provident Fund (15-year lock-in)</li>
                        <li>• Employee Provident Fund</li>
                        <li>• Life Insurance Premiums</li>
                        <li>• Tax-saving Fixed Deposits</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Current Status:</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Claimed:</span>
                          <span>₹{deductions['80C'].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Remaining:</span>
                          <span>₹{(150000 - deductions['80C']).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span>Potential Saving:</span>
                          <span className="text-success">₹{((150000 - deductions['80C']) * 0.3).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="80d" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Section 80D - Health Insurance</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Under Section 80D, you can claim deduction for health insurance premiums.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Eligible Premiums:</h5>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Self & Family: ₹25,000</li>
                        <li>• Parents (below 60): ₹25,000</li>
                        <li>• Senior Citizen Parents: ₹50,000</li>
                        <li>• Preventive Health Check-up: ₹5,000</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Recommendation:</h5>
                      <p className="text-xs text-muted-foreground">
                        Consider comprehensive health insurance to maximize this deduction 
                        while securing your family's health.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="24b" className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Section 24B - Home Loan Interest</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Under Section 24B, you can claim deduction for home loan interest up to ₹2 lakhs for self-occupied property.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Claim:</span>
                      <span>₹{deductions['24B'].toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Maximum Allowed:</span>
                      <span>₹2,00,000</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Note: For let-out property, there's no upper limit on interest deduction under Section 24B.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RegimeOptimizer;