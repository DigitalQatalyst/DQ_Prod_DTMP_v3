import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "DBP", sectionId: "dbp-overview" },
  { name: "4D Model", sectionId: "governance-model" },
  { name: "Streams", sectionId: "execution-streams" },
  { name: "TO", sectionId: "to-value" },
  { name: "Assets", sectionId: "marketplaces" },
  { name: "Contributors", sectionId: "contributors" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    // If not on landing page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-primary-foreground">
              DTMP
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => handleNavClick(link.sectionId)}
                className="text-sm font-medium transition-colors text-primary-foreground/70 hover:text-primary-foreground"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Side - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-xs text-primary-foreground/50">
              Internal Platform
            </span>
            <Link to="/marketplaces">
              <Button
                variant="default"
                className="bg-accent hover:bg-orange-hover text-accent-foreground px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2"
              >
                Access Platform
                <ArrowRight size={16} />
              </Button>
            </Link>
            <button
              className="text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              aria-label="Exit Platform"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link to="/marketplaces">
              <Button
                variant="default"
                size="sm"
                className="bg-accent hover:bg-orange-hover text-accent-foreground rounded-lg font-semibold"
              >
                Access
              </Button>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-foreground p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-primary/95 backdrop-blur-sm animate-slide-in-left">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b border-primary/20">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-9 h-9 rounded-full bg-blue-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">D</span>
                </div>
                <span className="text-xl font-bold text-primary-foreground">
                  DTMP
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-foreground p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-8 overflow-y-auto">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.sectionId}
                    onClick={() => handleNavClick(link.sectionId)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-colors text-primary-foreground/80 hover:bg-primary-foreground/10"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </nav>

            <div className="px-4 pb-8">
              <Link
                to="/marketplaces"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full bg-accent hover:bg-orange-hover text-accent-foreground py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center gap-2">
                  Access Platform
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
