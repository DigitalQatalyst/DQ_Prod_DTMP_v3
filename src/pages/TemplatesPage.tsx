import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Sparkles, 
  Download,
  Shield,
  ListChecks,
  AppWindow,
  Target,
  ClipboardCheck,
  Presentation,
  LucideIcon
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { 
  policyReports, 
  policyReportsFilters,
  procedureReports,
  procedureReportsFilters,
  applicationProfiles,
  applicationProfilesFilters,
  strategyDocs,
  strategyDocsFilters,
  assessments,
  assessmentsFilters,
  executiveSummaries,
  executiveSummariesFilters
} from "@/data/templates";

type TabType = "policy-reports" | "procedure-reports" | "application-profiles" | "strategy-docs" | "assessments" | "executive-summaries";

const tabConfig: Record<TabType, { 
  icon: LucideIcon;
  label: string;
  shortLabel: string;
  placeholder: string;
  count: number;
}> = {
  "policy-reports": {
    icon: Shield,
    label: "Policy Reports",
    shortLabel: "Policy",
    placeholder: "Search policy templates or topics...",
    count: policyReports.length
  },
  "procedure-reports": {
    icon: ListChecks,
    label: "Procedure Reports",
    shortLabel: "Procedure",
    placeholder: "Search procedure templates or processes...",
    count: procedureReports.length
  },
  "application-profiles": {
    icon: AppWindow,
    label: "Application Profiles",
    shortLabel: "Profiles",
    placeholder: "Search application types or domains...",
    count: applicationProfiles.length
  },
  "strategy-docs": {
    icon: Target,
    label: "Strategy Docs",
    shortLabel: "Strategy",
    placeholder: "Search strategy templates or focus areas...",
    count: strategyDocs.length
  },
  "assessments": {
    icon: ClipboardCheck,
    label: "Assessments",
    shortLabel: "Assess",
    placeholder: "Search assessment types or frameworks...",
    count: assessments.length
  },
  "executive-summaries": {
    icon: Presentation,
    label: "Executive Summaries",
    shortLabel: "Exec",
    placeholder: "Search summary templates or formats...",
    count: executiveSummaries.length
  }
};

const getFiltersForTab = (tab: TabType) => {
  switch (tab) {
    case "policy-reports":
      return policyReportsFilters;
    case "procedure-reports":
      return procedureReportsFilters;
    case "application-profiles":
      return applicationProfilesFilters;
    case "strategy-docs":
      return strategyDocsFilters;
    case "assessments":
      return assessmentsFilters;
    case "executive-summaries":
      return executiveSummariesFilters;
    default:
      return {};
  }
};

const getDataForTab = (tab: TabType) => {
  switch (tab) {
    case "policy-reports":
      return policyReports;
    case "procedure-reports":
      return procedureReports;
    case "application-profiles":
      return applicationProfiles;
    case "strategy-docs":
      return strategyDocs;
    case "assessments":
      return assessments;
    case "executive-summaries":
      return executiveSummaries;
    default:
      return [];
  }
};

const getTabLabel = (tab: TabType): string => {
  switch (tab) {
    case "policy-reports": return "policy reports";
    case "procedure-reports": return "procedure reports";
    case "application-profiles": return "application profiles";
    case "strategy-docs": return "strategy documents";
    case "assessments": return "assessments";
    case "executive-summaries": return "executive summaries";
    default: return "templates";
  }
};

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("policy-reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
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

  const totalTemplates = Object.values(tabConfig).reduce((sum, tab) => sum + tab.count, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Marketplace Header */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-8 lg:py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/marketplaces" className="hover:text-gray-900">Marketplaces</Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-gray-900">Templates</span>
          </nav>

          {/* Phase Badge */}
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold uppercase inline-block mb-3">
            Design
          </span>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] mb-3">
            DTMP Templates
          </h1>

          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 px-4 py-2 rounded-full text-purple-700 font-semibold text-sm mb-3">
            <Sparkles size={18} className="text-purple-600" />
            <span>Powered by AI DocWriter 4.0</span>
          </div>

          {/* Description */}
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mb-4">
            Generate governance-compliant documents using AI-powered templates.
            Create policies, procedures, application profiles, strategy documents,
            assessments, and executive summaries with intelligent content generation,
            organizational context awareness, and automatic formatting.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <FileText size={18} />
              {totalTemplates}+ Templates
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

      {/* Tabs */}
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
                  <span className={`px-2 py-0.5 rounded-full text-xs ml-1 ${
                    activeTab === tab 
                      ? "bg-purple-100 text-purple-700" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {config.count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Filter Panel */}
          <FilterPanel
            filters={currentFilters}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={currentConfig.placeholder}
            />

            {/* Result Count */}
            <div className="px-4 lg:px-8 py-3 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{currentData.length}</span> {getTabLabel(activeTab)}
              </p>
            </div>

            {/* Tab Content */}
            {(Object.keys(tabConfig) as TabType[]).map((tab) => (
              <TabsContent key={tab} value={tab} className="flex-1 px-4 lg:px-8 py-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getDataForTab(tab).map((template) => (
                    <TemplateCard 
                      key={template.id} 
                      template={template as any} 
                      tab={tab} 
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>

      {/* Mobile Filter Button */}
      <MobileFilterButton onClick={() => setIsFilterOpen(true)} />

      <Footer />
    </div>
  );
}
