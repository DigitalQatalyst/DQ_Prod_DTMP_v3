import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterPanelProps {
  filters: Record<string, string[]>;
  selectedFilters: Record<string, string[]>;
  onFilterChange: (group: string, value: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onClose: () => void;
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
};

export function FilterPanel({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
  isOpen,
  onClose,
}: FilterPanelProps) {
  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Panel */}
      <aside
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
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onClearAll}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Groups */}
        {Object.entries(filters).map(([group, options]) => (
          <div key={group} className="mb-6 pb-6 border-b border-gray-100 last:border-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              {filterLabels[group] || group}
            </h4>
            <div className="space-y-2">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 py-1 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                >
                  <Checkbox
                    checked={selectedFilters[group]?.includes(option) || false}
                    onCheckedChange={() => onFilterChange(group, option)}
                    className="border-gray-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
}

// Mobile Filter Toggle Button
export function MobileFilterButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 lg:hidden z-30 bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2"
    >
      <SlidersHorizontal className="w-4 h-4" />
      Filters
    </Button>
  );
}
