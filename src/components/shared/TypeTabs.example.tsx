/**
 * Example usage of TypeTabs component
 * 
 * This file demonstrates how to use the TypeTabs component
 * in a marketplace page with solution type filtering.
 */

import { useState } from "react";
import { TypeTabs } from "./TypeTabs";
import { SolutionType } from "@/data/blueprints/solutionSpecs";

export function TypeTabsExample() {
  const [activeType, setActiveType] = useState<SolutionType | "all">("all");
  
  // Mock data for demonstration
  const allItems = [
    { id: 1, title: "DBP Item 1", solutionType: "DBP" as SolutionType },
    { id: 2, title: "DXP Item 1", solutionType: "DXP" as SolutionType },
    { id: 3, title: "DBP Item 2", solutionType: "DBP" as SolutionType },
    { id: 4, title: "DWS Item 1", solutionType: "DWS" as SolutionType },
    { id: 5, title: "DIA Item 1", solutionType: "DIA" as SolutionType },
    { id: 6, title: "SDO Item 1", solutionType: "SDO" as SolutionType },
  ];

  // Calculate type counts
  const typeCounts: Record<SolutionType, number> = {
    DBP: allItems.filter((item) => item.solutionType === "DBP").length,
    DXP: allItems.filter((item) => item.solutionType === "DXP").length,
    DWS: allItems.filter((item) => item.solutionType === "DWS").length,
    DIA: allItems.filter((item) => item.solutionType === "DIA").length,
    SDO: allItems.filter((item) => item.solutionType === "SDO").length,
  };

  // Filter items based on active type
  const filteredItems =
    activeType === "all"
      ? allItems
      : allItems.filter((item) => item.solutionType === activeType);

  return (
    <div>
      <TypeTabs
        activeType={activeType}
        onTypeChange={setActiveType}
        typeCounts={typeCounts}
      />
      
      {/* Your marketplace content here */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="card-marketplace">
              <h3>{item.title}</h3>
              <span className="badge">{item.solutionType}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Usage with MarketplaceHeader:
 * 
 * function SolutionSpecsPage() {
 *   const [searchQuery, setSearchQuery] = useState("");
 *   const [activeType, setActiveType] = useState<SolutionType | "all">("all");
 *   
 *   // Calculate counts and filter data
 *   const typeCounts = calculateTypeCounts(solutionSpecs);
 *   const filteredSpecs = filterByTypeAndSearch(solutionSpecs, activeType, searchQuery);
 *   
 *   return (
 *     <>
 *       <MarketplaceHeader
 *         title="Solution Specs"
 *         description="Technical architecture blueprints"
 *         searchValue={searchQuery}
 *         onSearchChange={setSearchQuery}
 *         itemCount={filteredSpecs.length}
 *       />
 *       <TypeTabs
 *         activeType={activeType}
 *         onTypeChange={setActiveType}
 *         typeCounts={typeCounts}
 *       />
 *       <div className="content">
 *         {filteredSpecs.map(spec => <SpecCard key={spec.id} spec={spec} />)}
 *       </div>
 *     </>
 *   );
 * }
 */
