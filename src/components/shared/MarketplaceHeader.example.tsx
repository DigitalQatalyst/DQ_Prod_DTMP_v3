/**
 * Example usage of MarketplaceHeader component
 * 
 * This file demonstrates how to use the MarketplaceHeader component
 * in a marketplace page with debounced search functionality.
 */

import { useState } from "react";
import { MarketplaceHeader } from "./MarketplaceHeader";

export function MarketplaceHeaderExample() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data for demonstration
  const allItems = [
    { id: 1, title: "Item 1" },
    { id: 2, title: "Item 2" },
    { id: 3, title: "Item 3" },
  ];

  // Filter items based on search query
  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <MarketplaceHeader
        title="Solution Specs Marketplace"
        description="Access comprehensive technical architecture blueprints and solution specifications for building digital platforms."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredItems.length}
        searchPlaceholder="Search solution specs..."
      />
      
      {/* Your marketplace content here */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="card-marketplace">
              <h3>{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Usage in Solution Build Marketplace:
 * 
 * <MarketplaceHeader
 *   title="Solution Build Marketplace"
 *   description="Implementation guides and build resources for deploying enterprise-grade solutions."
 *   searchValue={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   itemCount={filteredBuilds.length}
 *   searchPlaceholder="Search solution builds..."
 * />
 */
