import { memo } from "react";
import { SolutionSpec, SolutionType } from "@/data/blueprints/solutionSpecs";
import { Layers, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SolutionSpecCardProps {
  spec: SolutionSpec;
  onClick: (id: string) => void;
}

const SOLUTION_TYPE_COLORS: Record<SolutionType, { bg: string; text: string; border: string; gradient: string }> = {
  DBP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", gradient: "from-blue-500 to-blue-700" },
  DXP: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", gradient: "from-purple-500 to-purple-700" },
  DWS: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", gradient: "from-teal-500 to-teal-700" },
  DIA: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", gradient: "from-orange-400 to-orange-600" },
  SDO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", gradient: "from-red-500 to-red-700" },
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
      className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col overflow-hidden"
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
      {/* Coloured stream header */}
      <div className={`h-2 w-full bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Stream + maturity badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`}
            variant="outline"
          >
            {spec.solutionType}
          </Badge>
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {MATURITY_LABELS[spec.maturityLevel]}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
          {spec.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {spec.description}
        </p>

        {/* Division pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {spec.divisionRelevance.slice(0, 2).map((division) => (
            <span
              key={division}
              className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700"
            >
              {division}
            </span>
          ))}
          {spec.divisionRelevance.length > 2 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
              +{spec.divisionRelevance.length - 2}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex gap-4 text-sm text-muted-foreground border-t border-gray-100 pt-4">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            {spec.diagramCount} diagrams
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
            {spec.componentCount} components
          </span>
        </div>
      </div>
    </article>
  );
});

SolutionSpecCard.displayName = "SolutionSpecCard";
