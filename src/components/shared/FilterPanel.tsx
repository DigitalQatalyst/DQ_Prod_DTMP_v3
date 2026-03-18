import { useState } from "react";
import { FilterConfig } from "@/data/blueprints/filters";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw, ChevronDown, ChevronRight } from "lucide-react";

type FilterValue = string | string[] | number | boolean | undefined;

interface FilterPanelProps {
  filters: FilterConfig[];
  activeFilters: Record<string, FilterValue>;
  onFilterChange: (filterKey: string, value: FilterValue) => void;
  onReset: () => void;
}

export function FilterPanel({
  filters,
  activeFilters,
  onFilterChange,
  onReset,
}: FilterPanelProps) {
  // All groups collapsed by default — user clicks to expand (matches other marketplace pattern)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Check if any filters are active
  const hasActiveFilters = Object.keys(activeFilters).some((key) => {
    const value = activeFilters[key];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  });

  const renderCheckboxFilter = (filter: FilterConfig) => {
    const selectedValues = (activeFilters[filter.key] as string[]) || [];

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      const newValues = checked
        ? [...selectedValues, optionValue]
        : selectedValues.filter((v) => v !== optionValue);
      onFilterChange(filter.key, newValues);
    };

    return (
      <div className="space-y-1">
        {filter.options?.map((option) => {
          const isChecked = selectedValues.includes(option.value);
          const checkboxId = `${filter.key}-${option.value}`;

          return (
            <div key={option.value} className="flex items-center gap-2 py-1 min-h-[32px]">
              <Checkbox
                id={checkboxId}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(option.value, checked === true)
                }
                className="border-gray-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 w-4 h-4"
                aria-label={option.label}
              />
              <Label
                htmlFor={checkboxId}
                className="text-sm font-normal text-gray-700 cursor-pointer hover:text-gray-900 flex-1"
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </div>
    );
  };

  const renderRadioFilter = (filter: FilterConfig) => {
    const selectedValue = (activeFilters[filter.key] as string) || "";

    return (
      <RadioGroup
        value={selectedValue}
        onValueChange={(value) => onFilterChange(filter.key, value)}
        aria-label={filter.label}
      >
        {filter.options?.map((option) => {
          const radioId = `${filter.key}-${option.value}`;

          return (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={radioId}
                aria-label={option.label}
              />
              <Label
                htmlFor={radioId}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  const renderSelectFilter = (filter: FilterConfig) => {
    const selectedValue = (activeFilters[filter.key] as string) || "";

    return (
      <Select
        value={selectedValue}
        onValueChange={(value) => onFilterChange(filter.key, value)}
      >
        <SelectTrigger aria-label={filter.label}>
          <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {filter.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case "checkbox":
        return renderCheckboxFilter(filter);
      case "radio":
        return renderRadioFilter(filter);
      case "select":
        return renderSelectFilter(filter);
      default:
        return null;
    }
  };

  return (
    <aside
      className="w-full lg:w-64 bg-white border border-gray-200 rounded-lg p-6 h-fit sticky top-4"
      role="complementary"
      aria-label="Filter panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-[hsl(var(--orange))] hover:text-[hsl(var(--orange))]/80 hover:bg-orange-50 -mr-2"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Filter Groups — collapsible, matching other marketplace panels */}
      <div className="space-y-2">
        {filters.map((filter) => {
          const isExpanded = expandedGroups[filter.key] ?? false;
          // Count active selections for badge
          const activeVal = activeFilters[filter.key];
          const activeCount = Array.isArray(activeVal)
            ? activeVal.length
            : activeVal
            ? 1
            : 0;

          return (
            <div key={filter.key} className="border border-gray-100 rounded-lg">
              {/* Group header — clickable toggle */}
              <button
                type="button"
                onClick={() => toggleGroup(filter.key)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {filter.label}
                  {activeCount > 0 && (
                    <span className="ml-2 text-xs font-normal text-orange-600">
                      ({activeCount})
                    </span>
                  )}
                </span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1">
                  {renderFilter(filter)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
