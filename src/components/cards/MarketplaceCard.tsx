import { Link } from "react-router-dom";
import { Grid3x3, ArrowRight } from "lucide-react";
import { Marketplace, phaseColors } from "@/data/marketplaces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface MarketplaceCardProps {
  marketplace: Marketplace;
  variant?: "simple" | "enhanced";
}

export function MarketplaceCard({
  marketplace,
  variant = "simple",
}: MarketplaceCardProps) {
  const { icon: Icon, name, description, features, serviceCount, route, phase } =
    marketplace;
  const colors = phaseColors[phase];
  const [isOpen, setIsOpen] = useState(false);
  const accent =
    phase === "Discern"
      ? "#0EA5E9"
      : phase === "Design"
        ? "#F97316"
        : phase === "Deploy"
          ? "#16A34A"
          : "#DC2626";

  if (variant === "simple") {
    return (
      <>
        <div 
          onClick={() => setIsOpen(true)}
          className="group cursor-pointer bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all hover:shadow-lg"
          style={{ borderTop: `4px solid ${accent}` }}
        >
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: accent }}>
            {phase}
          </p>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}1A` }}>
            <Icon size={20} style={{ color: accent }} />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A] mb-2">{name}</h3>
          <p className="text-[15px] leading-relaxed text-[#334155] mb-4 min-h-[40px]">
            {description}
          </p>
        </div>

        {/* Popup Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="icon-gradient w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Icon size={32} className="text-purple" />
              </div>
              <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Phase
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors.badge}`}
                >
                  {phase}
                </span>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <span
                      key={feature}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Services Available
                </p>
                <span className="text-sm text-foreground flex items-center gap-1">
                  <Grid3x3 size={16} />
                  {serviceCount} services
                </span>
              </div>
            </div>

            <Link to={route} className="block">
              <Button className="w-full bg-accent hover:bg-orange-hover text-accent-foreground font-semibold inline-flex items-center justify-center gap-2">
                View Marketplace
                <ArrowRight size={16} />
              </Button>
            </Link>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group cursor-pointer bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all hover:shadow-lg"
        style={{ borderTop: `4px solid ${accent}` }}
      >
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-3" style={{ color: accent }}>
          {phase}
        </p>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}1A` }}>
            <Icon size={20} style={{ color: accent }} />
          </div>
        </div>

        <h3 className="text-xl lg:text-2xl font-bold text-[#0F172A] mb-3">
          {name}
        </h3>
        <p className="text-[15px] leading-relaxed text-[#334155] mb-4 min-h-[60px]">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="bg-[#F8FAFC] text-[#334155] px-2 py-1 rounded text-xs"
            >
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="bg-[#F8FAFC] px-2 py-1 rounded text-xs font-medium" style={{ color: accent }}>
              +{features.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#E2E8F0]">
          <span className="text-sm text-[#64748B] flex items-center gap-1">
            <Grid3x3 size={16} />
            {serviceCount} services
          </span>
          <span className="font-semibold flex items-center gap-1 transition-colors" style={{ color: accent }}>
            → Explore
            <ArrowRight size={16} />
          </span>
        </div>
      </div>

      {/* Popup Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="icon-gradient w-16 h-16 rounded-lg flex items-center justify-center mb-4">
              <Icon size={32} className="text-purple" />
            </div>
            <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Phase
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors.badge}`}
              >
                {phase}
              </span>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Features
              </p>
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <span
                    key={feature}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Services Available
              </p>
              <span className="text-sm text-foreground flex items-center gap-1">
                <Grid3x3 size={16} />
                {serviceCount} services
              </span>
            </div>
          </div>

          <Link to={route} className="block">
            <Button className="w-full bg-accent hover:bg-orange-hover text-accent-foreground font-semibold inline-flex items-center justify-center gap-2">
              View Marketplace
              <ArrowRight size={16} />
            </Button>
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
