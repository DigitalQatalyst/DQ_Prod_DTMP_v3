import { memo } from "react";
import { DesignPattern } from "@/data/solutionSpecs/types";
import { Lightbulb, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatternCardProps {
  pattern: DesignPattern;
  onClick: (id: string) => void;
}

const TYPE_COLORS: Record<DesignPattern['type'], { bg: string; text: string; border: string }> = {
  architectural: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  integration: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  data: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  security: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  performance: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  resilience: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

export const PatternCard = memo(({ pattern, onClick }: PatternCardProps) => {
  const typeColors = TYPE_COLORS[pattern.type];

  return (
    <article
      onClick={() => onClick(pattern.id)}
      className="card-marketplace group cursor-pointer h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(pattern.id);
        }
      }}
      aria-label={`View details for ${pattern.title}`}
    >
      {/* Header with Type Badge and Icon */}
      <div className="flex justify-between items-start mb-3">
        <Badge
          className={`${typeColors.bg} ${typeColors.text} ${typeColors.border} border font-semibold capitalize`}
          variant="outline"
        >
          {pattern.type}
        </Badge>
        <Lightbulb className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[hsl(var(--orange))] transition-colors">
        {pattern.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {pattern.description}
      </p>

      {/* Problem Summary */}
      <div className="mb-4 flex-grow">
        <h4 className="text-xs font-semibold text-foreground mb-1">Problem:</h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {pattern.problem}
        </p>
      </div>

      {/* Applicability and Related Patterns */}
      <div className="flex gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
        <span className="flex items-center gap-1" title="Applicability">
          <span className="text-xs font-medium text-foreground">Applicability:</span>
          <span className="line-clamp-1">{pattern.applicability}</span>
        </span>
      </div>

      {/* Related Pattern Count */}
      {pattern.relatedPatterns.length > 0 && (
        <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
          <Link2 className="w-4 h-4" aria-hidden="true" />
          <span aria-label={`${pattern.relatedPatterns.length} related patterns`}>
            {pattern.relatedPatterns.length} related {pattern.relatedPatterns.length === 1 ? "pattern" : "patterns"}
          </span>
        </div>
      )}
    </article>
  );
});

PatternCard.displayName = "PatternCard";
