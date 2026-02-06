# Shared Components

This directory contains reusable components that are shared across multiple marketplace pages.

## MarketplaceHeader

A reusable header component for marketplace pages with integrated search functionality and item count display.

### Features

- **Debounced Search**: Search input is debounced with a 300ms delay for optimal performance
- **Item Count Display**: Shows the number of items currently displayed
- **Accessible**: Includes proper ARIA labels and semantic HTML
- **Consistent Styling**: Follows the DTMP design system patterns
- **Clear Button**: Allows users to quickly clear the search input

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | The main title of the marketplace |
| `description` | `string` | Yes | - | A brief description of the marketplace |
| `searchValue` | `string` | Yes | - | The current search query value |
| `onSearchChange` | `(value: string) => void` | Yes | - | Callback function called when search value changes (debounced) |
| `itemCount` | `number` | Yes | - | The number of items currently displayed |
| `searchPlaceholder` | `string` | No | `"Search..."` | Placeholder text for the search input |

### Usage

```tsx
import { useState } from "react";
import { MarketplaceHeader } from "@/components/shared";

function MyMarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Your filtering logic here
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <MarketplaceHeader
        title="Solution Specs Marketplace"
        description="Access comprehensive technical architecture blueprints."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredItems.length}
        searchPlaceholder="Search solution specs..."
      />
      
      {/* Your marketplace content */}
    </div>
  );
}
```

### Implementation Details

#### Debounced Search

The component implements a 300ms debounce on the search input to prevent excessive re-renders and improve performance. The debounce is handled internally using `useEffect` and `setTimeout`.

```tsx
// Internal implementation
useEffect(() => {
  const timer = setTimeout(() => {
    onSearchChange(localSearchValue);
  }, 300);

  return () => clearTimeout(timer);
}, [localSearchValue, onSearchChange]);
```

This means:
- Users can type freely without triggering immediate updates
- The `onSearchChange` callback is only called 300ms after the user stops typing
- The component maintains its own local state for immediate UI feedback

#### Accessibility

The component includes several accessibility features:
- Semantic HTML with proper heading hierarchy
- ARIA labels for screen readers
- `aria-live` region for item count updates
- Keyboard-accessible clear button
- Proper focus management

### Styling

The component uses the DTMP design system classes:
- `section-gradient`: Gradient background for the header section
- `text-primary-navy`: Navy color for the title
- `text-muted-foreground`: Muted color for description and item count
- Orange accent color for focus states (consistent with DTMP theme)

### Testing

The component includes comprehensive unit tests covering:
- Rendering of title, description, and item count
- Debounced search functionality (300ms delay)
- Clear button functionality
- Custom placeholder text
- Singular/plural item count text

Run tests with:
```bash
npm test -- MarketplaceHeader
```

## TypeTabs

A tab navigation component for filtering marketplace content by solution type (DBP, DXP, DWS, DIA, SDO).

### Features

- **Solution Type Navigation**: Provides tabs for all solution types plus an "All" option
- **Count Badges**: Displays the number of items for each solution type
- **Active State Styling**: Clearly indicates the currently selected type
- **Accessible**: Includes proper ARIA attributes and keyboard navigation
- **Responsive**: Horizontal scrolling on smaller screens
- **Tooltips**: Full solution type names on hover

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activeType` | `SolutionType \| "all"` | Yes | The currently active solution type |
| `onTypeChange` | `(type: SolutionType \| "all") => void` | Yes | Callback function called when a tab is clicked |
| `typeCounts` | `Record<SolutionType, number>` | Yes | Object containing the count for each solution type |

### Solution Types

- **All**: Shows all solutions across all types
- **DBP**: Digital Business Platform
- **DXP**: Digital Experience Platform
- **DWS**: Digital Workplace Solutions
- **DIA**: Data & Intelligence & Analytics
- **SDO**: Security & DevOps

### Usage

```tsx
import { useState } from "react";
import { TypeTabs } from "@/components/shared";
import { SolutionType } from "@/data/blueprints/solutionSpecs";

