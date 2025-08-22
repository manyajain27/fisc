import { TrendingUp, Shield, Clock, Calculator, BarChart3, BookOpen, Calendar, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import fiscFullLogo from "@/assets/fisc_full_logo.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center">
            <img src={fiscFullLogo} alt="Fisc Logo" className="w-64 sm:w-64 mb-8 lg:w-80 object-contain" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 max-w-4xl mx-auto px-4" style={{ color: '#154a36' }}>
            Smart Investment Tax Planning
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Optimize your investment portfolio with intelligent tax insights and recommendations. Make informed 
            decisions about your holdings and maximize your returns.
          </p>
          
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link 
              to="/dashboard" 
              className="text-white hover:opacity-90 px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors text-center"
              style={{ backgroundColor: '#154a36' }}
            >
              Get Started
            </Link>
            <Link 
              to="/education" 
              className="hover:bg-muted px-6 sm:px-8 py-3 rounded-lg font-medium transition-colors text-center"
              style={{ border: '1px solid #154a36', color: '#154a36' }}
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Portfolio Tax Analyzer</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Analyze STCG/LTCG implications and optimize your investment strategy
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <Calculator className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Regime Optimizer</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Compare old vs new tax regimes and choose the optimal one
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <BarChart3 className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Scenario Simulator</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Model what-if scenarios and their tax implications
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <Shield className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Tax-Saving Insights</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get personalized recommendations to minimize tax liability
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <BookOpen className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Education Hub</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Learn tax concepts with guides, calculators, and glossary
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Tax Calendar</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Track important deadlines and compliance requirements
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <Bot className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">FiscAI Assistant</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Get instant answers to tax questions with AI-powered chat
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: '#154a36' + '20' }}>
                  <Clock className="w-6 h-6" style={{ color: '#154a36' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-3">Holding Period Optimizer</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Optimize timing for better tax efficiency and higher returns
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;