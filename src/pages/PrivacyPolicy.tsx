import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#154a36' }}>
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: August 22, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Fisc collects information you provide directly to us, such as when you create an account, 
              upload portfolio data, or use our tax optimization tools. This includes investment details, 
              tax-related information, and usage analytics to improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              How We Use Your Information
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Provide tax analysis and optimization recommendations</li>
              <li>• Calculate capital gains and tax liabilities</li>
              <li>• Improve our algorithms and user experience</li>
              <li>• Comply with Indian tax regulations and reporting requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal and financial information. 
              All data is encrypted in transit and at rest. We follow industry best practices for data 
              protection and comply with applicable Indian data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Information Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share 
              information only when required by law or to comply with Indian tax authorities and 
              regulatory requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, update, or delete your personal information. You can 
              export your data or request account deletion at any time through your account settings 
              or by contacting our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: '#154a36' }}>
              Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact 
              us through our support channels. We are committed to addressing your privacy concerns 
              promptly and transparently.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;