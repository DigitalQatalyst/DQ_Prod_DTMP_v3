import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface MarketplaceHeaderProps {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  itemCount: number;
  searchPlaceholder?: string;
}

export function MarketplaceHeader({
  title,
  description,
  searchValue,
  onSearchChange,
  itemCount,
  searchPlaceholder = "Search...",
}: MarketplaceHeaderProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // Debounced search with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchValue, onSearchChange]);

  // Sync with external changes
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const handleClear = () => {
    setLocalSearchValue("");
  };

  return (
    <section
      className="section-gradient py-12 lg:py-16"
      aria-labelledby="marketplace-title"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Title & Description */}
        <h1
          id="marketplace-title"
          className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3"
        >
          {title}
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mb-6">
          {description}
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mb-4">
          <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 focus-within:border-[hsl(var(--orange))] focus-within:ring-2 focus-within:ring-orange-200 transition-all">
            <Search
              className="w-5 h-5 text-gray-400 flex-shrink-0"
              aria-hidden="true"
            />
            <label htmlFor="marketplace-search" className="sr-only">
              {searchPlaceholder}
            </label>
            <Input
              id="marketplace-search"
              type="search"
              value={localSearchValue}
              onChange={(e) => setLocalSearchValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              aria-label={searchPlaceholder}
            />
            {localSearchValue && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-1 min-w-[32px] min-h-[32px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Item Count */}
        <div className="text-sm text-muted-foreground">
          <span aria-live="polite" aria-atomic="true">
            Showing {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </section>
  );
}
