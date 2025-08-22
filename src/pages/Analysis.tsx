import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wallet, TrendingUp, DollarSign, PieChart as PieChartIcon, Clock, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const Analysis = () => {
  const portfolioData = [
    { name: "Total Portfolio Value", value: "₹25,00,000", icon: Wallet },
    { name: "Total Gains", value: "₹4,50,000", icon: TrendingUp },
    { name: "Potential Tax Savings", value: "₹1,25,000", icon: DollarSign },
    { name: "Asset Classes", value: "4", icon: PieChartIcon },
  ];

  const assetAllocationData = [
    { name: "Stocks", value: 45, color: "#3B82F6" },
    { name: "Mutual Funds", value: 30, color: "#10B981" },
    { name: "Bonds", value: 15, color: "#F59E0B" },
    { name: "Real Estate", value: 10, color: "#EF4444" },
  ];

  const monthlyReturnsData = [
    { month: "Jan", returns: 12000 },
    { month: "Feb", returns: 14500 },
    { month: "Mar", returns: 17200 },
    { month: "Apr", returns: 15800 },
    { month: "May", returns: 19500 },
    { month: "Jun", returns: 18200 },
  ];

  const reinvestmentStrategies = [
    {
      name: "Tax-Free Municipal Bonds",
      efficiency: "95% Tax Efficient",
      description: "Municipal bonds offer tax-free income at the federal level and potentially state level.",
      allocation: "30%",
      color: "success"
    },
    {
      name: "ELSS Mutual Funds",
      efficiency: "85% Tax Efficient", 
      description: "Equity-linked savings schemes provide tax deductions under Section 80C with a 3-year lock-in.",
      allocation: "40%",
      color: "info"
    },
    {
      name: "REITs",
      efficiency: "75% Tax Efficient",
      description: "Real Estate Investment Trusts offer potential tax advantages through depreciation and lower dividend taxes.",
      allocation: "30%",
      color: "warning"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Portfolio Analysis</h1>
        </div>

        {/* Portfolio Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioData.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                      <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Asset Allocation Circles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {assetAllocationData.map((asset, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-muted"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke={asset.color}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${asset.value * 2.26} 226`}
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold" style={{ color: asset.color }}>
                          {asset.value}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{asset.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Returns Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Monthly Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyReturnsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="returns" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Capital Gains */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Capital Gains
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Short Term</span>
                <span className="font-semibold">₹2,50,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Long Term</span>
                <span className="font-semibold">₹7,50,000</span>
              </div>
            </CardContent>
          </Card>

          {/* Available Deductions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-info" />
                Available Deductions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-info rounded-full" />
                <span className="text-sm">ELSS Tax Deduction under 80C</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-info rounded-full" />
                <span className="text-sm">Property Tax Deduction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-info rounded-full" />
                <span className="text-sm">Home Loan Interest Deduction</span>
              </div>
            </CardContent>
          </Card>

          {/* Holding Period Recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Holding Period Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">To optimize your tax benefits, consider holding your investments for</p>
              <p className="text-2xl font-bold text-warning">18 months</p>
            </CardContent>
          </Card>
        </div>

        {/* Reinvestment Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Reinvestment Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reinvestmentStrategies.map((strategy, index) => (
              <div key={index} className="flex items-start justify-between p-6 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{strategy.name}</h4>
                    <Badge variant="secondary" className={`bg-${strategy.color}/10 text-${strategy.color}`}>
                      {strategy.efficiency}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                  <p className="text-sm font-medium text-primary">Recommended Allocation: {strategy.allocation}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analysis;