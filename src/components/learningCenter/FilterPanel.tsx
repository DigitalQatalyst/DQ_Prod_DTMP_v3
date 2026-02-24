import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterPanelProps {
  filters: Record<string, string[]>;
  selectedFilters: Record<string, string[]>;
  onFilterChange: (group: string, value: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  onDesktopToggle?: () => void;
}

const filterLabels: Record<string, string> = {
  department: "Department",
  departmentApplicability: "Department Applicability",
  category: "Category",
  provider: "Provider",
  level: "Level",
  duration: "Duration",
  format: "Format",
  certification: "Certification",
  rating: "Rating",
  role: "Role",
  focusArea: "Focus Area",
  includesCertification: "Certification",
  prerequisites: "Prerequisites",
  contentType: "Content Type",
  verifiedLearner: "Verified Learner",
  completionStatus: "Completion Status",
  date: "Date",
  // Blueprints-specific filters
  solutionType: "Solution Type",
  blueprintScope: "Blueprint Scope",
  maturityLevel: "Maturity Level",
  industryFocus: "Industry Focus",
  technicalComplexity: "Technical Complexity",
  deploymentModel: "Deployment Model",
  includesDiagrams: "Includes Diagrams",
  includesComponentList: "Includes Component List",
  buildComplexity: "Build Complexity",
  technologyStack: "Technology Stack",
  deploymentTarget: "Deployment Target",
  includesAutomation: "Includes Automation",
  includesCodeSamples: "Includes Code Samples",
  implementationTime: "Implementation Time",
  skillLevel: "Skill Level",
  // Support Services-specific filters
  supportType: "Support Type",
  slaLevel: "SLA Level",
  coverageArea: "Coverage Area",
  responseTime: "Response Time",
  teamSize: "Team Size",
  expertiseArea: "Expertise Area",
  consultancyType: "Consultancy Type",
  experienceLevel: "Experience Level",
  engagementDuration: "Engagement Duration",
  industrySpecialization: "Industry Specialization",
};

const toTitleCase = (raw: string) =>
  raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function FilterPanel({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  isOpen,
  onClose,
  onDesktopToggle,
}: FilterPanelProps) {
  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);
  const activeFilterCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Filter Panel */}
      <aside
        role="complementary"
        aria-label={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto
          transform transition-transform duration-300 lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDesktopToggle}
              className="hidden lg:inline-flex p-1 rounded hover:bg-gray-100 text-gray-700"
              aria-label="Toggle filters panel"
            >
              <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
            </button>
            <SlidersHorizontal className="w-5 h-5 text-gray-700 lg:hidden" aria-hidden="true" />
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="sr-only">{activeFilterCount} filters active</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium min-h-[44px] px-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
                aria-label={`Clear all ${activeFilterCount} active filters`}
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label="Close filters panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Groups */}
        {Object.entries(filters).map(([group, options]) => {
          const selectedCount = selectedFilters[group]?.length || 0;
          const isExpanded = expandedGroups[group] ?? false;
          return (
            <div key={group} className="mb-3 border border-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center justify-between px-3 py-2 text-left"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {filterLabels[group] || toTitleCase(group)}
                  {selectedCount > 0 && (
                    <span className="ml-2 text-xs font-normal text-gray-500">
                      ({selectedCount})
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="px-3 pb-2 space-y-1">
                  {options.map((option) => {
                    const isChecked = selectedFilters[group]?.includes(option) || false;
                    const checkboxId = `filter-${group}-${option.replace(/\s+/g, '-').toLowerCase()}`;
                    return (
                      <div key={option} className="flex items-center gap-2 py-1.5 min-h-[36px]">
                        <Checkbox
                          id={checkboxId}
                          checked={isChecked}
                          onCheckedChange={() => onFilterChange(group, option)}
                          className="border-gray-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 w-4 h-4"
                          aria-describedby={`${checkboxId}-label`}
                        />
                        <label
                          id={`${checkboxId}-label`}
                          htmlFor={checkboxId}
                          className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 flex-1"
                        >
                          {option}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </aside>
    </>
  );
}

// Mobile Filter Toggle Button
export function MobileFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 lg:hidden z-30 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2"
      aria-label="Open filters panel"
    >
      <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
      <span>Filters</span>
    </Button>
  );
}
