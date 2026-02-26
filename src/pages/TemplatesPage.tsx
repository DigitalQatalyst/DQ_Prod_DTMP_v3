import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Sparkles,
  Download,
  AppWindow,
  ClipboardCheck,
  LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  applicationProfiles,
  applicationProfilesFilters,
  assessments,
  assessmentsFilters,
} from "@/data/templates";

type TabType = "application-profiles" | "assessments";

const tabConfig: Record<
  TabType,
  {
    icon: LucideIcon;
    label: string;
    shortLabel: string;
    placeholder: string;
    count: number;
  }
> = {
  "application-profiles": {
    icon: AppWindow,
    label: "Application Profiles",
    shortLabel: "Profiles",
    placeholder: "Search application types or domains...",
    count: applicationProfiles.length,
  },
  assessments: {
    icon: ClipboardCheck,
    label: "Assessments",
    shortLabel: "Assess",
    placeholder: "Search assessment types or frameworks...",
    count: assessments.length,
  },
};

const getFiltersForTab = (tab: TabType) => {
  switch (tab) {
    case "application-profiles":
      return applicationProfilesFilters;
    case "assessments":
      return assessmentsFilters;
    default:
      return {};
  }
};

const getDataForTab = (tab: TabType) => {
  switch (tab) {
    case "application-profiles":
      return applicationProfiles;
    case "assessments":
      return assessments;
    default:
      return [];
  }
};

const getTabLabel = (tab: TabType): string => {
  switch (tab) {
    case "application-profiles":
      return "application profiles";
    case "assessments":
      return "assessments";
    default:
      return "documents";
  }
};

export default function DocumentStudioPage() {
  const [activeTab, setActiveTab] = useState<TabType>("application-profiles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
    setSelectedFilters({});
  };

  const currentFilters = getFiltersForTab(activeTab);
  const currentData = getDataForTab(activeTab);
  const currentConfig = tabConfig[activeTab];

  const totalDocuments = Object.values(tabConfig).reduce((sum, tab) => sum + tab.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <section className="bg-gradient-to-b from-purple-50 to-white py-8 lg:py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/marketplaces" className="hover:text-gray-900">Marketplaces</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">Document Studio</span>
          </nav>

          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold uppercase inline-block mb-3">
            Design
          </span>

          <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] mb-3">
            DTMP Document Studio
          </h1>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 px-4 py-2 rounded-full text-purple-700 font-semibold text-sm mb-3">
            <Sparkles size={18} className="text-purple-600" />
            <span>Powered by AI DocWriter 4.0</span>
          </div>

          <p className="text-base lg:text-lg text-gray-600 max-w-4xl mb-4">
            Generate context-specific documents on demand using AI. Submit a request with your organisational context and the Transformation Office will use AI DocWriter 4.0 to generate a tailored document ready for your review and use.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <FileText size={18} />
              {totalDocuments}+ Documents
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={18} />
              AI-Powered Generation
            </span>
            <span className="flex items-center gap-2">
              <Download size={18} />
              Multiple Output Formats
            </span>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <div className="bg-white border-b-2 border-gray-200 px-4 lg:px-8">
          <TabsList className="h-auto bg-transparent p-0 flex gap-1 overflow-x-auto">
            {(Object.keys(tabConfig) as TabType[]).map((tab) => {
              const config = tabConfig[tab];
              const Icon = config.icon;
              return (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="flex items-center gap-2 px-4 lg:px-6 py-4 text-gray-600 hover:text-gray-900 font-medium relative data-[state=active]:text-[#001F3F] data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:-mb-0.5 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <Icon size={20} />
                  <span className="hidden lg:inline">{config.label}</span>
                  <span className="lg:hidden">{config.shortLabel}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ml-1 ${
                      activeTab === tab ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {config.count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        <div className="flex-1 flex">
          <FilterPanel
            filters={currentFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          <div className="flex-1 flex flex-col">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={currentConfig.placeholder}
            />

            <div className="px-4 lg:px-8 py-3 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{currentData.length}</span> {getTabLabel(activeTab)}
              </p>
            </div>

            {(Object.keys(tabConfig) as TabType[]).map((tab) => (
              <TabsContent key={tab} value={tab} className="flex-1 px-4 lg:px-8 py-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getDataForTab(tab).map((template) => (
                    <TemplateCard key={template.id} template={template as any} tab={tab} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>

      <MobileFilterButton onClick={() => setIsFilterOpen(true)} />

      <Footer />
    </div>
  );
}
