import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Video, 
  Calculator, 
  Search,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  FileText,
  Lightbulb,
  GraduationCap,
  Star
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: 'basic' | 'intermediate' | 'advanced';
  duration: string;
  type: 'article' | 'video' | 'calculator' | 'checklist';
  content: string;
  tags: string[];
  difficulty: 1 | 2 | 3;
  rating: number;
  completedByUser?: boolean;
}

interface TaxCalculatorTool {
  id: string;
  name: string;
  description: string;
  inputs: string[];
  category: string;
}

const Education = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  const guides: Guide[] = [
    {
      id: 'stcg-ltcg-basics',
      title: 'Understanding STCG vs LTCG',
      description: 'Learn the fundamental differences between short-term and long-term capital gains taxation',
      category: 'basic',
      duration: '8 min read',
      type: 'article',
      content: `
Understanding STCG vs LTCG

What are Capital Gains?

Capital gains refer to the profit earned from selling a capital asset for more than its purchase price. Under the Income Tax Act, 1961, capital gains are classified into two categories:

Short Term Capital Gains (STCG)

Definition: Gains from assets held for less than the prescribed holding period.

Holding Periods:
• Equity shares/Equity mutual funds: Less than 12 months
• Debt mutual funds/Bonds: Less than 36 months  
• Real estate: Less than 24 months

Tax Rates:
• Equity STCG: 15% (plus cess and surcharge)
• Non-equity STCG: As per income tax slab rates

Long Term Capital Gains (LTCG)

Definition: Gains from assets held for more than the prescribed holding period.

Tax Rates:
• Equity LTCG: 10% on gains above ₹1 lakh (Section 112A)
• Non-equity LTCG: 20% with indexation benefit (Section 112)

Key Legal Provisions

• Section 111A: STCG on equity shares and equity mutual funds
• Section 112A: LTCG on equity shares and equity mutual funds
• Section 112: LTCG on other assets

Tax Optimization Strategies

1. Hold for the Long Term: Convert STCG to LTCG by holding assets longer
2. Use LTCG Exemption: ₹1 lakh exemption on equity LTCG per year
3. Tax Loss Harvesting: Offset gains with losses under Section 70 and 71

Example Calculation

Scenario: You bought Reliance shares for ₹2,000 per share and sold for ₹2,500 after 8 months.

• Holding Period: 8 months (STCG)
• Gain per Share: ₹500
• Tax Rate: 15%
• Tax Liability: ₹75 per share

If held for 12+ months:
• Classification: LTCG
• Tax Rate: 10% (if total LTCG > ₹1 lakh)
• Tax Saving: ₹25 per share (5% difference)
      `,
      tags: ['capital gains', 'tax rates', 'holding period'],
      difficulty: 1,
      rating: 4.8
    },
    {
      id: 'section-80c-guide',
      title: 'Complete Guide to Section 80C',
      description: 'Maximize your tax savings with Section 80C deductions - ₹1.5 lakh limit explained',
      category: 'basic',
      duration: '10 min read',
      type: 'article',
      content: `
Complete Guide to Section 80C

Overview

Section 80C of the Income Tax Act, 1961 allows deduction up to ₹1.5 lakh for investments in specified instruments.

Eligible Investments

1. Equity Linked Savings Scheme (ELSS)
• Lock-in Period: 3 years
• Returns: Market-linked
• Benefit: Shortest lock-in among 80C options

2. Public Provident Fund (PPF)
• Lock-in Period: 15 years
• Returns: Government-declared (currently ~7.1%)
• Benefit: Tax-free returns

3. Employee Provident Fund (EPF)
• Lock-in Period: Until retirement
• Returns: Government-declared
• Benefit: Employer contribution

4. Life Insurance Premiums
• Condition: Premium ≤ 10% of sum assured
• Type: Term/Endowment/ULIP
• Benefit: Insurance + tax saving

5. National Savings Certificate (NSC)
• Lock-in Period: 5 years
• Returns: Fixed (currently ~6.8%)
• Benefit: Government backing

Strategic Allocation

Conservative Investor:
• PPF: ₹75,000
• NSC: ₹50,000
• Insurance: ₹25,000

Aggressive Investor:
• ELSS: ₹1,00,000
• PPF: ₹50,000

Legal References
• Section 80C: Deduction for investment
• Section 10(10D): Tax-free insurance maturity
• PPF Act, 1968: PPF regulations
      `,
      tags: ['section 80c', 'tax deductions', 'investments'],
      difficulty: 1,
      rating: 4.9
    },
    {
      id: 'tax-regime-comparison',
      title: 'Old vs New Tax Regime: Which is Better?',
      description: 'Detailed comparison of tax regimes with real examples and decision framework',
      category: 'intermediate',
      duration: '12 min read',
      type: 'article',
      content: `
Old vs New Tax Regime: Which is Better?

Introduction

The Finance Act 2020 introduced the new tax regime under Section 115BAC, giving taxpayers a choice between old and new regimes.

Tax Slabs Comparison

Old Regime (Section 11)
• 0% - ₹2.5 lakh
• 5% - ₹2.5L to ₹5L
• 20% - ₹5L to ₹10L
• 30% - Above ₹10L

Plus: All deductions available

New Regime (Section 115BAC)
• 0% - ₹3 lakh
• 5% - ₹3L to ₹7L
• 10% - ₹7L to ₹10L
• 15% - ₹10L to ₹12L
• 20% - ₹12L to ₹15L
• 30% - Above ₹15L

But: Limited deductions

Decision Framework

Choose Old Regime If:
• Total deductions > ₹2.5 lakh
• Have home loan
• Invest in tax-saving instruments
• Have multiple income sources

Choose New Regime If:
• Minimal investments
• No home loan
• Simple salary income
• Young professionals

Example Calculation

Income: ₹12 lakh

Old Regime:
• Tax: ₹1,12,500
• Less: 80C (₹1.5L): ₹46,500
• Less: 80D (₹25K): ₹7,750
• Net Tax: ₹58,250

New Regime:
• Tax: ₹78,000

Winner: Old regime (saves ₹19,750)
      `,
      tags: ['tax regime', 'comparison', 'optimization'],
      difficulty: 2,
      rating: 4.7
    },
    {
      id: 'tax-loss-harvesting',
      title: 'Tax Loss Harvesting Strategies',
      description: 'Advanced techniques to minimize tax liability through strategic loss booking',
      category: 'advanced',
      duration: '15 min read',
      type: 'article',
      content: `
Tax Loss Harvesting Strategies

What is Tax Loss Harvesting?

Tax loss harvesting involves selling investments at a loss to offset capital gains, thereby reducing overall tax liability.

Legal Framework

Section 70: Set-off within the same head
• STCG losses can offset STCG gains
• LTCG losses can offset LTCG gains

Section 71: Carry forward of losses
• Unabsorbed losses can be carried forward for 8 years
• Must file ITR to claim carry forward

Strategies

1. Intra-Year Harvesting
Book losses in the same financial year to offset gains.

2. Year-End Planning
December-March: Review portfolio for harvest opportunities.

3. Sectoral Rotation
Sell losing stocks and buy similar (not same) stocks to maintain exposure.

Example

Portfolio:
• Stock A: ₹50,000 gain (STCG)
• Stock B: ₹30,000 loss (potential)

Strategy:
• Sell Stock B to book ₹30,000 loss
• Net STCG: ₹20,000
• Tax saved: ₹4,500 (15% of ₹30,000)

Important Notes

1. 30-Day Rule: Avoid buying same security within 30 days
2. Documentation: Maintain proper records
3. Timing: Consider market conditions
      `,
      tags: ['tax loss harvesting', 'advanced strategies', 'portfolio management'],
      difficulty: 3,
      rating: 4.6
    },
    {
      id: 'itr-filing-guide',
      title: 'ITR Filing: Step-by-Step Guide',
      description: 'Complete walkthrough of filing income tax returns with capital gains',
      category: 'intermediate',
      duration: '20 min read',
      type: 'checklist',
      content: `
ITR Filing: Step-by-Step Guide

Before You Start

Documents Required
□ Form 16 from employer
□ Bank statements
□ Investment proofs
□ Capital gains statements
□ TDS certificates

Step 1: Choose Correct ITR Form

• ITR-1: Salary, pension, one house
• ITR-2: Capital gains, multiple properties
• ITR-3: Business income

Step 2: Calculate Capital Gains

For Each Transaction:
□ Purchase date and price
□ Sale date and price
□ Brokerage and charges
□ Determine STCG/LTCG

Step 3: Fill ITR Form

Schedule CG (Capital Gains)
□ Short-term gains (15% and slab rate)
□ Long-term gains (10% and 20%)
□ Exemptions claimed

Schedule AL (Assets and Liabilities)
□ List all assets
□ Foreign assets if any

Step 4: Verify and Submit

□ Mathematical accuracy
□ Bank account details
□ Verify within 120 days

Common Mistakes to Avoid

1. Wrong ITR form selection
2. Incorrect capital gains calculation
3. Missing exempt income
4. Incorrect bank details

Deadlines

• Individuals: July 31
• Audit cases: October 31
• Revised return: December 31
      `,
      tags: ['itr filing', 'compliance', 'deadlines'],
      difficulty: 2,
      rating: 4.5
    }
  ];

  const calculators: TaxCalculatorTool[] = [
    {
      id: 'capital-gains-calc',
      name: 'Capital Gains Calculator',
      description: 'Calculate STCG and LTCG tax liability with indexation benefits',
      inputs: ['Purchase Price', 'Sale Price', 'Purchase Date', 'Sale Date', 'Asset Type'],
      category: 'Capital Gains'
    },
    {
      id: 'regime-comparison',
      name: 'Tax Regime Comparator',
      description: 'Compare old vs new tax regime based on your income and deductions',
      inputs: ['Annual Income', 'Section 80C', 'Section 80D', 'HRA', 'Home Loan Interest'],
      category: 'Tax Planning'
    },
    {
      id: 'sip-tax-calc',
      name: 'SIP Tax Calculator',
      description: 'Calculate tax implications of SIP investments and ELSS',
      inputs: ['Monthly SIP', 'Duration', 'Expected Returns', 'Asset Type'],
      category: 'Investments'
    },
    {
      id: 'hra-calc',
      name: 'HRA Exemption Calculator',
      description: 'Calculate tax-exempt HRA amount based on salary and rent',
      inputs: ['Basic Salary', 'HRA Received', 'Rent Paid', 'City Type'],
      category: 'Salary'
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Intermediate';
      case 3: return 'Advanced';
      default: return 'Unknown';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'calculator': return <Calculator className="w-4 h-4" />;
      case 'checklist': return <CheckCircle className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Tax Education Center</h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Master Indian tax laws with our comprehensive guides, calculators, and tutorials
          </p>
        </div>

        <Tabs defaultValue="guides" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-3 min-w-max">
              <TabsTrigger value="guides" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Guides & Tutorials</span>
                <span className="sm:hidden">Guides</span>
              </TabsTrigger>
              <TabsTrigger value="calculators" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Tax Calculators</span>
                <span className="sm:hidden">Calculators</span>
              </TabsTrigger>
              <TabsTrigger value="glossary" className="text-xs sm:text-sm px-2 sm:px-4">
                <span className="hidden sm:inline">Tax Glossary</span>
                <span className="sm:hidden">Glossary</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="guides" className="space-y-4 sm:space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search guides, topics, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                  size="sm"
                  className="flex-shrink-0"
                >
                  All
                </Button>
                <Button
                  variant={selectedCategory === 'basic' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('basic')}
                  size="sm"
                  className="flex-shrink-0"
                >
                  Beginner
                </Button>
                <Button
                  variant={selectedCategory === 'intermediate' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('intermediate')}
                  size="sm"
                  className="flex-shrink-0"
                >
                  Intermediate
                </Button>
                <Button
                  variant={selectedCategory === 'advanced' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('advanced')}
                  size="sm"
                  className="flex-shrink-0"
                >
                  Advanced
                </Button>
              </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredGuides.map((guide) => (
                <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(guide.type)}
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {getDifficultyText(guide.difficulty)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{guide.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{guide.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {guide.duration}
                      </div>
                      {guide.completedByUser && (
                        <Badge variant="success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {guide.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => setActiveGuide(guide)}
                    >
                      {guide.type === 'video' ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Watch Now
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Read Guide
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Guide Reader Modal */}
            {activeGuide && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CardHeader className="sticky top-0 bg-background border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle>{activeGuide.title}</CardTitle>
                      <Button variant="ghost" onClick={() => setActiveGuide(null)}>
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {activeGuide.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calculators" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {calculators.map((calc) => (
                <Card key={calc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-5 h-5 text-primary" />
                      <Badge variant="outline">{calc.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{calc.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{calc.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium">Required Inputs:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {calc.inputs.map((input, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {input}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">
                      <Calculator className="w-4 h-4 mr-2" />
                      Open Calculator
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="glossary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Terms Glossary</CardTitle>
                <p className="text-muted-foreground">Common tax terms and their meanings under Indian tax law</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      term: "Capital Gains",
                      definition: "Profit earned from selling a capital asset for more than its purchase price. Governed by Sections 45-55 of Income Tax Act, 1961."
                    },
                    {
                      term: "Indexation",
                      definition: "Adjustment of purchase price for inflation using Cost Inflation Index. Available for LTCG under Section 112."
                    },
                    {
                      term: "Section 80C",
                      definition: "Allows deduction up to ₹1.5 lakh for investments in specified instruments like ELSS, PPF, etc."
                    },
                    {
                      term: "TDS",
                      definition: "Tax Deducted at Source. Tax collected by payer before making payment, covered under Chapter XVII-B."
                    },
                    {
                      term: "Assessment Year",
                      definition: "Year in which income tax is assessed. AY 2024-25 corresponds to FY 2023-24."
                    },
                    {
                      term: "Standard Deduction",
                      definition: "Fixed deduction of ₹50,000 (old regime) or ₹75,000 (new regime) for salaried individuals under Section 16."
                    }
                  ].map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">{item.term}</h4>
                      <p className="text-sm text-muted-foreground">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Education;