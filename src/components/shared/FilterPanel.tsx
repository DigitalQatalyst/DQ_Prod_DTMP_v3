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
import { RotateCcw, ChevronRight, SlidersHorizontal } from "lucide-react";

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
      className="w-full lg:w-64 bg-white border border-gray-200 rounded-xl h-fit sticky top-4 overflow-hidden"
      role="complementary"
      aria-label="Filter panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-[hsl(var(--orange))] hover:text-[hsl(var(--orange))]/80 hover:bg-orange-50 -mr-2 h-7 px-2 text-xs"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Filter Groups — accordion rows with dividers */}
      <div className="divide-y divide-gray-100">
        {filters.map((filter) => {
          const isExpanded = expandedGroups[filter.key] ?? false;
          const activeVal = activeFilters[filter.key];
          const activeCount = Array.isArray(activeVal)
            ? activeVal.length
            : activeVal
            ? 1
            : 0;

          return (
            <div key={filter.key}>
              {/* Row header */}
              <button
                type="button"
                onClick={() => toggleGroup(filter.key)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-800">
                  {filter.label}
                  {activeCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
                      {activeCount}
                    </span>
                  )}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-1 bg-gray-50/50">
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
