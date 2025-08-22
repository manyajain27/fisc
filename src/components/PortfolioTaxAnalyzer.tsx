import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  PieChart, 
  AlertTriangle,
  Calendar,
  Calculator
} from 'lucide-react';
import { Portfolio, Investment, CapitalGain } from '@/types/portfolio';
import { TaxCalculator } from '@/lib/taxCalculator';

interface PortfolioTaxAnalyzerProps {
  portfolio: Portfolio;
}

interface TaxBreakdown {
  totalGains: number;
  totalLosses: number;
  stcgGains: number;
  ltcgGains: number;
  stcgTax: number;
  ltcgTax: number;
  totalTax: number;
  exemptionUsed: number;
  exemptionRemaining: number;
}

const PortfolioTaxAnalyzer: React.FC<PortfolioTaxAnalyzerProps> = ({ portfolio }) => {
  const [taxBreakdown, setTaxBreakdown] = useState<TaxBreakdown | null>(null);
  const [capitalGains, setCapitalGains] = useState<CapitalGain[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const taxCalculator = new TaxCalculator();

  useEffect(() => {
    calculateTaxAnalysis();
  }, [portfolio]);

  const calculateTaxAnalysis = () => {
    setLoading(true);
    
    try {
      const gains = portfolio.investments.map(investment => 
        taxCalculator.calculateCapitalGain(investment)
      );

      setCapitalGains(gains);

      const stcgGains = gains.filter(g => g.type === 'STCG');
      const ltcgGains = gains.filter(g => g.type === 'LTCG');

      const totalGains = gains.reduce((sum, g) => sum + Math.max(0, g.gainAmount), 0);
      const totalLosses = gains.reduce((sum, g) => sum + Math.abs(Math.min(0, g.gainAmount)), 0);
      
      const stcgGainsTotal = stcgGains.reduce((sum, g) => sum + Math.max(0, g.gainAmount), 0);
      const ltcgGainsTotal = ltcgGains.reduce((sum, g) => sum + Math.max(0, g.gainAmount), 0);
      
      const stcgTax = stcgGains.reduce((sum, g) => sum + g.taxAmount, 0);
      const ltcgTax = ltcgGains.reduce((sum, g) => sum + g.taxAmount, 0);
      
      const ltcgExemptionUsed = Math.min(ltcgGainsTotal, 100000);
      const exemptionRemaining = Math.max(0, 100000 - ltcgGainsTotal);

      setTaxBreakdown({
        totalGains,
        totalLosses,
        stcgGains: stcgGainsTotal,
        ltcgGains: ltcgGainsTotal,
        stcgTax,
        ltcgTax,
        totalTax: stcgTax + ltcgTax,
        exemptionUsed: ltcgExemptionUsed,
        exemptionRemaining
      });
    } catch (error) {
      console.error('Error calculating tax analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHoldingPeriodColor = (months: number, investmentType: string) => {
    const requiredMonths = investmentType.includes('equity') ? 12 : 36;
    if (months >= requiredMonths) return 'text-success';
    if (months >= requiredMonths * 0.8) return 'text-warning';
    return 'text-destructive';
  };

  const getOptimizationSuggestion = (investment: Investment, gain: CapitalGain) => {
    if (gain.type === 'STCG' && gain.holdingPeriod < 12) {
      const monthsToLTCG = 12 - gain.holdingPeriod;
      const potentialSaving = gain.gainAmount * 0.05; // 15% vs 10%
      return {
        type: 'hold',
        message: `Hold for ${monthsToLTCG} more months to save ₹${potentialSaving.toLocaleString()}`,
        priority: potentialSaving > 10000 ? 'high' : 'medium'
      };
    }
    
    if (gain.gainAmount < 0) {
      return {
        type: 'harvest',
        message: `Consider tax-loss harvesting to offset other gains`,
        priority: 'medium'
      };
    }
    
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing portfolio tax implications...</p>
        </CardContent>
      </Card>
    );
  }

  if (!taxBreakdown) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Error analyzing portfolio tax data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tax Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Gains</p>
                <p className="text-2xl font-bold text-success">
                  ₹{taxBreakdown.totalGains.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Losses</p>
                <p className="text-2xl font-bold text-destructive">
                  ₹{taxBreakdown.totalLosses.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tax</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{taxBreakdown.totalTax.toLocaleString()}
                </p>
              </div>
              <Calculator className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">LTCG Exemption Left</p>
                <p className="text-2xl font-bold text-info">
                  ₹{taxBreakdown.exemptionRemaining.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Tax Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* STCG vs LTCG Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-warning" />
                      Short Term Capital Gains (STCG)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total STCG:</span>
                      <span className="font-medium">₹{taxBreakdown.stcgGains.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax Rate:</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax Amount:</span>
                      <span className="font-bold text-primary">₹{taxBreakdown.stcgTax.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Holding period: Less than 12 months for equity/MF
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-success" />
                      Long Term Capital Gains (LTCG)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total LTCG:</span>
                      <span className="font-medium">₹{taxBreakdown.ltcgGains.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax Rate:</span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exemption Used:</span>
                      <span className="font-medium">₹{taxBreakdown.exemptionUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax Amount:</span>
                      <span className="font-bold text-primary">₹{taxBreakdown.ltcgTax.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Holding period: More than 12 months for equity/MF
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* LTCG Exemption Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">LTCG Exemption Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used: ₹{taxBreakdown.exemptionUsed.toLocaleString()}</span>
                      <span>Remaining: ₹{taxBreakdown.exemptionRemaining.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(taxBreakdown.exemptionUsed / 100000) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Under Section 112A, LTCG on equity above ₹1 lakh is taxed at 10%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="holdings" className="space-y-4">
              <div className="space-y-4">
                {portfolio.investments.map((investment, index) => {
                  const gain = capitalGains[index];
                  if (!gain) return null;

                  return (
                    <Card key={investment.id}>
                      <CardContent className="p-4">
                        <div className="grid md:grid-cols-6 gap-4 items-center">
                          <div className="md:col-span-2">
                            <h4 className="font-medium">{investment.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {investment.type.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge 
                                variant={gain.type === 'LTCG' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {gain.type}
                              </Badge>
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Holding Period</p>
                            <p className={`font-medium ${getHoldingPeriodColor(gain.holdingPeriod, investment.type)}`}>
                              {gain.holdingPeriod} months
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Gain/Loss</p>
                            <p className={`font-medium ${gain.gainAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
                              ₹{gain.gainAmount.toLocaleString()}
                            </p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Tax Rate</p>
                            <p className="font-medium">{gain.taxRate}%</p>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Tax Amount</p>
                            <p className="font-bold text-primary">₹{gain.taxAmount.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-4">
              <div className="space-y-4">
                {portfolio.investments.map((investment, index) => {
                  const gain = capitalGains[index];
                  const suggestion = getOptimizationSuggestion(investment, gain);
                  
                  if (!suggestion) return null;

                  return (
                    <Card key={investment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{investment.name}</h4>
                              <Badge 
                                variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {suggestion.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Current: {gain.type}</span>
                              <span>Gain: ₹{gain.gainAmount.toLocaleString()}</span>
                              <span>Tax: ₹{gain.taxAmount.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {suggestion.type === 'hold' && (
                              <Button variant="outline" size="sm">
                                Set Reminder
                              </Button>
                            )}
                            {suggestion.type === 'harvest' && (
                              <Button variant="outline" size="sm">
                                View Similar Stocks
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTaxAnalyzer;