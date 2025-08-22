import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#154a36' }}>
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: August 22, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Fisc, you accept and agree to be bound by the terms and provision 
              of this agreement. Fisc is a tax optimization platform designed for Indian investors and 
              is subject to Indian tax laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Service Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fisc provides tools for tax analysis, portfolio optimization, and educational content 
              related to Indian taxation. Our services include STCG/LTCG calculations, tax regime 
              comparisons, and investment planning assistance based on current Indian tax laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              User Responsibilities
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Provide accurate and complete information</li>
              <li>• Verify all calculations and recommendations with qualified professionals</li>
              <li>• Comply with all applicable tax laws and regulations</li>
              <li>• Keep your account information secure and confidential</li>
              <li>• Use the service only for lawful purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Disclaimers
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fisc provides information and tools for educational and analytical purposes only. 
              We do not provide tax advice or guarantee the accuracy of calculations. All tax 
              decisions should be verified with qualified chartered accountants or tax professionals. 
              We are not responsible for any tax liabilities or penalties resulting from use of our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fisc shall not be liable for any indirect, incidental, special, consequential, or 
              punitive damages, including without limitation, loss of profits, data, or goodwill, 
              service interruption, computer damage, or system failure arising from the use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Compliance with Indian Laws
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This service is designed for compliance with Indian tax laws including the Income Tax 
              Act, 1961, and related regulations. Users are responsible for ensuring their tax 
              filings comply with current Indian tax requirements and consulting with professionals 
              when necessary.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Modifications
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of the service 
              after modifications constitutes acceptance of the updated terms. We will notify users 
              of significant changes through the platform.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;