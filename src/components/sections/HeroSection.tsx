import { Link } from "react-router-dom";
import { Target, Layers, LayoutGrid, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary via-primary to-navy-light overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Target State Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-primary-foreground mb-4">
          <Target size={16} className="text-accent" />
          Target State
        </div>

        {/* Label */}
        <p className="text-sm text-blue-accent uppercase tracking-wide mb-4">
          Internal Platform
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 max-w-4xl mx-auto leading-tight">
          Orchestrating Our Digital Business Platform
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/80 mb-10 max-w-3xl mx-auto leading-relaxed">
          The unified architecture layer—designed, deployed, and evolved to grow
          our Digital Business Platform through incrementally structured
          enterprise-wide transformation.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
          <Link to="/marketplaces">
            <Button className="bg-accent hover:bg-orange-hover text-accent-foreground px-8 py-4 h-auto text-base font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
              Access Platform
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-6 items-center justify-center">
          <button
            onClick={() => document.getElementById('governance-model')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
          >
            <div className="bg-blue-accent/20 p-3 rounded-full group-hover:bg-blue-accent/30 transition-colors">
              <LayoutGrid size={24} />
            </div>
            <span className="text-sm font-medium">4D Model</span>
          </button>
          <button
            onClick={() => document.getElementById('to-value')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
          >
            <div className="bg-blue-accent/20 p-3 rounded-full group-hover:bg-blue-accent/30 transition-colors">
              <Building2 size={24} />
            </div>
            <span className="text-sm font-medium">TO</span>
          </button>
          <button
            onClick={() => document.getElementById('marketplaces')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
          >
            <div className="bg-blue-accent/20 p-3 rounded-full group-hover:bg-blue-accent/30 transition-colors">
              <Layers size={24} />
            </div>
            <span className="text-sm font-medium">Assets</span>
          </button>
        </div>
      </div>
    </section>
  );
}
