import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { portfolioFilters, ApplicationFilters, ProjectFilters } from "@/data/portfolio";

interface FilterPanelProps {
  activeTab: 'application-portfolio' | 'project-portfolio';
  selectedFilters: Record<string, string[]>;
  onFilterChange: (category: string, value: string, checked: boolean) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function FilterPanel({ 
  activeTab, 
  selectedFilters, 
  onFilterChange, 
  onClearFilters,
  isOpen,
  onToggle 
}: FilterPanelProps) {
  const currentFilters = activeTab === 'application-portfolio' 
    ? portfolioFilters.application 
    : portfolioFilters.project;

  const totalActiveFilters = Object.values(selectedFilters).reduce(
    (sum, filters) => sum + filters.length, 
    0
  );

  const getFilterCount = (category: string) => {
    return selectedFilters[category]?.length || 0;
  };

  // Mobile Filter Button
  const MobileFilterButton = () => (
    <button
      onClick={onToggle}
      className="lg:hidden fixed bottom-6 right-6 z-30 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors min-h-[44px] min-w-[44px] flex items-center gap-2"
      aria-label={`${isOpen ? 'Close' : 'Open'} filters panel`}
    >
      <SlidersHorizontal size={20} aria-hidden="true" />
      <span className="font-medium">Filters</span>
      {totalActiveFilters > 0 && (
        <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
          {totalActiveFilters}
        </span>
      )}
    </button>
  );

  return (
    <>
      <MobileFilterButton />
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Filter Panel */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full lg:h-auto w-80 lg:w-auto
          bg-white lg:bg-transparent border-r lg:border-r-0 border-gray-200
          transform transition-transform duration-300 z-50 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto lg:overflow-visible
        `}
        role="complementary"
        aria-label={`Filter ${activeTab === 'application-portfolio' ? 'application' : 'project'} portfolio services${totalActiveFilters > 0 ? ` (${totalActiveFilters} active filters)` : ''}`}
      >
        <div className="p-6 lg:p-0 lg:pr-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close filters panel"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* Clear All Filters */}
          {totalActiveFilters > 0 && (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full min-h-[44px] px-2"
                aria-label={`Clear all ${totalActiveFilters} active filters`}
              >
                Clear All Filters ({totalActiveFilters})
              </Button>
            </div>
          )}

          {/* Filter Groups */}
          <div className="space-y-6">
            {Object.entries(currentFilters).map(([category, options]) => {
              const filterCount = getFilterCount(category);
              const categoryLabel = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <fieldset key={category} className="space-y-3">
                  <legend className="text-sm font-semibold text-gray-900 flex items-center justify-between">
                    <span>{categoryLabel}</span>
                    {filterCount > 0 && (
                      <span 
                        className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full"
                        aria-label={`${filterCount} selected`}
                      >
                        {filterCount}
                      </span>
                    )}
                  </legend>
                  
                  <div className="space-y-2">
                    {options.map((option) => {
                      const isChecked = selectedFilters[category]?.includes(option) || false;
                      const checkboxId = `${category}-${option.replace(/\s+/g, '-').toLowerCase()}`;
                      
                      return (
                        <div key={option} className="flex items-center space-x-3 min-h-[44px] py-2">
                          <Checkbox
                            id={checkboxId}
                            checked={isChecked}
                            onCheckedChange={(checked) => 
                              onFilterChange(category, option, checked as boolean)
                            }
                            className="w-5 h-5"
                          />
                          <label
                            htmlFor={checkboxId}
                            className="text-sm text-gray-700 cursor-pointer flex-1 min-h-[44px] flex items-center"
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
          </div>

          {/* Active Filters Summary (Screen Reader) */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {totalActiveFilters > 0 
              ? `${totalActiveFilters} filters active`
              : 'No filters active'
            }
          </div>
        </div>
      </aside>
    </>
  );
}