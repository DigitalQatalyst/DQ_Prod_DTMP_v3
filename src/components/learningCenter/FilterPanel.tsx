import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPanelProps {
  filters: Record<string, string[]>;
  selectedFilters: Record<string, string[]>;
  onFilterChange: (group: string, value: string) => void;
  onFilterSelect?: (group: string, value: string | null) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
  variant?: "checkbox" | "dropdown";
}

const filterLabels: Record<string, string> = {
  department: "Department",
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
  // Digital Intelligence-specific filters
  analyticsType: "Analytic Type",
  systemScope: "System Scope",
  dataSource: "Data Source",
  aiCapability: "AI Capability",
  updateFrequency: "Update Frequency",
  visualizationType: "Visualization Type",
  complexity: "Complexity",
  assessmentType: "Assessment Type",
  assessmentScope: "Assessment Scope",
  framework: "Framework",
  outputFormat: "Output Format",
  assessmentFrequency: "Assessment Frequency",
  projectType: "Project Type",
};

export function FilterPanel({
  filters,
  selectedFilters,
  onFilterChange,
  onFilterSelect,
  onClearAll,
  isOpen,
  onClose,
  variant = "checkbox",
}: FilterPanelProps) {
  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);
  const activeFilterCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);

  const handleDropdownChange = (group: string, value: string) => {
    if (onFilterSelect) {
      onFilterSelect(group, value === "__all__" ? null : value);
    }
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
          w-72 bg-white border-r border-gray-200 p-6 overflow-y-auto
          transform transition-transform duration-300 lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-700" aria-hidden="true" />
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
          const selectedValue = selectedFilters[group]?.[0] || "";

          if (variant === "dropdown") {
            return (
              <div key={group} className="mb-5">
                <label
                  className="block text-sm font-semibold text-gray-900 mb-2"
                  htmlFor={`filter-select-${group}`}
                >
                  {filterLabels[group] || group}
                </label>
                <Select
                  value={selectedValue || "__all__"}
                  onValueChange={(val) => handleDropdownChange(group, val)}
                >
                  <SelectTrigger
                    id={`filter-select-${group}`}
                    className="w-full border-gray-300 bg-white text-sm focus:ring-orange-500 focus:border-orange-500"
                  >
                    <SelectValue placeholder={`All ${filterLabels[group] || group}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">
                      All
                    </SelectItem>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          }

          return (
            <fieldset key={group} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
              <legend className="text-sm font-semibold text-gray-900 mb-3">
                {filterLabels[group] || group}
                {selectedCount > 0 && (
                  <span className="ml-2 text-xs font-normal text-gray-500">
                    ({selectedCount} selected)
                  </span>
                )}
              </legend>
              <div className="space-y-2">
                {options.map((option) => {
                  const isChecked = selectedFilters[group]?.includes(option) || false;
                  const checkboxId = `filter-${group}-${option.replace(/\s+/g, '-').toLowerCase()}`;
                  return (
                    <div key={option} className="flex items-center gap-2 py-2 min-h-[44px]">
                      <Checkbox
                        id={checkboxId}
                        checked={isChecked}
                        onCheckedChange={() => onFilterChange(group, option)}
                        className="border-gray-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 w-5 h-5"
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
            </fieldset>
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
