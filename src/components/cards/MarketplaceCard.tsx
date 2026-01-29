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

  if (variant === "simple") {
    return (
      <>
        <div 
          onClick={() => setIsOpen(true)}
          className="card-marketplace group cursor-pointer"
        >
          <div className="icon-gradient w-16 h-16 rounded-lg flex items-center justify-center mb-4">
            <Icon size={32} className="text-purple" />
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
            {description}
          </p>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors.badge}`}
          >
            {phase}
          </span>
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
        className="card-marketplace group cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${colors.badge}`}
          >
            {phase}
          </span>
          <div className="icon-gradient w-16 h-16 rounded-lg flex items-center justify-center">
            <Icon size={32} className="text-purple" />
          </div>
        </div>

        <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 min-h-[60px]">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
            >
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="bg-phase-discern-bg text-phase-discern px-2 py-1 rounded text-xs font-medium">
              +{features.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Grid3x3 size={16} />
            {serviceCount} services
          </span>
          <span className="text-accent group-hover:text-orange-hover font-semibold flex items-center gap-1 transition-colors">
            Explore
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
