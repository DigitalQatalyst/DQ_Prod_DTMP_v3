import { memo } from "react";
import { SolutionSpec, SolutionType } from "@/data/blueprints/solutionSpecs";
import { FileText, Layers, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SolutionSpecCardProps {
  spec: SolutionSpec;
  onClick: (id: string) => void;
}

const SOLUTION_TYPE_COLORS: Record<SolutionType, { bg: string; text: string; border: string }> = {
  DBP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  DXP: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  DWS: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  DIA: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  SDO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const SCOPE_LABELS: Record<string, string> = {
  enterprise: "Enterprise",
  departmental: "Departmental",
  project: "Project",
};

const MATURITY_LABELS: Record<string, string> = {
  conceptual: "Conceptual",
  proven: "Proven",
  reference: "Reference",
};

export const SolutionSpecCard = memo(({ spec, onClick }: SolutionSpecCardProps) => {
  const colors = SOLUTION_TYPE_COLORS[spec.solutionType];

  return (
    <article
      onClick={() => onClick(spec.id)}
      className="card-marketplace group cursor-pointer h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(spec.id);
        }
      }}
      aria-label={`View details for ${spec.title}`}
    >
      {/* Header with Solution Type Badge */}
      <div className="flex justify-between items-start mb-3">
        <Badge
          className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`}
          variant="outline"
        >
          {spec.solutionType}
        </Badge>
        <FileText className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[hsl(var(--orange))] transition-colors">
        {spec.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
        {spec.description}
      </p>

      {/* Scope and Maturity Level */}
      <div className="flex gap-2 mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {SCOPE_LABELS[spec.scope]}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {MATURITY_LABELS[spec.maturityLevel]}
        </span>
      </div>

      {/* Diagram and Component Count */}
      <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1" title="Diagram count">
          <Layers className="w-4 h-4" aria-hidden="true" />
          <span aria-label={`${spec.diagramCount} diagrams`}>
            {spec.diagramCount} {spec.diagramCount === 1 ? "diagram" : "diagrams"}
          </span>
        </span>
        <span className="flex items-center gap-1" title="Component count">
          <GitBranch className="w-4 h-4" aria-hidden="true" />
          <span aria-label={`${spec.componentCount} components`}>
            {spec.componentCount} {spec.componentCount === 1 ? "component" : "components"}
          </span>
        </span>
      </div>

      {/* Tags */}
      {spec.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {spec.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {spec.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
              +{spec.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </article>
  );
});

SolutionSpecCard.displayName = "SolutionSpecCard";
