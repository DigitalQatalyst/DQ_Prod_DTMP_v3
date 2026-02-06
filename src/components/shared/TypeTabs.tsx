import { Badge } from "@/components/ui/badge";
import { SolutionType } from "@/data/blueprints/solutionSpecs";
import { cn } from "@/lib/utils";

interface TypeTabsProps {
  activeType: SolutionType | "all";
  onTypeChange: (type: SolutionType | "all") => void;
  typeCounts: Record<SolutionType, number>;
}

const SOLUTION_TYPE_LABELS: Record<SolutionType | "all", string> = {
  all: "All",
  DBP: "DBP",
  DXP: "DXP",
  DWS: "DWS",
  DIA: "DIA",
  SDO: "SDO",
};

const SOLUTION_TYPE_FULL_NAMES: Record<SolutionType | "all", string> = {
  all: "All Solutions",
  DBP: "Digital Business Platform",
  DXP: "Digital Experience Platform",
  DWS: "Digital Workplace Solutions",
  DIA: "Data & Intelligence & Analytics",
  SDO: "Security & DevOps",
};

export function TypeTabs({ activeType, onTypeChange, typeCounts }: TypeTabsProps) {
  const types: Array<SolutionType | "all"> = ["all", "DBP", "DXP", "DWS", "DIA", "SDO"];

  // Calculate total count for "All" tab
  const totalCount = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);

  const getCount = (type: SolutionType | "all"): number => {
    if (type === "all") return totalCount;
    return typeCounts[type] || 0;
  };

  return (
    <nav
      className="border-b border-gray-200 bg-white"
      role="tablist"
      aria-label="Solution type filter"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {types.map((type) => {
            const isActive = activeType === type;
            const count = getCount(type);

            return (
              <button
                key={type}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${type}-panel`}
                id={`${type}-tab`}
                onClick={() => onTypeChange(type)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded-t-sm",
                  isActive
                    ? "border-[hsl(var(--orange))] text-[hsl(var(--orange))] bg-orange-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                )}
                title={SOLUTION_TYPE_FULL_NAMES[type]}
              >
                <span>{SOLUTION_TYPE_LABELS[type]}</span>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "min-w-[24px] justify-center",
                    isActive
                      ? "bg-[hsl(var(--orange))] text-white"
                      : "bg-gray-200 text-gray-700"
                  )}
                  aria-label={`${count} ${count === 1 ? "item" : "items"}`}
                >
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
