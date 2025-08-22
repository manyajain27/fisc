import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lightbulb, 
  Clock, 
  TrendingDown, 
  Repeat,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import { Portfolio, TaxSavingInsight } from '@/types/portfolio';
import { TaxCalculator } from '@/lib/taxCalculator';

interface TaxSavingInsightsProps {
  portfolio: Portfolio;
}

interface InsightCard {
  id: string;
  type: TaxSavingInsight['type'];
  title: string;
  description: string;
  potentialSaving: number;
  actionRequired: string;
  deadline?: Date;
  priority: 'high' | 'medium' | 'low';
  implemented?: boolean;
  legalReference: string;
}

const TaxSavingInsights: React.FC<TaxSavingInsightsProps> = ({ portfolio }) => {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [totalPotentialSavings, setTotalPotentialSavings] = useState(0);
  const [implementedInsights, setImplementedInsights] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const taxCalculator = new TaxCalculator();

  useEffect(() => {
    generateInsights();
  }, [portfolio]);

  const generateInsights = () => {
    setLoading(true);
    
    try {
      const generatedInsights: InsightCard[] = [];
      
      // Analyze each investment for insights
      portfolio.investments.forEach((investment, index) => {
        const gain = taxCalculator.calculateCapitalGain(investment);
        const holdingPeriod = taxCalculator.calculateHoldingPeriod(investment.purchaseDate);

        // Holding Period Optimization
        if (gain.type === 'STCG' && holdingPeriod < 12 && investment.type === 'equity') {
          const monthsToLTCG = 12 - holdingPeriod;
          const potentialSaving = gain.gainAmount * 0.05; // 15% to 10%
          
          if (potentialSaving > 5000) {
            generatedInsights.push({
              id: `holding_${investment.id}`,
              type: 'holding_period',
              title: `Hold ${investment.name} for ${monthsToLTCG} more months`,
              description: `Converting to LTCG will reduce tax rate from 15% to 10%, saving you ₹${potentialSaving.toLocaleString()}`,
              potentialSaving,
              actionRequired: `Wait until ${new Date(investment.purchaseDate.getTime() + 12 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} before selling`,
              deadline: new Date(investment.purchaseDate.getTime() + 12 * 30 * 24 * 60 * 60 * 1000),
              priority: potentialSaving > 25000 ? 'high' : 'medium',
              legalReference: 'Section 112A of Income Tax Act, 1961'
            });
          }
        }

        // Tax Loss Harvesting
        if (gain.gainAmount < -10000) {
          generatedInsights.push({
            id: `harvest_${investment.id}`,
            type: 'tax_loss_harvesting',
            title: `Harvest losses from ${investment.name}`,
            description: `Realize losses of ₹${Math.abs(gain.gainAmount).toLocaleString()} to offset other capital gains`,
            potentialSaving: Math.abs(gain.gainAmount) * 0.15, // Assuming STCG offset
            actionRequired: 'Sell the investment and consider buying back after 30 days to avoid wash sale',
            priority: 'medium',
            legalReference: 'Section 70 & 71 of Income Tax Act, 1961'
          });
        }
      });

      // Regime Optimization Insight
      const oldRegimeCalculation = taxCalculator.calculatePortfolioTax(portfolio, 1200000, 'old', []);
      const newRegimeCalculation = taxCalculator.calculatePortfolioTax(portfolio, 1200000, 'new', []);
      const regimeSavings = Math.abs(oldRegimeCalculation.totalTaxLiability - newRegimeCalculation.totalTaxLiability);
      
      if (regimeSavings > 10000) {
        const betterRegime = oldRegimeCalculation.totalTaxLiability < newRegimeCalculation.totalTaxLiability ? 'old' : 'new';
        generatedInsights.push({
          id: 'regime_switch',
          type: 'regime_switch',
          title: `Switch to ${betterRegime} tax regime`,
          description: `Switching to the ${betterRegime} regime can save you ₹${regimeSavings.toLocaleString()} annually`,
          potentialSaving: regimeSavings,
          actionRequired: `File ITR under ${betterRegime} regime for next financial year`,
          deadline: new Date('2024-07-31'),
          priority: regimeSavings > 50000 ? 'high' : 'medium',
          legalReference: 'Section 115BAC of Income Tax Act, 1961'
        });
      }

      // Section 80C Optimization
      const section80CInsight: InsightCard = {
        id: 'section_80c',
        type: 'deduction_optimization',
        title: 'Maximize Section 80C deductions',
        description: 'You can save up to ₹46,500 by maximizing your Section 80C investments',
        potentialSaving: 46500, // 1.5L * 31% (highest slab)
        actionRequired: 'Invest in ELSS, PPF, or other qualifying instruments before March 31st',
        deadline: new Date('2024-03-31'),
        priority: 'high',
        legalReference: 'Section 80C of Income Tax Act, 1961'
      };
      generatedInsights.push(section80CInsight);

      // LTCG Exemption Optimization
      const ltcgGains = portfolio.investments
        .map(inv => taxCalculator.calculateCapitalGain(inv))
        .filter(gain => gain.type === 'LTCG')
        .reduce((sum, gain) => sum + gain.gainAmount, 0);

      if (ltcgGains < 100000 && ltcgGains > 50000) {
        generatedInsights.push({
          id: 'ltcg_exemption',
          type: 'holding_period',
          title: 'Utilize LTCG exemption before year-end',
          description: `You have ₹${(100000 - ltcgGains).toLocaleString()} of LTCG exemption remaining this year`,
          potentialSaving: (100000 - ltcgGains) * 0.1,
          actionRequired: 'Consider booking some LTCG profits before March 31st',
          deadline: new Date('2024-03-31'),
          priority: 'medium',
          legalReference: 'Section 112A of Income Tax Act, 1961'
        });
      }

      // Sort by priority and potential savings
      const sortedInsights = generatedInsights.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.potentialSaving - a.potentialSaving;
      });

      setInsights(sortedInsights);
      setTotalPotentialSavings(sortedInsights.reduce((sum, insight) => sum + insight.potentialSaving, 0));
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsImplemented = (insightId: string) => {
    setImplementedInsights(prev => new Set([...prev, insightId]));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium': return <Clock className="w-4 h-4 text-warning" />;
      case 'low': return <Lightbulb className="w-4 h-4 text-info" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: TaxSavingInsight['type']) => {
    switch (type) {
      case 'holding_period': return <Calendar className="w-5 h-5" />;
      case 'tax_loss_harvesting': return <TrendingDown className="w-5 h-5" />;
      case 'regime_switch': return <Repeat className="w-5 h-5" />;
      case 'deduction_optimization': return <Target className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing tax-saving opportunities...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Zap className="w-6 h-6 text-primary" />
            Tax-Saving Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">₹{totalPotentialSavings.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Potential Savings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success">{insights.length}</p>
              <p className="text-sm text-muted-foreground">Actionable Insights</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-warning">{insights.filter(i => i.priority === 'high').length}</p>
              <p className="text-sm text-muted-foreground">High Priority Items</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Implementation Progress</span>
              <span>{implementedInsights.size}/{insights.length} implemented</span>
            </div>
            <Progress value={(implementedInsights.size / insights.length) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight) => {
          const isImplemented = implementedInsights.has(insight.id);
          const isUrgent = insight.deadline && insight.deadline < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          return (
            <Card key={insight.id} className={`transition-all ${isImplemented ? 'opacity-60' : 'hover:shadow-md'}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(insight.type)}
                      <h3 className={`font-semibold text-lg ${isImplemented ? 'line-through' : ''}`}>
                        {insight.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(insight.priority)}>
                          {getPriorityIcon(insight.priority)}
                          {insight.priority.toUpperCase()}
                        </Badge>
                        {isUrgent && (
                          <Badge variant="destructive">
                            <Clock className="w-3 h-3 mr-1" />
                            URGENT
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground">{insight.description}</p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-success" />
                          <span className="font-medium text-success">
                            Save ₹{insight.potentialSaving.toLocaleString()}
                          </span>
                        </div>
                        
                        {insight.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Deadline: {insight.deadline.toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Action Required:</strong> {insight.actionRequired}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Legal Reference:</strong> {insight.legalReference}
                        </p>
                      </div>
                    </div>

                    {insight.type === 'holding_period' && insight.deadline && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Selling before {insight.deadline.toLocaleDateString()} will result in higher STCG tax rates.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {!isImplemented ? (
                      <Button onClick={() => markAsImplemented(insight.id)} variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Done
                      </Button>
                    ) : (
                      <Badge variant="success" className="self-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Implemented
                      </Badge>
                    )}

                    {insight.deadline && (
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Add Reminder
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {insights.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Great! No immediate tax-saving opportunities found</h3>
            <p className="text-muted-foreground">
              Your portfolio appears to be well-optimized for tax efficiency. 
              We'll continue monitoring for new opportunities.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Tax-Saving Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Target className="w-5 h-5 mb-2 text-primary" />
              <span className="font-medium">Maximize 80C</span>
              <span className="text-xs text-muted-foreground">Invest in ELSS, PPF</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <TrendingDown className="w-5 h-5 mb-2 text-primary" />
              <span className="font-medium">Tax Loss Harvest</span>
              <span className="text-xs text-muted-foreground">Offset capital gains</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Repeat className="w-5 h-5 mb-2 text-primary" />
              <span className="font-medium">Compare Regimes</span>
              <span className="text-xs text-muted-foreground">Old vs New regime</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSavingInsights;