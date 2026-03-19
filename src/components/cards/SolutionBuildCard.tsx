import { memo } from "react";
import { Clock, BarChart3, Rocket, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SolutionBuild } from "@/data/blueprints/solutionBuilds";
import { STREAM_COLORS } from "@/data/blueprints/solutionBuilds";

interface Props {
  build: SolutionBuild;
  onClick: (id: string) => void;
}

export const SolutionBuildCard = memo(({ build, onClick }: Props) => {
  const colors = STREAM_COLORS[build.solutionType] ?? STREAM_COLORS["DBP"];
  const visibleDivisions = build.divisionRelevance.slice(0, 2);
  const extraDivisions = build.divisionRelevance.length - 2;

  return (
    <article
      onClick={() => onClick(build.id)}
      className="card-marketplace group cursor-pointer h-full flex flex-col overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(build.id);
        }
      }}
      aria-label={`View details for ${build.title}`}
    >
      {/* Stream header strip */}
      <div className={`${colors.headerBg} -mx-6 -mt-6 px-6 py-3 mb-4 flex items-center justify-between`}>
        <Badge className="bg-white/20 text-white border-white/30 border font-semibold text-xs">
          {build.solutionType}
        </Badge>
        <span className="text-white/80 text-xs font-medium uppercase tracking-wide">DEPLOY</span>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-[hsl(var(--orange))] transition-colors leading-snug">
        {build.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {build.shortDescription}
      </p>

      {/* Metadata row */}
      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {build.timeline}
        </span>
        <span className="flex items-center gap-1">
          <BarChart3 className="w-3 h-3" />
          {build.complexity}
        </span>
        <span className="flex items-center gap-1">
          <Rocket className="w-3 h-3" />
          {build.deploymentCount} deployments
        </span>
      </div>

      {/* Division pills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {visibleDivisions.map(div => (
          <span
            key={div}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"
          >
            {div}
          </span>
        ))}
        {extraDivisions > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            +{extraDivisions} more
          </span>
        )}
      </div>

      {/* From Spec indicator */}
      {build.fromSpecTitle && (
        <div className="flex items-center gap-1 text-xs text-blue-600 mb-3">
          <Link2 className="w-3 h-3" />
          <span className="line-clamp-1">From Spec: {build.fromSpecTitle}</span>
        </div>
      )}

    </article>
  );
});

SolutionBuildCard.displayName = "SolutionBuildCard";
