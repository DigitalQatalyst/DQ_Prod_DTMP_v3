import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GovernancePhase } from "@/data/governance";

interface GovernanceCardProps {
  phase: GovernancePhase;
}

export function GovernanceCard({ phase }: GovernanceCardProps) {
  const { icon: Icon, name, color, bgColor, description, route, ctaLabel } = phase;

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div
        className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center mb-4`}
      >
        <Icon size={32} className={color} />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3">{name}</h3>
      <p className="text-muted-foreground text-sm mb-4 min-h-[96px]">
        {description}
      </p>

      <Link
        to={route}
        className="text-blue-accent hover:text-blue-accent/80 font-medium text-sm inline-flex items-center gap-1 transition-colors"
      >
        {ctaLabel}
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </div>
  );
}
