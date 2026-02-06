import { useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { solutionSpecsFilters, solutionBuildFilters } from "@/data/blueprints/filters";

/**
 * Example: Solution Specs FilterPanel
 * 
 * Demonstrates the FilterPanel component with solution specification filters.
 */
export function SolutionSpecsFilterExample() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});

  const handleFilterChange = (filterKey: string, value: string | string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleReset = () => {
    setActiveFilters({});
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Solution Specs Filter Example</h1>
        <div className="flex gap-6">
          <FilterPanel
            filters={solutionSpecsFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
          <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Active Filters</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(activeFilters, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example: Solution Build FilterPanel
 * 
 * Demonstrates the FilterPanel component with solution build filters.
 */
export function SolutionBuildFilterExample() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({});

  const handleFilterChange = (filterKey: string, value: string | string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleReset = () => {
    setActiveFilters({});
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Solution Build Filter Example</h1>
        <div className="flex gap-6">
          <FilterPanel
            filters={solutionBuildFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
          <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Active Filters</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(activeFilters, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example: FilterPanel with Pre-selected Filters
 * 
 * Demonstrates the FilterPanel component with initial filter values.
 */
export function PreSelectedFiltersExample() {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | string[]>>({
    scope: ["enterprise", "departmental"],
    maturityLevel: ["proven"],
    hasDiagrams: ["true"],
  });

  const handleFilterChange = (filterKey: string, value: string | string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleReset = () => {
    setActiveFilters({});
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pre-selected Filters Example</h1>
        <div className="flex gap-6">
          <FilterPanel
            filters={solutionSpecsFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
          <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Active Filters</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(activeFilters, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
