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
import { RotateCcw } from "lucide-react";

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
      <div className="space-y-3">
        {filter.options?.map((option) => {
          const isChecked = selectedValues.includes(option.value);
          const checkboxId = `${filter.key}-${option.value}`;

          return (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={checkboxId}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(option.value, checked === true)
                }
                aria-label={option.label}
              />
              <Label
                htmlFor={checkboxId}
                className="text-sm font-normal cursor-pointer"
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

      {/* Filter Groups */}
      <div className="space-y-6">
        {filters.map((filter) => (
          <div key={filter.key} className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              {filter.label}
            </h3>
            {renderFilter(filter)}
          </div>
        ))}
      </div>
    </aside>
  );
}