function MyMarketplacePage() {
  const [activeType, setActiveType] = useState<SolutionType | "all">("all");
  
  // Calculate counts from your data
  const typeCounts: Record<SolutionType, number> = {
    DBP: specs.filter(s => s.solutionType === "DBP").length,
    DXP: specs.filter(s => s.solutionType === "DXP").length,
    DWS: specs.filter(s => s.solutionType === "DWS").length,
    DIA: specs.filter(s => s.solutionType === "DIA").length,
    SDO: specs.filter(s => s.solutionType === "SDO").length,
  };

  // Filter your data based on activeType
  const filteredSpecs = activeType === "all" 
    ? specs 
    : specs.filter(s => s.solutionType === activeType);

  return (
    <div>
      <TypeTabs
        activeType={activeType}
        onTypeChange={setActiveType}
        typeCounts={typeCounts}
      />
      
      {/* Your marketplace content */}
    </div>
  );
}
```

### Implementation Details

#### Count Calculation

The "All" tab automatically calculates the total count by summing all individual type counts:

```tsx
const totalCount = Object.values(typeCounts).reduce((sum, count) => sum + count, 0);
```

#### Active State

The active tab is styled with:
- Orange bottom border (`border-[hsl(var(--orange))]`)
- Orange text color
- Light orange background
- Orange badge background

Inactive tabs have:
- Gray text
- Transparent border
- Gray badge background
- Hover effects for better UX

#### Accessibility

The component includes comprehensive accessibility features:
- `role="tablist"` on the navigation container
- `role="tab"` on each button
- `aria-selected` to indicate the active tab
- `aria-controls` linking tabs to their content panels
- `aria-label` on count badges for screen readers
- Keyboard focus indicators
- Descriptive tooltips with full solution type names

### Styling

The component uses:
- DTMP orange accent color for active states
- Gray color scheme for inactive states
- Badge component from the UI library
- Responsive design with horizontal scrolling
- Focus ring for keyboard navigation

### Testing

The component includes comprehensive unit tests covering:
- Rendering of all solution type tabs
- Display of correct count badges
- Active tab highlighting
- Click event handling
- Zero count handling
- Accessibility attributes

Run tests with:
```bash
npm test -- TypeTabs
```

## FilterPanel

A configurable filter sidebar component that supports multiple filter types (checkbox, radio, select) for marketplace pages.

### Features

- **Multiple Filter Types**: Supports checkbox, radio, and select filter types
- **Configurable**: Accepts a FilterConfig array to define filter structure
- **Reset Functionality**: Includes a reset button that appears when filters are active
- **Active State Tracking**: Tracks and displays active filter selections
- **Accessible**: Includes proper ARIA labels and semantic HTML
- **Consistent Styling**: Follows the DTMP design system patterns
- **Sticky Positioning**: Stays visible while scrolling on larger screens

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `filters` | `FilterConfig[]` | Yes | Array of filter configurations defining the filter structure |
| `activeFilters` | `Record<string, any>` | Yes | Object containing the current active filter values |
| `onFilterChange` | `(filterKey: string, value: any) => void` | Yes | Callback function called when a filter value changes |
| `onReset` | `() => void` | Yes | Callback function called when the reset button is clicked |

### FilterConfig Interface

```tsx
interface FilterConfig {
  key: string;                    // Unique identifier for the filter
  label: string;                  // Display label for the filter group
  type: 'checkbox' | 'radio' | 'select' | 'range';  // Filter type
  options?: FilterOption[];       // Available options for the filter
  defaultValue?: any;             // Default value (optional)
}

interface FilterOption {
  value: string;                  // Option value
  label: string;                  // Display label for the option
}
```

### Filter Types

#### Checkbox Filters
- Allows multiple selections
- Active filters stored as an array of strings
- Example: `{ scope: ["enterprise", "departmental"] }`

#### Radio Filters
- Allows single selection
- Active filter stored as a string
- Example: `{ maturityLevel: "proven" }`

#### Select Filters
- Dropdown selection
- Active filter stored as a string
- Example: `{ complexity: "advanced" }`

### Usage

```tsx
import { useState } from "react";
import { FilterPanel } from "@/components/shared";
import { solutionSpecsFilters } from "@/data/blueprints/filters";

function MyMarketplacePage() {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleFilterChange = (filterKey: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleReset = () => {
    setActiveFilters({});
  };

  // Apply filters to your data
  const filteredItems = items.filter(item => {
    // Checkbox filter example
    if (activeFilters.scope?.length > 0) {
      if (!activeFilters.scope.includes(item.scope)) return false;
    }
    
    // Radio filter example
    if (activeFilters.maturityLevel) {
      if (item.maturityLevel !== activeFilters.maturityLevel) return false;
    }
    
    return true;
  });

  return (
    <div className="flex gap-6">
      <FilterPanel
        filters={solutionSpecsFilters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />
      
      <div className="flex-1">
        {/* Your marketplace content */}
      </div>
    </div>
  );
}
```

### Predefined Filter Configurations

The component works with predefined filter configurations from `@/data/blueprints/filters`:

#### Solution Specs Filters
```tsx
import { solutionSpecsFilters } from "@/data/blueprints/filters";

// Includes:
// - Scope (checkbox): enterprise, departmental, project
// - Maturity Level (checkbox): conceptual, proven, reference
// - Has Diagrams (checkbox): yes
```

#### Solution Build Filters
```tsx
import { solutionBuildFilters } from "@/data/blueprints/filters";

// Includes:
// - Build Complexity (checkbox): basic, intermediate, advanced
// - Automation Level (checkbox): manual, semi-automated, fully-automated
// - Has Code Samples (checkbox): yes
```

### Implementation Details

#### Reset Button Visibility

The reset button only appears when there are active filters:

```tsx
const hasActiveFilters = Object.keys(activeFilters).some((key) => {
  const value = activeFilters[key];
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
});
```

#### Checkbox Filter Handling

Checkbox filters maintain an array of selected values:

```tsx
const handleCheckboxChange = (optionValue: string, checked: boolean) => {
  const newValues = checked
    ? [...selectedValues, optionValue]
    : selectedValues.filter((v) => v !== optionValue);
  onFilterChange(filter.key, newValues);
};
```

#### Accessibility

The component includes comprehensive accessibility features:
- `role="complementary"` on the aside element
- `aria-label` on the filter panel and individual filters
- Proper label associations for all form controls
- Keyboard-accessible controls
- Focus indicators for interactive elements
- Screen reader-friendly labels

### Styling

The component uses:
- White background with gray border
- Sticky positioning on larger screens (`sticky top-4`)
- DTMP orange accent color for the reset button
- Consistent spacing and typography
- Responsive width (full width on mobile, 256px on desktop)

### Testing

The component includes comprehensive unit tests covering:
- Rendering of all filter groups
- Checkbox filter interactions
- Multiple checkbox selections
- Radio filter interactions
- Reset button visibility and functionality
- Active filter state reflection in UI
- Filter change callbacks

Run tests with:
```bash
npm test -- FilterPanel
```

### Example Implementations

See `FilterPanel.example.tsx` for complete working examples:
- Solution Specs filter panel
- Solution Build filter panel
- Pre-selected filters example
