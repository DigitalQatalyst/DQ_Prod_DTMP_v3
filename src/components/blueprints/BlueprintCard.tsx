import { Star, icons, LucideIcon, Layers, TrendingUp, FileImage, Boxes, Code, ArrowRight } from "lucide-react";
import { SolutionSpec } from "@/data/blueprints/solutionSpecs";
import { SolutionBuild } from "@/data/blueprints/solutionBuilds";
import { Badge } from "@/components/ui/badge";
import { memo, useMemo } from "react";

interface BlueprintCardProps {
  blueprint: SolutionSpec | SolutionBuild;
  onClick: () => void;
}

// Solution type color mapping
const solutionTypeColors: Record<string, string> = {
  DBP: "bg-purple-100 text-purple-700",
  DXP: "bg-pink-100 text-pink-700",
  DWS: "bg-blue-100 text-blue-700",
  DIA: "bg-green-100 text-green-700",
  SDO: "bg-orange-100 text-orange-700",
};

// Complexity color mapping
const complexityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  "Very High": "bg-red-100 text-red-700",
};

export const BlueprintCard = memo(function BlueprintCard({ blueprint, onClick }: BlueprintCardProps) {
  // Get the icon component dynamically - memoized
  const IconComponent: LucideIcon = useMemo(
    () => icons[blueprint.icon as keyof typeof icons] as LucideIcon,
    [blueprint.icon]
  );

  // Determine if this is a SolutionSpec or SolutionBuild
  const isSolutionSpec = "maturityLevel" in blueprint;

  // Get up to 3 key technologies - memoized
  const { displayTechnologies, remainingCount } = useMemo(() => {
    const display = blueprint.keyTechnologies.slice(0, 3);
    const remaining = blueprint.keyTechnologies.length - 3;
    return { displayTechnologies: display, remainingCount: remaining };
  }, [blueprint.keyTechnologies]);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${blueprint.title}, ${blueprint.solutionTypeShort} blueprint with ${blueprint.complexity} complexity`}
      className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {/* Icon and Badges Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center" aria-hidden="true">
          {IconComponent && <IconComponent className="text-blue-600" size={40} />}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`${
              solutionTypeColors[blueprint.solutionTypeShort]
            } border-0 text-xs font-bold uppercase px-3 py-1 rounded-full`}
            role="status"
            aria-label={`Solution type: ${blueprint.solutionTypeShort}`}
          >
            {blueprint.solutionTypeShort}
          </Badge>
          {blueprint.featured && (
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" aria-label="Featured blueprint" />
          )}
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
        {blueprint.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {blueprint.description}
      </p>

      {/* Features Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 mb-4" role="list" aria-label="Blueprint features">
        <div className="flex items-center gap-2 text-sm text-gray-700" role="listitem">
          <Layers size={14} className="text-gray-500" />
          {blueprint.scope}
        </div>
        {isSolutionSpec && (
          <div className="flex items-center gap-2 text-sm text-gray-700" role="listitem">
            <TrendingUp size={14} className="text-gray-500" />
            {(blueprint as SolutionSpec).maturityLevel}
          </div>
        )}
        {!isSolutionSpec && (
          <div className="flex items-center gap-2 text-sm text-gray-700" role="listitem">
            <TrendingUp size={14} className="text-gray-500" />
            {(blueprint as SolutionBuild).buildComplexity}
          </div>
        )}
        {isSolutionSpec && (blueprint as SolutionSpec).includesDiagrams && (
          <div className="flex items-center gap-2 text-sm text-gray-700" role="listitem">
            <FileImage size={14} className="text-gray-500" />
            Architecture Diagrams
          </div>
        )}
        {isSolutionSpec && (blueprint as SolutionSpec).includesComponents && (
          <div className="flex items-center gap-2 text-sm text-gray-700" role="listitem">
            <Boxes size={14} className="text-gray-500" />
            {blueprint.componentCount} Components
          </div>
        )}
        {!isSolutionSpec && (blueprint as SolutionBuild).includesCodeSamples && (
          <div className="flex items-center gap-2 text-sm text-gray-700" role="listitem">
            <Code size={14} className="text-gray-500" />
            Code Samples Included
          </div>
        )}
      </div>

      {/* Key Technologies */}
      <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Key technologies">
        {displayTechnologies.map((tech, index) => (
          <span
            key={index}
            role="listitem"
            className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded text-xs font-medium"
          >
            {tech}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="text-xs text-gray-500" aria-label={`${remainingCount} more technologies`}>
            +{remainingCount}
          </span>
        )}
      </div>

      {/* Footer with Complexity Badge and Button */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <Badge
          className={`${
            complexityColors[blueprint.complexity]
          } border-0 text-xs font-semibold`}
          role="status"
          aria-label={`Complexity level: ${blueprint.complexity}`}
        >
          {blueprint.complexity}
        </Badge>
        <button 
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          aria-label={`View ${blueprint.title} blueprint details`}
          tabIndex={-1}
        >
          <ArrowRight size={16} />
          View Blueprint
        </button>
      </div>
    </article>
  );
});
