import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Target,
  AlertTriangle,
  Eye,
  BarChart3,
  Calculator,
  Lightbulb,
  RefreshCw
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RegimeOptimizer from '@/components/RegimeOptimizer';
import PortfolioTaxAnalyzer from '@/components/PortfolioTaxAnalyzer';
import ScenarioSimulator from '@/components/ScenarioSimulator';
import TaxSavingInsights from '@/components/TaxSavingInsights';
import { Portfolio } from '@/types/portfolio';
import { TaxCalculator } from '@/lib/taxCalculator';
import { PortfolioParser } from '@/lib/portfolioParser';

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);

  const taxCalculator = new TaxCalculator();

  useEffect(() => {
    // Load saved portfolio from localStorage if available
    const savedPortfolio = localStorage.getItem('fisc_portfolio');
    if (savedPortfolio) {
      try {
        const parsed = JSON.parse(savedPortfolio);
        // Convert date strings back to Date objects
        const portfolioWithDates = {
          ...parsed,
          investments: parsed.investments?.map((inv: any) => ({
            ...inv,
            purchaseDate: inv.purchaseDate ? new Date(inv.purchaseDate) : new Date()
          })) || []
        };
        setPortfolio(portfolioWithDates);
        calculateDashboardStats(portfolioWithDates);
      } catch (error) {
        console.error('Error loading saved portfolio:', error);
      }
    }
  }, []);

  const calculateDashboardStats = (currentPortfolio: Portfolio) => {
    try {
      if (!currentPortfolio || !currentPortfolio.investments || currentPortfolio.investments.length === 0) {
        setDashboardStats({
          totalValue: 0,
          totalInvested: 0,
          totalGains: 0,
          totalReturns: 0,
          stcgGains: 0,
          ltcgGains: 0,
          totalTax: 0,
          taxEfficiencyScore: 0,
          investmentCount: 0
        });
        return;
      }

      const totalValue = currentPortfolio.investments.reduce((sum, inv) => 
        sum + (inv.quantity * inv.currentPrice), 0
      );
      
      const totalInvested = currentPortfolio.investments.reduce((sum, inv) => 
        sum + (inv.quantity * inv.purchasePrice), 0
      );
      
      const totalGains = totalValue - totalInvested;
      const totalReturns = totalInvested > 0 ? (totalGains / totalInvested) * 100 : 0;

      // Calculate capital gains breakdown
      const capitalGains = currentPortfolio.investments.map(inv => {
        try {
          return taxCalculator.calculateCapitalGain(inv);
        } catch (error) {
          console.error('Error calculating capital gain for investment:', inv, error);
          return { type: 'STCG', gainAmount: 0, taxAmount: 0 };
        }
      });

    const stcgGains = capitalGains
      .filter(gain => gain.type === 'STCG')
      .reduce((sum, gain) => sum + Math.max(0, gain.gainAmount), 0);
    
    const ltcgGains = capitalGains
      .filter(gain => gain.type === 'LTCG')
      .reduce((sum, gain) => sum + Math.max(0, gain.gainAmount), 0);

    const totalTax = capitalGains.reduce((sum, gain) => sum + gain.taxAmount, 0);

    // Tax efficiency score (0-100)
    const ltcgRatio = (ltcgGains / (stcgGains + ltcgGains)) * 100 || 0;
    const taxEfficiencyScore = Math.min(100, ltcgRatio + (totalGains > 0 ? 20 : 0));

      setDashboardStats({
        totalValue,
        totalInvested,
        totalGains,
        totalReturns,
        stcgGains,
        ltcgGains,
        totalTax,
        taxEfficiencyScore,
        investmentCount: currentPortfolio.investments.length
      });
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      setDashboardStats({
        totalValue: 0,
        totalInvested: 0,
        totalGains: 0,
        totalReturns: 0,
        stcgGains: 0,
        ltcgGains: 0,
        totalTax: 0,
        taxEfficiencyScore: 0,
        investmentCount: 0
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const parsedPortfolio = await PortfolioParser.parseFile(file);
      setPortfolio(parsedPortfolio);
      calculateDashboardStats(parsedPortfolio);
      
      // Save to localStorage
      localStorage.setItem('fisc_portfolio', JSON.stringify(parsedPortfolio));
      
      console.log('Portfolio uploaded successfully:', parsedPortfolio);
    } catch (error) {
      console.error('Error uploading portfolio:', error);
      // You could add a toast notification here
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePortfolio = () => {
    const sampleInvestments = [
      {
        id: 'sample_1',
        name: 'Reliance Industries',
        type: 'equity' as const,
        category: 'stcg' as const,
        quantity: 50,
        purchasePrice: 2400,
        currentPrice: 2650,
        purchaseDate: new Date('2023-01-15'),
        dividendReceived: 25,
        brokerageFee: 10
      },
      {
        id: 'sample_2',
        name: 'SBI Bluechip Fund',
        type: 'mutual_fund' as const,
        category: 'stcg' as const,
        quantity: 100,
        purchasePrice: 145,
        currentPrice: 165,
        purchaseDate: new Date('2022-06-10'),
        dividendReceived: 8
      },
      {
        id: 'sample_3',
        name: 'HDFC Bank',
        type: 'equity' as const,
        category: 'stcg' as const,
        quantity: 25,
        purchasePrice: 1500,
        currentPrice: 1680,
        purchaseDate: new Date('2023-03-20'),
        dividendReceived: 15,
        brokerageFee: 8
      },
      {
        id: 'sample_4',
        name: 'Axis Long Term Equity',
        type: 'elss' as const,
        category: 'tax_saving' as const,
        quantity: 200,
        purchasePrice: 45,
        currentPrice: 52,
        purchaseDate: new Date('2023-04-01')
      }
    ];

    const samplePortfolio: Portfolio = {
      id: 'sample_portfolio',
      userId: 'sample_user',
      name: 'Sample Portfolio',
      investments: sampleInvestments,
      totalValue: sampleInvestments.reduce((sum, inv) => sum + inv.quantity * inv.currentPrice, 0),
      totalGains: sampleInvestments.reduce((sum, inv) => sum + inv.quantity * (inv.currentPrice - inv.purchasePrice), 0),
      totalLosses: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPortfolio(samplePortfolio);
    calculateDashboardStats(samplePortfolio);
    localStorage.setItem('fisc_portfolio', JSON.stringify(samplePortfolio));
  };

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 sm:mb-8">
              <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 px-4">
                Welcome to Your Tax Dashboard
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground px-4">
                Upload your portfolio to get started with comprehensive tax analysis and optimization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0 text-center">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Portfolio</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your CSV or JSON portfolio file
                  </p>
                  <input
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="portfolio-upload"
                    disabled={loading}
                  />
                  <Button 
                    onClick={() => document.getElementById('portfolio-upload')?.click()}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0 text-center">
                  <Eye className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Try Demo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore with a sample portfolio
                  </p>
                  <Button onClick={generateSamplePortfolio} variant="outline" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Load Sample Data
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-sm text-muted-foreground">
              <p>Supported formats: CSV, JSON | Sample template available after upload</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tax Dashboard</h1>
            <p className="text-muted-foreground">{portfolio.name}</p>
          </div>
          
          <div className="flex gap-2">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="portfolio-update"
              disabled={loading}
            />
            <Button 
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('portfolio-update')?.click()}
              disabled={loading}
              className="text-xs sm:text-sm"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Update Portfolio</span>
              <span className="sm:hidden">Update</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Portfolio Value</p>
                    <p className="text-lg sm:text-2xl font-bold truncate">₹{dashboardStats.totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Returns</p>
                    <p className={`text-lg sm:text-2xl font-bold truncate ${dashboardStats.totalReturns >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {dashboardStats.totalReturns >= 0 ? '+' : ''}{dashboardStats.totalReturns.toFixed(1)}%
                    </p>
                  </div>
                  {dashboardStats.totalReturns >= 0 ? 
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-success flex-shrink-0" /> : 
                    <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-destructive flex-shrink-0" />
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Tax Liability</p>
                    <p className="text-lg sm:text-2xl font-bold text-primary truncate">₹{dashboardStats.totalTax.toLocaleString()}</p>
                  </div>
                  <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Investments</p>
                    <p className="text-lg sm:text-2xl font-bold">{dashboardStats.investmentCount}</p>
                  </div>
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-info flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Tax Efficiency</span>
                    <span className="font-medium">{dashboardStats.taxEfficiencyScore.toFixed(0)}%</span>
                  </div>
                  <Progress value={dashboardStats.taxEfficiencyScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {dashboardStats.taxEfficiencyScore >= 80 ? 'Excellent' : 
                     dashboardStats.taxEfficiencyScore >= 60 ? 'Good' : 
                     dashboardStats.taxEfficiencyScore >= 40 ? 'Average' : 'Needs Improvement'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 min-w-max">
              <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="tax-analyzer" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Tax Analysis</span>
                <span className="sm:hidden">Tax</span>
              </TabsTrigger>
              <TabsTrigger value="optimizer" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Optimizer</span>
                <span className="sm:hidden">Opt</span>
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Scenarios</span>
                <span className="sm:hidden">Sim</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="text-xs sm:text-sm px-2 sm:px-3">
                <span className="hidden sm:inline">Insights</span>
                <span className="sm:hidden">Tips</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {!dashboardStats ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Loading dashboard data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* STCG vs LTCG Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Capital Gains Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Short Term (STCG)</span>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">₹{(dashboardStats.stcgGains || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">15% tax rate</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Long Term (LTCG)</span>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">₹{(dashboardStats.ltcgGains || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">10% tax rate</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Total Tax</span>
                      <span className="font-bold text-primary text-sm sm:text-base">₹{dashboardStats.totalTax.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-3 sm:p-4"
                    onClick={() => setActiveTab('optimizer')}
                  >
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="font-medium text-sm">Compare Tax Regimes</p>
                      <p className="text-xs text-muted-foreground">Find the best regime for you</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-3 sm:p-4"
                    onClick={() => setActiveTab('scenarios')}
                  >
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="font-medium text-sm">Run Scenarios</p>
                      <p className="text-xs text-muted-foreground">Model what-if situations</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-auto p-3 sm:p-4"
                    onClick={() => setActiveTab('insights')}
                  >
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <p className="font-medium text-sm">Tax-Saving Insights</p>
                      <p className="text-xs text-muted-foreground">Personalized recommendations</p>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity / Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Tax Alerts & Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-warning" />
                      <div>
                        <p className="font-medium">ITR Filing Deadline</p>
                        <p className="text-sm text-muted-foreground">July 31, 2024 - 15 days remaining</p>
                      </div>
                    </div>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-info/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-info" />
                      <div>
                        <p className="font-medium">LTCG Optimization Available</p>
                        <p className="text-sm text-muted-foreground">Hold 3 investments for better tax rates</p>
                      </div>
                    </div>
                    <Badge variant="outline">Action Needed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}
          </TabsContent>

          <TabsContent value="tax-analyzer">
            <PortfolioTaxAnalyzer portfolio={portfolio} />
          </TabsContent>

          <TabsContent value="optimizer">
            <RegimeOptimizer portfolio={portfolio} />
          </TabsContent>

          <TabsContent value="scenarios">
            <ScenarioSimulator portfolio={portfolio} />
          </TabsContent>

          <TabsContent value="insights">
            <TaxSavingInsights portfolio={portfolio} />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;