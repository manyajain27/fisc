import { BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <BarChart3 className="w-6 h-6 text-primary" />
            Fisc
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/upload") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Upload Portfolio
            </Link>
            <Link 
              to="/analysis" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive("/analysis") ? "text-primary" : "text-muted-foreground"
              )}
            >
              Analysis
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;