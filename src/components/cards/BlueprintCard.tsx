import { memo } from "react";
import { ArchitectureBlueprint } from "@/data/solutionSpecs/types";
import { Layers, GitBranch, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlueprintCardProps {
  blueprint: ArchitectureBlueprint;
  onClick: (id: string) => void;
}

const CATEGORY_COLORS: Record<ArchitectureBlueprint['category'], { bg: string; text: string; border: string }> = {
  cloud: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  microservices: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  data: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  integration: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  security: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  enterprise: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

const COMPLEXITY_COLORS: Record<ArchitectureBlueprint['complexity'], { bg: string; text: string }> = {
  beginner: { bg: "bg-green-100", text: "text-green-700" },
  intermediate: { bg: "bg-yellow-100", text: "text-yellow-700" },
  advanced: { bg: "bg-orange-100", text: "text-orange-700" },
  expert: { bg: "bg-red-100", text: "text-red-700" },
};

export const BlueprintCard = memo(({ blueprint, onClick }: BlueprintCardProps) => {
  const categoryColors = CATEGORY_COLORS[blueprint.category];
  const complexityColors = COMPLEXITY_COLORS[blueprint.complexity];

  return (
    <article
      onClick={() => onClick(blueprint.id)}
      className="card-marketplace group cursor-pointer h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(blueprint.id);
        }
      }}
      aria-label={`View details for ${blueprint.title}`}
    >
      {/* Header with Category Badge and Complexity */}
      <div className="flex justify-between items-start mb-3">
        <Badge
          className={`${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border font-semibold capitalize`}
          variant="outline"
        >
          {blueprint.category}
        </Badge>
        <span
          className={`${complexityColors.bg} ${complexityColors.text} px-2 py-1 rounded text-xs font-medium capitalize`}
          aria-label={`Complexity: ${blueprint.complexity}`}
        >
          {blueprint.complexity}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[hsl(var(--orange))] transition-colors">
        {blueprint.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
        {blueprint.description}
      </p>

      {/* Component and Diagram Count */}
      <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1" title="Component count">
          <GitBranch className="w-4 h-4" aria-hidden="true" />
          <span aria-label={`${blueprint.components.length} components`}>
            {blueprint.components.length} {blueprint.components.length === 1 ? "component" : "components"}
          </span>
        </span>
        <span className="flex items-center gap-1" title="Diagram count">
          <Layers className="w-4 h-4" aria-hidden="true" />
          <span aria-label={`${blueprint.diagrams.length} diagrams`}>
            {blueprint.diagrams.length} {blueprint.diagrams.length === 1 ? "diagram" : "diagrams"}
          </span>
        </span>
        <span className="flex items-center gap-1" title="Rating">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
          <span aria-label={`Rating: ${blueprint.metrics.rating} out of 5`}>
            {blueprint.metrics.rating.toFixed(1)}
          </span>
        </span>
      </div>

      {/* Technology Tags */}
      {blueprint.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {blueprint.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {blueprint.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
              +{blueprint.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </article>
  );
});

BlueprintCard.displayName = "BlueprintCard";
