import { memo } from "react";
import { ArchitectureComponent } from "@/data/solutionSpecs/types";
import { Box, Edit2, Trash2, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComponentCardProps {
  component: ArchitectureComponent;
  onEdit?: (component: ArchitectureComponent) => void;
  onRemove?: (id: string) => void;
}

export const ComponentCard = memo(({ component, onEdit, onRemove }: ComponentCardProps) => {
  return (
    <article
      className="card-marketplace h-full flex flex-col"
      aria-label={`Component: ${component.name}`}
    >
      {/* Header with Name and Actions */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-[hsl(var(--orange))]" aria-hidden="true" />
          <h3 className="text-lg font-bold text-foreground">
            {component.name}
          </h3>
        </div>
        
        {/* Action Buttons */}
        {(onEdit || onRemove) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(component)}
                className="p-2 hover:bg-secondary rounded transition-colors"
                aria-label={`Edit ${component.name}`}
                title="Edit component"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove(component.id)}
                className="p-2 hover:bg-red-50 rounded transition-colors"
                aria-label={`Remove ${component.name}`}
                title="Remove component"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Type Badge */}
      <div className="mb-3">
        <Badge
          className="bg-blue-50 text-blue-700 border-blue-200 border font-semibold capitalize"
          variant="outline"
        >
          {component.type}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 flex-grow">
        {component.description}
      </p>

      {/* Dependencies */}
      {component.dependencies.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-2">
            <GitBranch className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <h4 className="text-xs font-semibold text-foreground">
              Dependencies ({component.dependencies.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {component.dependencies.map((dep) => (
              <span
                key={dep}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs"
              >
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      {component.technologies.length > 0 && (
        <div className="pt-3 border-t border-border">
          <h4 className="text-xs font-semibold text-foreground mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {component.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
});

ComponentCard.displayName = "ComponentCard";
