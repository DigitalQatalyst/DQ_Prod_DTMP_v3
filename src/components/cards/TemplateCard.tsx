import { memo } from "react";
import { DesignTemplate } from "@/data/solutionSpecs/types";
import { FileText, Download, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  template: DesignTemplate;
  onClick: (id: string) => void;
}

const TYPE_COLORS: Record<DesignTemplate['type'], { bg: string; text: string; border: string }> = {
  document: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  diagram: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  checklist: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  framework: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  worksheet: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
};

const CATEGORY_LABELS: Record<DesignTemplate['category'], string> = {
  requirements: "Requirements",
  architecture: "Architecture",
  design: "Design",
  decision: "Decision",
  review: "Review",
};

export const TemplateCard = memo(({ template, onClick }: TemplateCardProps) => {
  const typeColors = TYPE_COLORS[template.type];

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Download functionality will be implemented later
    console.log("Download template:", template.id);
  };

  return (
    <article
      onClick={() => onClick(template.id)}
      className="card-marketplace group cursor-pointer h-full flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(template.id);
        }
      }}
      aria-label={`View details for ${template.title}`}
    >
      {/* Header with Type Badge and Icon */}
      <div className="flex justify-between items-start mb-3">
        <Badge
          className={`${typeColors.bg} ${typeColors.text} ${typeColors.border} border font-semibold capitalize`}
          variant="outline"
        >
          {template.type}
        </Badge>
        <FileText className="w-5 h-5 text-gray-400" aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-[hsl(var(--orange))] transition-colors">
        {template.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
        {template.description}
      </p>

      {/* Category */}
      <div className="mb-4">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
          {CATEGORY_LABELS[template.category]}
        </span>
      </div>

      {/* File Count and Usage Count */}
      <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1" title="File count">
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span aria-label={`${template.files.length} files`}>
            {template.files.length} {template.files.length === 1 ? "file" : "files"}
          </span>
        </span>
        <span className="flex items-center gap-1" title="Usage count">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
          <span aria-label={`Used ${template.usageCount} times`}>
            {template.usageCount} {template.usageCount === 1 ? "use" : "uses"}
          </span>
        </span>
      </div>

      {/* Download Button */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleDownload}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              handleDownload(e as unknown as React.MouseEvent);
            }
          }}
          aria-label={`Download ${template.title}`}
        >
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          Download
        </Button>
      </div>
    </article>
  );
});

TemplateCard.displayName = "TemplateCard";
