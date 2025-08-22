import { TrendingUp, Shield, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8 flex justify-center">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <BarChart3 className="w-16 h-16 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-6 max-w-4xl mx-auto">
            Smart Investment Tax Planning
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Optimize your investment portfolio with intelligent tax insights and recommendations. Make informed 
            decisions about your holdings and maximize your returns.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-success/10 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Tax Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get detailed insights into your capital gains and applicable taxes
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-info/10 rounded-2xl">
                  <Shield className="w-8 h-8 text-info" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Deduction Finder</h3>
              <p className="text-muted-foreground leading-relaxed">
                Discover all eligible tax deductions and exemptions
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 text-center border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-warning/10 rounded-2xl">
                  <Clock className="w-8 h-8 text-warning" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">Timing Optimizer</h3>
              <p className="text-muted-foreground leading-relaxed">
                Learn the optimal holding periods for better tax benefits
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;