import { useState } from "react";
import { Search, Star, Clock, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, string[]>;
  timestamp: string;
}

interface EnhancedSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  selectedFilters?: Record<string, string[]>;
  onFilterChange?: (group: string, value: string) => void;
}

const mockSavedSearches: SavedSearch[] = [
  {
    id: "1",
    name: "Critical Applications",
    query: "",
    filters: { criticality: ["critical"] },
    timestamp: "2024-02-15"
  },
  {
    id: "2",
    name: "Cloud Migration Candidates",
    query: "cloud",
    filters: { analysisType: ["Technical"] },
    timestamp: "2024-02-14"
  },
  {
    id: "3",
    name: "High Cost Applications",
    query: "cost",
    filters: { category: ["TCO Management"] },
    timestamp: "2024-02-10"
  }
];

export function EnhancedSearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search applications, services, or categories...",
  selectedFilters = {},
  onFilterChange
}: EnhancedSearchBarProps) {
  const [savedSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "Critical applications",
    "Cloud migration",
    "Technical debt",
    "License compliance",
    "Security vulnerabilities",
    "End of life"
  ];

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  );

  const handleSavedSearchClick = (search: SavedSearch) => {
    onSearchChange(search.query);
    if (onFilterChange) {
      Object.entries(search.filters).forEach(([group, values]) => {
        values.forEach(value => onFilterChange(group, value));
      });
    }
  };

  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, filters) => sum + filters.length,
    0
  );

  return (
    <div className="space-y-3">
      {/* Search Input with Saved Searches */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-10 h-12 text-base"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Search Suggestions */}
          {showSuggestions && (filteredSuggestions.length > 0 || searchQuery.length === 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              {searchQuery.length === 0 && (
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Searches</p>
                  <div className="space-y-1">
                    {["Cloud migration", "Technical debt"].map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSearchChange(term)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-sm"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {filteredSuggestions.length > 0 && (
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Suggestions</p>
                  {filteredSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSearchChange(suggestion)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Saved Searches Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12 gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Saved</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-2 py-1.5">
              <p className="text-xs font-semibold text-gray-500 uppercase">Saved Searches</p>
            </div>
            <DropdownMenuSeparator />
            {savedSearches.map((search) => (
              <DropdownMenuItem
                key={search.id}
                onClick={() => handleSavedSearchClick(search)}
                className="flex items-start gap-2 py-2"
              >
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{search.name}</p>
                  <p className="text-xs text-gray-500">{search.timestamp}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-blue-600">
              <Star className="w-4 h-4 mr-2" />
              Save Current Search
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Indicator */}
        {activeFilterCount > 0 && (
          <Button variant="outline" className="h-12 gap-2">
            <Filter className="w-4 h-4" />
            <Badge className="bg-blue-600 text-white">{activeFilterCount}</Badge>
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([group, values]) =>
            values.map((value) => (
              <Badge
                key={`${group}-${value}`}
                variant="secondary"
                className="gap-1 pr-1"
              >
                <span className="text-xs">{value}</span>
                <button
                  onClick={() => onFilterChange?.(group, value)}
                  className="hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      )}
    </div>
  );
}
