import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  Compare,
  TrendingUp,
  TrendingDown,
  Calculator,
  AlertCircle
} from 'lucide-react';
import { Portfolio, Investment, ScenarioSimulation, ScenarioChange, TaxCalculation } from '@/types/portfolio';
import { TaxCalculator } from '@/lib/taxCalculator';

interface ScenarioSimulatorProps {
  portfolio: Portfolio;
}

interface SimulationScenario {
  id: string;
  name: string;
  changes: ScenarioChange[];
  result?: TaxCalculation;
  savings?: number;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ portfolio }) => {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [currentChange, setCurrentChange] = useState<Partial<ScenarioChange>>({
    type: 'sell',
    description: ''
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [baselineCalculation, setBaselineCalculation] = useState<TaxCalculation | null>(null);
  const [grossIncome, setGrossIncome] = useState(1200000);

  const taxCalculator = new TaxCalculator();

  useEffect(() => {
    calculateBaseline();
  }, [portfolio, grossIncome]);

  const calculateBaseline = () => {
    const baseline = taxCalculator.calculatePortfolioTax(portfolio, grossIncome, 'old', []);
    setBaselineCalculation(baseline);
  };

  const createScenario = () => {
    if (!newScenarioName.trim()) return;

    const newScenario: SimulationScenario = {
      id: `scenario_${Date.now()}`,
      name: newScenarioName,
      changes: []
    };

    setScenarios([...scenarios, newScenario]);
    setActiveScenario(newScenario.id);
    setNewScenarioName('');
    setIsCreateDialogOpen(false);
  };

  const addChangeToScenario = (scenarioId: string) => {
    if (!currentChange.type || !currentChange.description) return;

    const change: ScenarioChange = {
      type: currentChange.type as ScenarioChange['type'],
      investmentId: currentChange.investmentId,
      amount: currentChange.amount,
      date: currentChange.date || new Date(),
      newRegime: currentChange.newRegime,
      description: currentChange.description
    };

    setScenarios(scenarios.map(scenario => {
      if (scenario.id === scenarioId) {
        return {
          ...scenario,
          changes: [...scenario.changes, change]
        };
      }
      return scenario;
    }));

    setCurrentChange({ type: 'sell', description: '' });
  };

  const removeChangeFromScenario = (scenarioId: string, changeIndex: number) => {
    setScenarios(scenarios.map(scenario => {
      if (scenario.id === scenarioId) {
        return {
          ...scenario,
          changes: scenario.changes.filter((_, index) => index !== changeIndex)
        };
      }
      return scenario;
    }));
  };

  const simulateScenario = (scenario: SimulationScenario) => {
    // Create modified portfolio based on changes
    let modifiedInvestments = [...portfolio.investments];
    let totalCashFromSales = 0;

    scenario.changes.forEach(change => {
      switch (change.type) {
        case 'sell':
          if (change.investmentId && change.amount) {
            const investmentIndex = modifiedInvestments.findIndex(inv => inv.id === change.investmentId);
            if (investmentIndex !== -1) {
              const investment = modifiedInvestments[investmentIndex];
              const quantityToSell = change.amount / investment.currentPrice;
              
              if (quantityToSell >= investment.quantity) {
                // Sell entire position
                totalCashFromSales += investment.quantity * investment.currentPrice;
                modifiedInvestments.splice(investmentIndex, 1);
              } else {
                // Partial sale
                totalCashFromSales += change.amount;
                modifiedInvestments[investmentIndex] = {
                  ...investment,
                  quantity: investment.quantity - quantityToSell
                };
              }
            }
          }
          break;

        case 'buy':
          if (change.investmentId && change.amount) {
            const existingIndex = modifiedInvestments.findIndex(inv => inv.id === change.investmentId);
            if (existingIndex !== -1) {
              // Add to existing position
              const existing = modifiedInvestments[existingIndex];
              const additionalQuantity = change.amount / existing.currentPrice;
              modifiedInvestments[existingIndex] = {
                ...existing,
                quantity: existing.quantity + additionalQuantity
              };
            }
          }
          break;
      }
    });

    const modifiedPortfolio: Portfolio = {
      ...portfolio,
      investments: modifiedInvestments
    };

    // Check for regime switch
    const regime = scenario.changes.find(c => c.type === 'switch_regime')?.newRegime || 'old';
    
    const result = taxCalculator.calculatePortfolioTax(modifiedPortfolio, grossIncome, regime, []);
    const savings = baselineCalculation ? baselineCalculation.totalTaxLiability - result.totalTaxLiability : 0;

    setScenarios(scenarios.map(s => {
      if (s.id === scenario.id) {
        return {
          ...s,
          result,
          savings
        };
      }
      return s;
    }));
  };

  const getInvestmentOptions = () => {
    return portfolio.investments.map(inv => ({
      value: inv.id,
      label: `${inv.name} (₹${inv.currentPrice.toLocaleString()})`
    }));
  };

  const getChangeTypeColor = (type: ScenarioChange['type']) => {
    switch (type) {
      case 'sell': return 'destructive';
      case 'buy': return 'success';
      case 'hold': return 'secondary';
      case 'switch_regime': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scenario Simulation</h2>
          <p className="text-muted-foreground">Model different investment strategies and tax implications</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="income">Annual Income:</Label>
            <Input
              id="income"
              type="number"
              value={grossIncome}
              onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
              className="w-32"
              placeholder="Income"
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Scenario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Scenario</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input
                    id="scenario-name"
                    value={newScenarioName}
                    onChange={(e) => setNewScenarioName(e.target.value)}
                    placeholder="e.g., Sell tech stocks before March"
                  />
                </div>
                <Button onClick={createScenario} className="w-full">
                  Create Scenario
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Baseline */}
      {baselineCalculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Current Portfolio (Baseline)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Tax</p>
                <p className="text-2xl font-bold">₹{baselineCalculation.totalTaxLiability.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Capital Gains Tax</p>
                <p className="text-xl font-medium">₹{baselineCalculation.capitalGainsTax.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Income Tax</p>
                <p className="text-xl font-medium">₹{baselineCalculation.incomeTax.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Effective Rate</p>
                <p className="text-xl font-medium">{baselineCalculation.effectiveRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scenarios */}
      {scenarios.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeScenario || ''} onValueChange={setActiveScenario}>
              <TabsList className="grid w-full grid-cols-auto">
                {scenarios.map(scenario => (
                  <TabsTrigger key={scenario.id} value={scenario.id} className="relative">
                    {scenario.name}
                    {scenario.savings && (
                      <Badge 
                        variant={scenario.savings > 0 ? 'default' : 'destructive'}
                        className="ml-2 text-xs"
                      >
                        {scenario.savings > 0 ? '+' : ''}₹{scenario.savings.toLocaleString()}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {scenarios.map(scenario => (
                <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
                  {/* Add Changes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Add Changes to "{scenario.name}"</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-5 gap-4">
                        <div>
                          <Label>Action</Label>
                          <Select 
                            value={currentChange.type} 
                            onValueChange={(value) => setCurrentChange({...currentChange, type: value as ScenarioChange['type']})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sell">Sell</SelectItem>
                              <SelectItem value="buy">Buy More</SelectItem>
                              <SelectItem value="hold">Hold</SelectItem>
                              <SelectItem value="switch_regime">Switch Tax Regime</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {(currentChange.type === 'sell' || currentChange.type === 'buy') && (
                          <>
                            <div>
                              <Label>Investment</Label>
                              <Select 
                                value={currentChange.investmentId} 
                                onValueChange={(value) => setCurrentChange({...currentChange, investmentId: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select investment" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getInvestmentOptions().map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Amount (₹)</Label>
                              <Input
                                type="number"
                                value={currentChange.amount || ''}
                                onChange={(e) => setCurrentChange({...currentChange, amount: parseFloat(e.target.value) || 0})}
                                placeholder="Enter amount"
                              />
                            </div>
                          </>
                        )}

                        {currentChange.type === 'switch_regime' && (
                          <div>
                            <Label>New Regime</Label>
                            <Select 
                              value={currentChange.newRegime} 
                              onValueChange={(value) => setCurrentChange({...currentChange, newRegime: value as 'old' | 'new'})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select regime" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="old">Old Regime</SelectItem>
                                <SelectItem value="new">New Regime</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div>
                          <Label>Description</Label>
                          <Input
                            value={currentChange.description}
                            onChange={(e) => setCurrentChange({...currentChange, description: e.target.value})}
                            placeholder="Reason for change"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button onClick={() => addChangeToScenario(scenario.id)} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Current Changes */}
                  {scenario.changes.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          Changes in this Scenario
                          <Button onClick={() => simulateScenario(scenario)} variant="outline">
                            <Play className="w-4 h-4 mr-2" />
                            Run Simulation
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {scenario.changes.map((change, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Badge variant={getChangeTypeColor(change.type)}>
                                  {change.type.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{change.description}</p>
                                  {change.amount && (
                                    <p className="text-sm text-muted-foreground">Amount: ₹{change.amount.toLocaleString()}</p>
                                  )}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeChangeFromScenario(scenario.id, index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Results */}
                  {scenario.result && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Simulation Results
                          {scenario.savings && scenario.savings > 0 ? (
                            <TrendingDown className="w-5 h-5 text-success" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-destructive" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-medium">Tax Comparison</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Original Total Tax:</span>
                                <span>₹{baselineCalculation?.totalTaxLiability.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">New Total Tax:</span>
                                <span>₹{scenario.result.totalTaxLiability.toLocaleString()}</span>
                              </div>
                              <hr />
                              <div className="flex justify-between font-bold">
                                <span>Tax {scenario.savings && scenario.savings > 0 ? 'Savings' : 'Increase'}:</span>
                                <span className={scenario.savings && scenario.savings > 0 ? 'text-success' : 'text-destructive'}>
                                  {scenario.savings && scenario.savings > 0 ? '+' : ''}₹{Math.abs(scenario.savings || 0).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-medium">Detailed Breakdown</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Income Tax:</span>
                                <span>₹{scenario.result.incomeTax.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Capital Gains Tax:</span>
                                <span>₹{scenario.result.capitalGainsTax.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Cess & Surcharge:</span>
                                <span>₹{(scenario.result.cess + scenario.result.surcharge).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Effective Rate:</span>
                                <span>{scenario.result.effectiveRate.toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {scenarios.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Scenarios Created</h3>
            <p className="text-muted-foreground mb-4">
              Create scenarios to model different investment strategies and see their tax implications.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Scenario
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScenarioSimulator;