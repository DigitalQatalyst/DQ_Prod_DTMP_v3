import { memo, useState } from "react";
import { Technology } from "@/data/solutionSpecs/types";
import { CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TechnologyStackViewProps {
  technologies: Technology[];
  showRequired?: boolean;
  showRecommended?: boolean;
}

export const TechnologyStackView = memo(({ 
  technologies, 
  showRequired = true, 
  showRecommended = true 
}: TechnologyStackViewProps) => {
  const [filter, setFilter] = useState<'all' | 'required' | 'recommended'>('all');

  // Separate technologies by type (assuming required/recommended is indicated by category or a flag)
  // For this implementation, we'll use the category field to distinguish
  const requiredTechs = technologies.filter(tech => 
    tech.category.toLowerCase().includes('required') || tech.purpose.toLowerCase().includes('required')
  );
  const recommendedTechs = technologies.filter(tech => 
    tech.category.toLowerCase().includes('recommended') || tech.purpose.toLowerCase().includes('recommended')
  );
  
  // If no explicit categorization, treat all as required
  const hasExplicitCategories = requiredTechs.length > 0 || recommendedTechs.length > 0;
  const finalRequiredTechs = hasExplicitCategories ? requiredTechs : technologies;
  const finalRecommendedTechs = hasExplicitCategories ? recommendedTechs : [];

  const displayedTechs = filter === 'all' 
    ? technologies 
    : filter === 'required' 
      ? finalRequiredTechs 
      : finalRecommendedTechs;

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      {hasExplicitCategories && (showRequired || showRecommended) && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[hsl(var(--orange))] text-white'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            aria-label="Show all technologies"
            aria-pressed={filter === 'all'}
          >
            All Technologies
          </button>
          {showRequired && finalRequiredTechs.length > 0 && (
            <button
              onClick={() => setFilter('required')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'required'
                  ? 'bg-[hsl(var(--orange))] text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              aria-label="Show required technologies only"
              aria-pressed={filter === 'required'}
            >
              Required ({finalRequiredTechs.length})
            </button>
          )}
          {showRecommended && finalRecommendedTechs.length > 0 && (
            <button
              onClick={() => setFilter('recommended')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                filter === 'recommended'
                  ? 'bg-[hsl(var(--orange))] text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              aria-label="Show recommended technologies only"
              aria-pressed={filter === 'recommended'}
            >
              Recommended ({finalRecommendedTechs.length})
            </button>
          )}
        </div>
      )}

      {/* Required Technologies Section */}
      {showRequired && finalRequiredTechs.length > 0 && (filter === 'all' || filter === 'required') && (
        <section aria-labelledby="required-tech-heading">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
            <h3 id="required-tech-heading" className="text-lg font-bold text-foreground">
              Required Technologies
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finalRequiredTechs.map((tech) => (
              <TechnologyBadge key={`${tech.name}-${tech.version}`} technology={tech} isRequired />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Technologies Section */}
      {showRecommended && finalRecommendedTechs.length > 0 && (filter === 'all' || filter === 'recommended') && (
        <section aria-labelledby="recommended-tech-heading">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" aria-hidden="true" />
            <h3 id="recommended-tech-heading" className="text-lg font-bold text-foreground">
              Recommended Technologies
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finalRecommendedTechs.map((tech) => (
              <TechnologyBadge key={`${tech.name}-${tech.version}`} technology={tech} />
            ))}
          </div>
        </section>
      )}

      {/* No technologies message */}
      {displayedTechs.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No technologies to display
        </p>
      )}
    </div>
  );
});

TechnologyStackView.displayName = "TechnologyStackView";

// Technology Badge Component
interface TechnologyBadgeProps {
  technology: Technology;
  isRequired?: boolean;
}

const TechnologyBadge = memo(({ technology, isRequired = false }: TechnologyBadgeProps) => {
  return (
    <div
      className={`p-4 rounded-lg border ${
        isRequired 
          ? 'bg-green-50 border-green-200' 
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">
            {technology.name}
          </h4>
          {technology.version && (
            <Badge
              className="mt-1 bg-white text-gray-700 border-gray-300 text-xs"
              variant="outline"
            >
              v{technology.version}
            </Badge>
          )}
        </div>
        {isRequired && (
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" aria-label="Required" />
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {technology.purpose}
      </p>
      <span className="text-xs text-gray-600 font-medium">
        {technology.category}
      </span>
    </div>
  );
});

TechnologyBadge.displayName = "TechnologyBadge";
