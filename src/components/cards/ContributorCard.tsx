import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Contributor } from "@/data/contributors";

interface ContributorCardProps {
  contributor: Contributor;
  onCtaClick?: () => void;
}

export function ContributorCard({ contributor, onCtaClick }: ContributorCardProps) {
  const {
    icon: Icon,
    name,
    color,
    role,
    description,
    contributions,
    capabilities,
    ctaLabel,
    ctaRoute,
  } = contributor;

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <Icon size={40} className={color} />
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
      <p className="text-sm font-medium text-muted-foreground mb-3">{role}</p>
      <p className="text-sm text-secondary-foreground mb-4">{description}</p>

      <div className="border-t border-border pt-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Key Contributions
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {contributions.map((contribution) => (
              <li key={contribution}>{contribution}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Platform Capabilities
          </p>
          <p className="text-sm text-muted-foreground">
            {capabilities.join(" | ")}
          </p>
        </div>

        {onCtaClick ? (
          <button
            type="button"
            onClick={onCtaClick}
            className="inline-flex items-center gap-1 text-blue-accent hover:text-blue-accent/80 font-semibold text-sm"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </button>
        ) : (
          <Link
            to={ctaRoute}
            className="inline-flex items-center gap-1 text-blue-accent hover:text-blue-accent/80 font-semibold text-sm"
          >
            {ctaLabel}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
