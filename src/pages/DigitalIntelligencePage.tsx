 import { useState, useMemo, useCallback, useEffect, useRef } from "react";
 import { useNavigate } from "react-router-dom";
 import { SlidersHorizontal, Server, TrendingUp, FolderKanban } from "lucide-react";
 import { Header } from "@/components/layout/Header";
 import { Footer } from "@/components/layout/Footer";
 import { IntelligenceCard, MarketplaceHeader } from "@/components/digitalIntelligence";
 import { LoginModal } from "@/components/learningCenter";
 import { SearchBar } from "@/components/learningCenter/SearchBar";
 import {
   FilterPanel,
   MobileFilterButton,
 } from "@/components/learningCenter/FilterPanel";
 import {
   systemsPortfolio,
   digitalMaturity,
   projectsPortfolio,
   systemsPortfolioFilters,
   digitalMaturityFilters,
   projectsPortfolioFilters,
   type SystemsPortfolioService,
   type DigitalMaturityService,
   type ProjectsPortfolioService,
 } from "@/data/digitalIntelligence";
 
 // ---------------------------------------------------------------------------
 // Types
 // ---------------------------------------------------------------------------
 
 type TabValue = "systems-portfolio" | "digital-maturity" | "projects-portfolio";
 
 interface TabConfig {
   value: TabValue;
   label: string;
   shortLabel: string;
   icon: React.ReactNode;
   count: number;
 }
 
 interface LoginContext {
   marketplace: string;
   tab: string;
   cardId: string;
   serviceName: string;
   action: string;
 }
 
 type ServiceType = SystemsPortfolioService | DigitalMaturityService | ProjectsPortfolioService;
 
 // ---------------------------------------------------------------------------
 // Constants
 // ---------------------------------------------------------------------------
 
 const DEBOUNCE_DELAY = 300;
 
 const TABS: TabConfig[] = [
   {
     value: "systems-portfolio",
     label: "Systems Portfolio & Lifecycle",
     shortLabel: "Systems",
     icon: <Server className="w-4 h-4" />,
     count: 12,
   },
   {
     value: "digital-maturity",
     label: "Digital Maturity",
     shortLabel: "Maturity",
     icon: <TrendingUp className="w-4 h-4" />,
     count: 8,
   },
   {
     value: "projects-portfolio",
     label: "Projects Portfolio & Lifecycle",
     shortLabel: "Projects",
     icon: <FolderKanban className="w-4 h-4" />,
     count: 10,
   },
 ];
 
 const SEARCH_PLACEHOLDERS: Record<TabValue, string> = {
   "systems-portfolio": "Search system analytics or metrics...",
   "digital-maturity": "Search maturity assessments or domains...",
   "projects-portfolio": "Search project analytics or predictions...",
 };
 
 // ---------------------------------------------------------------------------
 // Component
 // ---------------------------------------------------------------------------
 
 export default function DigitalIntelligencePage() {
   const navigate = useNavigate();
 
   // --- State ---------------------------------------------------------------
   const [activeTab, setActiveTab] = useState<TabValue>("systems-portfolio");
   const [searchQuery, setSearchQuery] = useState("");
   const [debouncedSearch, setDebouncedSearch] = useState("");
   const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
   const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
   const [loginModal, setLoginModal] = useState<{
     open: boolean;
     context: LoginContext;
   }>({
     open: false,
     context: {
       marketplace: "digital-intelligence",
       tab: "systems-portfolio",
       cardId: "",
       serviceName: "",
       action: "View Analytics",
     },
   });
 
   // --- Debounced search ----------------------------------------------------
   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 
   useEffect(() => {
     if (timerRef.current) clearTimeout(timerRef.current);
     timerRef.current = setTimeout(() => {
       setDebouncedSearch(searchQuery);
     }, DEBOUNCE_DELAY);
     return () => {
       if (timerRef.current) clearTimeout(timerRef.current);
     };
   }, [searchQuery]);
 
   // --- Derived data based on active tab ------------------------------------
   const currentData: ServiceType[] = useMemo(() => {
     switch (activeTab) {
       case "systems-portfolio":
         return systemsPortfolio;
       case "digital-maturity":
         return digitalMaturity;
       case "projects-portfolio":
         return projectsPortfolio;
       default:
         return systemsPortfolio;
     }
   }, [activeTab]);
 
   const currentFilters = useMemo(() => {
     switch (activeTab) {
       case "systems-portfolio":
         return systemsPortfolioFilters;
       case "digital-maturity":
         return digitalMaturityFilters;
       case "projects-portfolio":
         return projectsPortfolioFilters;
       default:
         return systemsPortfolioFilters;
     }
   }, [activeTab]);
 
   // --- Active filter count -------------------------------------------------
   const activeFilterCount = useMemo(
     () => Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0),
     [selectedFilters]
   );
 
   // --- Tab switch handler (resets filters + search) ------------------------
   const handleTabChange = useCallback((tab: TabValue) => {
     setActiveTab(tab);
     setSelectedFilters({});
     setSearchQuery("");
     setDebouncedSearch("");
   }, []);
 
  // --- Filter handlers -----------------------------------------------------
  const handleFilterChange = useCallback((group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: next };
    });
  }, []);

  const handleFilterSelect = useCallback((group: string, value: string | null) => {
    setSelectedFilters((prev) => {
      if (!value) {
        const updated = { ...prev };
        delete updated[group];
        return updated;
      }
      return { ...prev, [group]: [value] };
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedFilters({});
    setSearchQuery("");
    setDebouncedSearch("");
  }, []);
 
   // --- Filter logic (memoised) ---------------------------------------------
   const applyFilters = useCallback(
     (results: ServiceType[], filters: Record<string, string[]>) => {
       let filtered = results;
 
       Object.entries(filters).forEach(([group, values]) => {
         if (values.length === 0) return;
 
         filtered = filtered.filter((service) => {
           switch (group) {
             case "analyticsType":
               return values.includes((service as SystemsPortfolioService | ProjectsPortfolioService).analyticsType);
             case "systemScope":
               return values.includes((service as SystemsPortfolioService).systemScope);
             case "dataSource":
               return values.includes((service as SystemsPortfolioService | ProjectsPortfolioService).dataSource || "");
             case "aiCapability":
               return values.some((v) =>
                 v === "None"
                   ? service.aiCapabilities.length === 0
                   : service.aiCapabilities.some((cap) => cap.toLowerCase().includes(v.toLowerCase()))
               );
             case "updateFrequency":
               return values.includes((service as SystemsPortfolioService | ProjectsPortfolioService).updateFrequency || "");
             case "visualizationType":
               return values.includes((service as SystemsPortfolioService | ProjectsPortfolioService).visualizationType || "");
             case "complexity":
               return values.includes(service.complexity);
             case "assessmentType":
               return values.includes((service as DigitalMaturityService).analyticsType);
             case "assessmentScope":
               return values.includes((service as DigitalMaturityService).assessmentScope);
             case "framework":
               return values.includes((service as DigitalMaturityService).framework);
             case "outputFormat":
               return values.includes((service as DigitalMaturityService).outputFormat);
             case "assessmentFrequency":
               return values.includes((service as DigitalMaturityService).assessmentFrequency);
             case "projectType":
               return values.includes((service as ProjectsPortfolioService).projectType);
             default:
               return true;
           }
         });
       });
 
       return filtered;
     },
     []
   );
 
   const filteredServices = useMemo(() => {
     let results: ServiceType[] = currentData;
 
     // Text search (debounced)
     if (debouncedSearch.trim()) {
       const q = debouncedSearch.toLowerCase();
       results = results.filter(
         (service) =>
           service.title.toLowerCase().includes(q) ||
           service.description.toLowerCase().includes(q) ||
           service.aiCapabilities.some((c) => c.toLowerCase().includes(q)) ||
           service.keyInsights.some((i) => i.toLowerCase().includes(q))
       );
     }
 
     // Checkbox filters
     results = applyFilters(results, selectedFilters);
 
     return results;
   }, [currentData, debouncedSearch, selectedFilters, applyFilters]);
 
   // --- Card click -> navigate to detail page -------------------------------
   const handleServiceClick = useCallback(
     (serviceId: string) => {
       navigate(`/marketplaces/digital-intelligence/${activeTab}/${serviceId}`);
     },
     [navigate, activeTab]
   );
 
   const closeLoginModal = useCallback(() => {
     setLoginModal((prev) => ({ ...prev, open: false }));
   }, []);
 
   // --- Render --------------------------------------------------------------
   return (
     <div className="min-h-screen flex flex-col bg-gray-50">
       <Header />
       <MarketplaceHeader />
 
       <main className="flex-1" id="main-content">
         <div className="max-w-7xl mx-auto px-4 py-12">
           {/* ── Tabs ── */}
           <div
             className="flex border-b border-gray-200 mb-6 overflow-x-auto"
             role="tablist"
             aria-label="Digital Intelligence categories"
           >
             {TABS.map((tab) => {
               const isActive = activeTab === tab.value;
               return (
                 <button
                   key={tab.value}
                   role="tab"
                   id={`tab-${tab.value}`}
                   aria-selected={isActive}
                   aria-controls={`panel-${tab.value}`}
                   onClick={() => handleTabChange(tab.value)}
                   className={`px-4 md:px-6 py-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset whitespace-nowrap ${
                     isActive
                       ? "border-b-2 border-purple-600 text-purple-600"
                       : "text-gray-500 hover:text-gray-700"
                   }`}
                 >
                   <span className="flex items-center gap-2">
                     {tab.icon}
                     {/* Full label on desktop, short on mobile */}
                     <span className="hidden sm:inline">{tab.label}</span>
                     <span className="sm:hidden">{tab.shortLabel}</span>
                     <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                       {tab.count}
                     </span>
                   </span>
                 </button>
               );
             })}
           </div>
 
           {/* ── Tab Panel ── */}
           <div
             role="tabpanel"
             id={`panel-${activeTab}`}
             aria-labelledby={`tab-${activeTab}`}
           >
             {/* Search */}
             <div className="mb-6">
               <SearchBar
                 value={searchQuery}
                 onChange={setSearchQuery}
                 placeholder={SEARCH_PLACEHOLDERS[activeTab]}
               />
             </div>
 
             <div className="flex gap-6">
               {/* ── Filter Panel (sidebar / drawer) ── */}
              <FilterPanel
                filters={currentFilters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onFilterSelect={handleFilterSelect}
                onClearAll={handleClearFilters}
                isOpen={mobileFilterOpen}
                onClose={() => setMobileFilterOpen(false)}
                variant="dropdown"
              />
 
               {/* ── Main Content ── */}
               <div className="flex-1">
                 {/* Result count */}
                 <div className="mb-4">
                   <p
                     className="text-sm text-gray-600"
                     role="status"
                     aria-live="polite"
                     aria-atomic="true"
                   >
                     {filteredServices.length}{" "}
                     {filteredServices.length === 1 ? "service" : "services"} found
                     {activeFilterCount > 0 && (
                       <span className="ml-1 text-gray-400">
                         ({activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} active)
                       </span>
                     )}
                   </p>
                 </div>
 
                 {/* Cards grid */}
                 {filteredServices.length > 0 ? (
                   <div
                     className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                     role="list"
                     aria-label="Intelligence service cards"
                   >
                     {filteredServices.map((service) => (
                       <IntelligenceCard
                         key={service.id}
                         service={{
                           ...service,
                           dataSource: (service as SystemsPortfolioService).dataSource || (service as ProjectsPortfolioService).dataSource,
                           updateFrequency: (service as SystemsPortfolioService).updateFrequency || (service as ProjectsPortfolioService).updateFrequency,
                           visualizationType: (service as SystemsPortfolioService).visualizationType || (service as ProjectsPortfolioService).visualizationType,
                           outputFormat: (service as DigitalMaturityService).outputFormat,
                         }}
                         onClick={() => handleServiceClick(service.id)}
                       />
                     ))}
                   </div>
                 ) : (
                   /* ── Empty State ── */
                   <div
                     className="bg-white border-2 border-gray-200 rounded-xl p-12 text-center"
                     role="status"
                     aria-live="polite"
                   >
                     <div className="max-w-md mx-auto">
                       <div
                         className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                         aria-hidden="true"
                       >
                         <SlidersHorizontal className="text-gray-400" size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-gray-900 mb-2">
                         No services match your criteria
                       </h3>
                       <p className="text-gray-600 mb-6">
                         Try adjusting your filters or search query to find what
                         you're looking for.
                       </p>
                       <button
                         onClick={handleClearFilters}
                         className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg min-h-[44px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                         aria-label="Clear all filters and search"
                       >
                         Clear all filters
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       </main>
 
       {/* Mobile floating filter button */}
       <MobileFilterButton onClick={() => setMobileFilterOpen(true)} />
 
       {/* Login Modal */}
       <LoginModal
         isOpen={loginModal.open}
         onClose={closeLoginModal}
         context={loginModal.context}
       />
 
       <Footer />
     </div>
   );
 }