import { memo } from "react";
import { ArchitectureDiagram } from "@/data/solutionSpecs/types";
import { Eye, Download, FileImage } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiagramCardProps {
  diagram: ArchitectureDiagram;
  onView: (diagram: ArchitectureDiagram) => void;
  onDownload: (diagram: ArchitectureDiagram) => void;
}

const TYPE_COLORS: Record<ArchitectureDiagram['type'], { bg: string; text: string; border: string }> = {
  architecture: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  sequence: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  component: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  deployment: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "data-flow": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

export const DiagramCard = memo(({ diagram, onView, onDownload }: DiagramCardProps) => {
  const typeColors = TYPE_COLORS[diagram.type];

  return (
    <article
      className="card-marketplace h-full flex flex-col"
      aria-label={`Diagram: ${diagram.title}`}
    >
      {/* Thumbnail */}
      <div className="relative mb-3 bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        {diagram.thumbnailUrl ? (
          <img
            src={diagram.thumbnailUrl}
            alt={diagram.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileImage className="w-12 h-12 text-gray-400" aria-hidden="true" />
        )}
      </div>

      {/* Header with Type Badge */}
      <div className="mb-3">
        <Badge
          className={`${typeColors.bg} ${typeColors.text} ${typeColors.border} border font-semibold capitalize`}
          variant="outline"
        >
          {diagram.type.replace("-", " ")}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2">
        {diagram.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">
        {diagram.description}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          onClick={() => onView(diagram)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--orange))] text-white rounded hover:bg-[hsl(var(--orange))]/90 transition-colors"
          aria-label={`View ${diagram.title}`}
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-medium">View</span>
        </button>
        <button
          onClick={() => onDownload(diagram)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
          aria-label={`Download ${diagram.title}`}
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-medium">Download</span>
        </button>
      </div>
    </article>
  );
});

DiagramCard.displayName = "DiagramCard";
