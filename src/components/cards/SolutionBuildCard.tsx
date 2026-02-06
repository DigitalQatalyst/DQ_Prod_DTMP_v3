import { memo } from "react";
import { SolutionBuild } from "@/data/blueprints/solutionBuilds";
import { SolutionType } from "@/data/blueprints/solutionSpecs";
import { Code, Zap, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SolutionBuildCardProps {
  build: SolutionBuild;
  onClick: (id: string) => void;
}

const SOLUTION_TYPE_COLORS: Record<SolutionType, { bg: string; text: string; border: string }> = {
  DBP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  DXP: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  DWS: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  DIA: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  SDO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const COMPLEXITY_LABELS: Record<string, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const AUTOMATION_LABELS: Record<string, string> = {
  manual: "Manual",
  "semi-automated": "Semi-Automated",
  "fully-automated": "Fully Automated",
};

export const SolutionBuildCard = memo(({ build, onClick }: SolutionBuildCardProps) => {
  const colors = SOLUTION_TYPE_COLORS[build.solutionType];

  return (
    <article
      onClick={() => onClick(build.id)}
      className="card-marketplace group cursor-pointer h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(build.id);
        }
      }}
      aria-label={`View details for ${build.title}`}
    >
      {/* Header with Solution Type Badge */}
      <div className="flex justify-between items-start mb-3">
        <Badge
          className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`}
          variant="outline"
        >
          {build.solutionType}
        </Badge>
        <Code className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[hsl(var(--orange))] transition-colors">
        {build.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
        {build.description}
      </p>

      {/* Build Complexity and Automation Level */}
      <div className="flex gap-2 mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {COMPLEXITY_LABELS[build.buildComplexity]}
        </span>
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {AUTOMATION_LABELS[build.automationLevel]}
        </span>
      </div>

      {/* Technology Stack */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {build.technologyStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
            >
              {tech}
            </span>
          ))}
          {build.technologyStack.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
              +{build.technologyStack.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Code Samples Indicator */}
      {build.codeSamples && (
        <div className="flex items-center gap-2 mb-4 text-sm text-green-600">
          <Wrench className="w-4 h-4" aria-hidden="true" />
          <span>Code samples available</span>
        </div>
      )}

      {/* Tags */}
      {build.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {build.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {build.tags.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
              +{build.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </article>
  );
});

SolutionBuildCard.displayName = "SolutionBuildCard";
