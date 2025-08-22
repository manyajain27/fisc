import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import fiscSmallLogo from "@/assets/fisc_small_logo.png";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/upload", label: "Upload" },
    { to: "/analysis", label: "Analysis" },
    { to: "/education", label: "Education" },
    { to: "/calendar", label: "Calendar" }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <img src={fiscSmallLogo} alt="Fisc Logo" className="w-6 h-6" />
            <span className="hidden sm:block" style={{ color: '#154a36' }}>Fisc</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  (link.exact ? (isActive(link.to) && location.pathname === link.to) : isActive(link.to)) 
                    ? "font-semibold" : "text-muted-foreground"
                )}
                style={(link.exact ? (isActive(link.to) && location.pathname === link.to) : isActive(link.to)) ? { color: '#154a36' } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-3 pt-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary px-2 py-1 rounded-md",
                    (link.exact ? (isActive(link.to) && location.pathname === link.to) : isActive(link.to)) 
                      ? "font-semibold" : "text-muted-foreground"
                  )}
                  style={(link.exact ? (isActive(link.to) && location.pathname === link.to) : isActive(link.to)) ? { color: '#154a36', backgroundColor: '#154a36' + '20' } : {}}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;