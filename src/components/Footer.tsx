import { Link } from "react-router-dom";
import { MapPin, ExternalLink } from "lucide-react";
import fiscSmallLogo from "@/assets/fisc_small_logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border mt-16" style={{ backgroundColor: '#154a36' }}>
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={fiscSmallLogo} alt="Fisc Logo" className="w-6 h-6" />
              <span className="text-xl font-semibold text-white">Fisc</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Smart Investment Tax Planning platform helping Indian investors optimize their portfolio taxes and maximize returns.
            </p>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4" />
              <span>India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors text-sm">
                  Portfolio Analyzer
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors text-sm">
                  Regime Optimizer
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors text-sm">
                  Scenario Simulator
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-white/70 hover:text-white transition-colors text-sm">
                  Education Hub
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-white/70 hover:text-white transition-colors text-sm">
                  Tax Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/education" className="text-white/70 hover:text-white transition-colors text-sm">
                  Tax Guides
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-white/70 hover:text-white transition-colors text-sm">
                  Calculators
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-white/70 hover:text-white transition-colors text-sm">
                  Tax Glossary
                </Link>
              </li>
              <li>
                <a 
                  href="https://incometaxindia.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1"
                >
                  Income Tax Department
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-3">
            <p className="text-white/60 text-sm">
              © 2025 Fisc. All rights reserved. Built for Indian tax compliance.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Link 
                to="/privacy" 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-white/70 hover:text-white transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <p className="text-white/60 text-xs text-center">
            Tax advice should be verified with qualified professionals. Fisc provides tools for analysis only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;