import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight, ChevronDown, HelpCircle, UserPlus, Navigation, MessageSquare, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { isUserAuthenticated } from "@/data/sessionAuth";
import { getSessionRole, isTOStage3Role } from "@/data/sessionRole";

const navLinks = [
  { name: "DBP", sectionId: "dbp-overview" },
  { name: "4D Model", sectionId: "governance-model" },
  { name: "Digital DEWA", sectionId: "execution-streams" },
  { name: "Divisions", sectionId: "division-pivot" },
  { name: "Marketplaces", sectionId: "marketplaces" },
  { name: "EA Office", sectionId: "to-value" },
];

const helpOptions = [
  { icon: UserPlus, label: "Register / Request Access", desc: "Get access to the DEWA EA Platform" },
  { icon: Navigation, label: "Navigation Issue", desc: "Something isn't where you expected" },
  { icon: MessageSquare, label: "Submit a Complaint", desc: "Report a problem or raise a concern" },
  { icon: Phone, label: "Contact the EA Office", desc: "Speak directly with the EA team" },
  { icon: AlertCircle, label: "Something Isn't Working", desc: "Report a technical issue" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccessLogin, setShowAccessLogin] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const exploreRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setShowExplore(false);
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setShowHelp(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setShowExplore(false);
    setIsMobileMenuOpen(false);
  };

  const handleAccessPlatform = () => {
    if (isUserAuthenticated()) {
      const role = getSessionRole();
      if (isTOStage3Role(role)) {
        navigate("/stage3/dashboard");
        return;
      }
      setShowAccessLogin(true);
      return;
    }
    setShowAccessLogin(true);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10"
      style={{ background: "linear-gradient(90deg, #312e81 0%, #1a1a4e 45%, #0c2340 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Left — Logo + Explore */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src="/dewa-logo-v2.png" alt="DEWA logo" className="w-9 h-9 object-contain" />
              <span className="text-2xl font-bold text-white tracking-tight">DEWA</span>
            </Link>

            {/* Desktop — Explore dropdown */}
            <div className="hidden lg:flex items-center" ref={exploreRef}>
            <button
              onClick={() => setShowExplore((v) => !v)}
              className="flex items-center gap-1.5 text-base font-semibold text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
            >
              Explore
              <ChevronDown size={17} className={`transition-transform ${showExplore ? "rotate-180" : ""}`} />
            </button>

            {/* Explore dropdown panel */}
            {showExplore && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                {navLinks.map((link) => (
                  <button
                    key={link.sectionId}
                    onClick={() => handleNavClick(link.sectionId)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            )}
            </div>
          </div>

          {/* Right Side — Desktop */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Get Help button + dropdown */}
            <div className="relative" ref={helpRef}>
              <button
                onClick={() => setShowHelp((v) => !v)}
                className="flex items-center gap-1.5 text-base font-semibold text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <HelpCircle size={16} />
                Get Help
              </button>

              {/* Help dropdown panel */}
              {showHelp && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-4 pb-2">
                    How can we help?
                  </p>
                  {helpOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setShowHelp(false)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <opt.icon size={16} className="mt-0.5 text-indigo-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{opt.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Enter the Platform */}
            <Button
              variant="default"
              onClick={handleAccessPlatform}
              className="bg-accent hover:bg-orange-hover text-accent-foreground px-5 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2 text-base"
            >
              Enter the Platform
              <ArrowRight size={15} />
            </Button>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={handleAccessPlatform}
              className="bg-accent hover:bg-orange-hover text-accent-foreground rounded-lg font-semibold text-xs px-3"
            >
              Enter
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 backdrop-blur-sm animate-slide-in-left"
          style={{ background: "linear-gradient(135deg, #312e81 0%, #0c2340 100%)" }}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                  <img src="/dewa-logo-new.webp" alt="DEWA logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-xl font-bold text-white">DEWA</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 px-2">Explore</p>
              <div className="space-y-1 mb-8">
                {navLinks.map((link) => (
                  <button
                    key={link.sectionId}
                    onClick={() => handleNavClick(link.sectionId)}
                    className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-white/80 hover:bg-white/10 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 px-2">Get Help</p>
              <div className="space-y-1">
                {helpOptions.map((opt) => (
                  <button key={opt.label} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 transition-colors">
                    {opt.label}
                  </button>
                ))}
              </div>
            </nav>

            <div className="px-4 pb-8">
              <Button
                onClick={() => { setIsMobileMenuOpen(false); handleAccessPlatform(); }}
                className="w-full bg-accent hover:bg-orange-hover text-accent-foreground py-4 rounded-lg font-semibold text-base inline-flex items-center justify-center gap-2"
              >
                Enter the Platform <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showAccessLogin}
        onClose={() => setShowAccessLogin(false)}
        context={{
          marketplace: "platform",
          tab: "overview",
          cardId: "access-platform",
          serviceName: "DEWA EA Platform",
          action: "access-platform",
        }}
      />
    </header>
  );
}
