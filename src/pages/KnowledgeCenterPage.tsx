import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, BookOpen, Users, Award, Lightbulb, Quote, Map, Library, FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FilterPanel, MobileFilterButton } from "@/components/learningCenter/FilterPanel";
import { SearchBar } from "@/components/learningCenter/SearchBar";
import { BestPracticeCard } from "@/components/knowledgeCenter/BestPracticeCard";
import { TestimonialCard } from "@/components/knowledgeCenter/TestimonialCard";
import { PlaybookCard } from "@/components/knowledgeCenter/PlaybookCard";
import { LibraryItemCard } from "@/components/knowledgeCenter/LibraryItemCard";
import { bestPractices, bestPracticesFilters } from "@/data/knowledgeCenter/bestPractices";
import { testimonials, testimonialsFilters } from "@/data/knowledgeCenter/testimonials";
import { playbooks, playbooksFilters } from "@/data/knowledgeCenter/playbooks";
import { libraryItems, libraryFilters } from "@/data/knowledgeCenter/library";
import { policyReports, policyReportsFilters } from "@/data/knowledgeCenter/policyReports";
import { procedureReports, procedureReportsFilters } from "@/data/knowledgeCenter/procedureReports";
import { executiveSummaries, executiveSummariesFilters } from "@/data/knowledgeCenter/executiveSummaries";
import { strategyDocs, strategyDocsFilters } from "@/data/knowledgeCenter/strategyDocs";
import type { BestPractice } from "@/data/knowledgeCenter/bestPractices";
import type { Testimonial } from "@/data/knowledgeCenter/testimonials";
import type { Playbook } from "@/data/knowledgeCenter/playbooks";
import type { LibraryItem } from "@/data/knowledgeCenter/library";
import type { PolicyReport } from "@/data/knowledgeCenter/policyReports";
import type { ProcedureReport } from "@/data/knowledgeCenter/procedureReports";
import type { ExecutiveSummary } from "@/data/knowledgeCenter/executiveSummaries";
import type { StrategyDoc } from "@/data/knowledgeCenter/strategyDocs";
import { getKnowledgeItem } from "@/data/knowledgeCenter/knowledgeItems";
import {
  mapBestPracticeToDepartment,
  mapIndustryToDepartment,
} from "@/data/knowledgeCenter/departmentMapping";

type TabType =
  | "best-practices"
  | "testimonials"
  | "playbooks"
  | "library"
  | "policy-reports"
  | "procedure-reports"
  | "executive-summaries"
  | "strategy-docs";
type SortOption =
  | "most-relevant"
  | "newest"
  | "most-viewed"
  | "highest-rated";

const ITEMS_PER_PAGE = 9;

const normalize = (value: string) => value.trim().toLowerCase();

const parseMonthYear = (value: string): Date | null => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const matchesDateBucket = (value: string, bucket: string): boolean => {
  if (bucket === "All time") return true;

  const date = parseMonthYear(value);
  if (!date) return false;

  const now = new Date();
  const monthsDiff =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());

  if (bucket === "Last month") return monthsDiff <= 1;
  if (bucket === "Last 3 months") return monthsDiff <= 3;
  if (bucket === "Last 6 months") return monthsDiff <= 6;
  if (bucket === "Last year") return monthsDiff <= 12;

  return false;
};

const matchesLengthBucket = (value: string, bucket: string): boolean => {
  const normalizedValue = normalize(value);
  if (bucket === "Quick Read (<10 pages)") {
    return normalizedValue.includes("quick read");
  }
  if (bucket === "Medium (10-30 pages)") {
    return normalizedValue.includes("medium");
  }
  if (bucket === "Comprehensive (30+ pages)") {
    return normalizedValue.includes("comprehensive");
  }
  if (bucket === "Multi-part Series") {
    return normalizedValue.includes("series");
  }
  return false;
};

const includesQuery = (fields: Array<string | undefined>, query: string) => {
  if (!query) return true;
  const normalizedQuery = normalize(query);
  return fields.some((field) => normalize(field ?? "").includes(normalizedQuery));
};

const scoreRelevance = (
  fields: Array<string | undefined>,
  title: string,
  query: string
) => {
  if (!query.trim()) return 0;
  const normalizedQuery = normalize(query);
  const titleValue = normalize(title);
  const fullText = normalize(fields.join(" "));

  let score = 0;
  if (titleValue.includes(normalizedQuery)) score += 6;
  if (fullText.includes(normalizedQuery)) score += 2;
  if (titleValue.startsWith(normalizedQuery)) score += 2;
  return score;
};

const hashToMetric = (value: string, min: number, max: number) => {
  const hash = value
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return min + (hash % (max - min + 1));
};

const filterBestPractices = (
  items: BestPractice[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const canonical = getKnowledgeItem("best-practices", item.id);
    const matchesSearch = includesQuery(
      [
        canonical?.title ?? item.title,
        canonical?.description ?? item.summary,
        item.domain,
        item.category,
        item.maturityLevel,
        canonical?.department ?? mapBestPracticeToDepartment(item),
        canonical?.type ?? item.contentType,
        canonical?.tags.join(" ") ?? item.impactAreas.join(" "),
      ],
      query
    );

    if (!matchesSearch) return false;

    return Object.entries(filters).every(([group, selected]) => {
      if (!selected || selected.length === 0) return true;

      if (group === "domain") return selected.includes(item.domain);
      if (group === "category") return selected.includes(item.category);
      if (group === "maturityLevel") return selected.includes(item.maturityLevel);
      if (group === "implementationComplexity") return selected.includes(item.complexity);
      if (group === "departmentApplicability")
        return selected.includes(canonical?.department ?? mapBestPracticeToDepartment(item));
      if (group === "contentType") return selected.includes(item.contentType);
      if (group === "dateAdded")
        return selected.some((bucket) =>
          matchesDateBucket(canonical?.updatedAt ?? item.dateAdded, bucket)
        );

      return true;
    });
  });

const filterTestimonials = (
  items: Testimonial[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const canonical = getKnowledgeItem("testimonials", item.id);
    const matchesSearch = includesQuery(
      [
        canonical?.title ?? item.title,
        item.organization,
        canonical?.department ?? mapIndustryToDepartment(item.industry),
        canonical?.description ?? item.quote,
        canonical?.author ?? item.speaker.name,
        item.speaker.role,
        canonical?.tags.join(" ") ?? item.outcomes.join(" "),
      ],
      query
    );

    if (!matchesSearch) return false;

    return Object.entries(filters).every(([group, selected]) => {
      if (!selected || selected.length === 0) return true;

      if (group === "organizationType")
        return selected.includes(item.organizationType);
      if (group === "department")
        return selected.includes(canonical?.department ?? mapIndustryToDepartment(item.industry));
      if (group === "transformationPhase") {
        if (selected.includes("All Phases")) return true;
        return selected.includes(canonical?.phase ?? item.phase);
      }
      if (group === "outcomeType")
        return selected.some((outcome) => item.outcomeType.includes(outcome));
      if (group === "datePublished")
        return selected.some((bucket) =>
          matchesDateBucket(canonical?.updatedAt ?? item.date, bucket)
        );

      return true;
    });
  });

const filterPlaybooks = (
  items: Playbook[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const canonical = getKnowledgeItem("playbooks", item.id);
    const matchesSearch = includesQuery(
      [
        canonical?.title ?? item.title,
        canonical?.description ?? item.description,
        canonical?.department ?? mapIndustryToDepartment(item.industry),
        canonical?.type ?? item.type,
        item.scope,
        item.format,
        canonical?.author ?? item.contributor,
        canonical?.tags.join(" ") ?? item.topics.join(" "),
      ],
      query
    );

    if (!matchesSearch) return false;

    return Object.entries(filters).every(([group, selected]) => {
      if (!selected || selected.length === 0) return true;

      if (group === "department")
        return selected.includes(canonical?.department ?? mapIndustryToDepartment(item.industry));
      if (group === "playbookType") return selected.includes(item.type);
      if (group === "scope") return selected.includes(item.scope);
      if (group === "format") return selected.includes(item.format);
      if (group === "contributedBy") return selected.includes(item.contributor);

      return true;
    });
  });

const filterLibraryItems = (
  items: LibraryItem[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const canonical = getKnowledgeItem("library", item.id);
    const matchesSearch = includesQuery(
      [
        canonical?.title ?? item.title,
        canonical?.description ?? item.description,
        canonical?.type ?? item.contentType,
        item.format,
        canonical?.author ?? item.author,
        canonical?.difficulty ?? item.length,
        canonical?.updatedAt ?? item.datePublished,
        canonical?.audience ?? item.audience,
        canonical?.tags.join(" ") ?? item.topics.join(" "),
      ],
      query
    );

    if (!matchesSearch) return false;

    return Object.entries(filters).every(([group, selected]) => {
      if (!selected || selected.length === 0) return true;

      if (group === "contentType") return selected.includes(item.contentType);
      if (group === "topic")
        return selected.some((topic) => item.topics.includes(topic));
      if (group === "format") return selected.includes(item.format);
      if (group === "audience") return selected.includes(item.audience);
      if (group === "length")
        return selected.some((bucket) => matchesLengthBucket(item.length, bucket));
      if (group === "datePublished")
        return selected.some((bucket) =>
          matchesDateBucket(canonical?.updatedAt ?? item.datePublished, bucket)
        );

      return true;
    });
  });

const matchesSelected = (
  selected: string[],
  value: string | boolean | string[] | undefined
) => {
  if (!selected || selected.length === 0) return true;
  if (typeof value === "boolean") {
    return selected.includes(value ? "Yes" : "No");
  }
  if (Array.isArray(value)) {
    return selected.some((entry) => value.includes(entry));
  }
  if (typeof value === "string") {
    return selected.includes(value);
  }
  return false;
};

const filterPolicyReports = (
  items: PolicyReport[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const matchesSearch = includesQuery(
      [item.title, item.description, item.category, item.policyType, item.compliance ?? "", item.aiGeneration, item.specialFeature],
      query
    );
    if (!matchesSearch) return false;
    return Object.entries(filters).every(([group, selected]) => {
      if (group === "policyDomain") return matchesSelected(selected, item.category);
      if (group === "policyType") return matchesSelected(selected, item.policyType);
      if (group === "complianceFramework") return matchesSelected(selected, item.compliance ?? "None");
      if (group === "outputFormat") return matchesSelected(selected, item.outputFormats);
      if (group === "complexity") return matchesSelected(selected, item.complexity);
      if (group === "pageLength") return matchesSelected(selected, item.pageLength);
      if (group === "aiGeneration") return matchesSelected(selected, item.aiGeneration);
      return true;
    });
  });

const filterProcedureReports = (
  items: ProcedureReport[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const matchesSearch = includesQuery(
      [item.title, item.description, item.category, item.procedureType, item.aiGeneration, item.specialFeature],
      query
    );
    if (!matchesSearch) return false;
    return Object.entries(filters).every(([group, selected]) => {
      if (group === "processArea") return matchesSelected(selected, item.category);
      if (group === "procedureType") return matchesSelected(selected, item.procedureType);
      if (group === "audienceLevel") return true;
      if (group === "outputFormat") return matchesSelected(selected, item.outputFormats);
      if (group === "includesFlowchart") return matchesSelected(selected, item.includesFlowchart);
      if (group === "complexity") return matchesSelected(selected, item.complexity);
      if (group === "aiGeneration") return matchesSelected(selected, item.aiGeneration);
      return true;
    });
  });

const filterExecutiveSummaries = (
  items: ExecutiveSummary[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const matchesSearch = includesQuery(
      [item.title, item.description, item.category, item.summaryType, item.audience, item.format, item.aiGeneration, item.specialFeature],
      query
    );
    if (!matchesSearch) return false;
    return Object.entries(filters).every(([group, selected]) => {
      if (group === "summaryType") return matchesSelected(selected, item.summaryType);
      if (group === "audience") return matchesSelected(selected, item.audience);
      if (group === "format") return matchesSelected(selected, item.format);
      if (group === "outputFormat") return matchesSelected(selected, item.outputFormats);
      if (group === "includesMetrics") return matchesSelected(selected, item.includesMetrics);
      if (group === "includesVisualizations") return matchesSelected(selected, item.includesVisualizations);
      if (group === "aiGeneration") return matchesSelected(selected, item.aiGeneration);
      return true;
    });
  });

const filterStrategyDocs = (
  items: StrategyDoc[],
  query: string,
  filters: Record<string, string[]>
) =>
  items.filter((item) => {
    const matchesSearch = includesQuery(
      [item.title, item.description, item.category, item.strategyType, item.timeHorizon, item.scopeLevel, item.aiGeneration, item.specialFeature],
      query
    );
    if (!matchesSearch) return false;
    return Object.entries(filters).every(([group, selected]) => {
      if (group === "strategyType") return matchesSelected(selected, item.strategyType);
      if (group === "timeHorizon") return matchesSelected(selected, item.timeHorizon);
      if (group === "scopeLevel") return matchesSelected(selected, item.scopeLevel);
      if (group === "outputFormat") return matchesSelected(selected, item.outputFormats);
      if (group === "includesFinancials") return matchesSelected(selected, item.includesFinancials);
      if (group === "includesRoadmap") return matchesSelected(selected, item.includesRoadmap);
      if (group === "aiGeneration") return matchesSelected(selected, item.aiGeneration);
      return true;
    });
  });

const tabPlaceholders: Record<TabType, string> = {
  "best-practices": "Search best practices, patterns, or topics...",
  testimonials: "Search testimonials, organizations, or outcomes...",
  playbooks: "Search playbooks, departments, or use cases...",
  library: "Search documents, topics, or authors...",
  "policy-reports": "Search policy reports...",
  "procedure-reports": "Search procedure reports...",
  "executive-summaries": "Search executive summaries...",
  "strategy-docs": "Search strategy docs...",
};

const tabIcons: Record<TabType, React.ElementType> = {
  "best-practices": Lightbulb,
  testimonials: Quote,
  playbooks: Map,
  library: Library,
  "policy-reports": FileText,
  "procedure-reports": FileText,
  "executive-summaries": FileText,
  "strategy-docs": FileText,
};

const defaultSortByTab: Record<TabType, SortOption> = {
  "best-practices": "most-relevant",
  testimonials: "most-relevant",
  playbooks: "most-relevant",
  library: "most-relevant",
  "policy-reports": "most-relevant",
  "procedure-reports": "most-relevant",
  "executive-summaries": "most-relevant",
  "strategy-docs": "most-relevant",
};

export default function KnowledgeCenterPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabType) || "best-practices";
  
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<SortOption>(defaultSortByTab[initialTab]);
  const [currentPage, setCurrentPage] = useState(1);
  const totalResourceCount =
    bestPractices.length +
    testimonials.length +
    playbooks.length +
    libraryItems.length +
    policyReports.length +
    procedureReports.length +
    executiveSummaries.length +
    strategyDocs.length;

  const handleTabChange = (value: string) => {
    const tab = value as TabType;
    setActiveTab(tab);
    setSearchParams({ tab });
    setSelectedFilters({});
    setSortBy(defaultSortByTab[tab]);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (group: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: updated };
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setCurrentPage(1);
  };

  const getCurrentFilters = () => {
    switch (activeTab) {
      case "best-practices":
        return bestPracticesFilters;
      case "testimonials":
        return testimonialsFilters;
      case "playbooks":
        return playbooksFilters;
      case "library":
        return libraryFilters;
      case "policy-reports":
        return policyReportsFilters;
      case "procedure-reports":
        return procedureReportsFilters;
      case "executive-summaries":
        return executiveSummariesFilters;
      case "strategy-docs":
        return strategyDocsFilters;
      default:
        return {};
    }
  };

  const filteredBestPractices = useMemo(
    () => filterBestPractices(bestPractices, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );
  const filteredTestimonials = useMemo(
    () => filterTestimonials(testimonials, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );
  const filteredPlaybooks = useMemo(
    () => filterPlaybooks(playbooks, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );
  const filteredLibraryItems = useMemo(
    () => filterLibraryItems(libraryItems, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );
  const filteredPolicyReports = useMemo(
    () => filterPolicyReports(policyReports, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );
  const filteredProcedureReports = useMemo(
    () => filterProcedureReports(procedureReports, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );
  const filteredExecutiveSummaries = useMemo(
    () => filterExecutiveSummaries(executiveSummaries, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );
  const filteredStrategyDocs = useMemo(
    () => filterStrategyDocs(strategyDocs, searchQuery, selectedFilters),
    [searchQuery, selectedFilters]
  );

  const sortedBestPractices = useMemo(() => {
    const list = [...filteredBestPractices];
    if (sortBy === "newest") {
      return list.sort((a, b) => {
        const aMeta = getKnowledgeItem("best-practices", a.id);
        const bMeta = getKnowledgeItem("best-practices", b.id);
        return (
          (parseMonthYear(bMeta?.updatedAt ?? b.dateAdded)?.getTime() ?? 0) -
          (parseMonthYear(aMeta?.updatedAt ?? a.dateAdded)?.getTime() ?? 0)
        );
      });
    }
    if (sortBy === "most-viewed") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 100, 5000) - hashToMetric(a.id, 100, 5000)
      );
    }
    if (sortBy === "highest-rated") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 35, 50) - hashToMetric(a.id, 35, 50)
      );
    }
    return list.sort((a, b) => {
      const aMeta = getKnowledgeItem("best-practices", a.id);
      const bMeta = getKnowledgeItem("best-practices", b.id);
      const aScore = scoreRelevance(
        [
          aMeta?.title ?? a.title,
          aMeta?.description ?? a.summary,
          aMeta?.department ?? mapBestPracticeToDepartment(a),
          aMeta?.type ?? a.contentType,
          aMeta?.tags.join(" ") ?? a.impactAreas.join(" "),
        ],
        aMeta?.title ?? a.title,
        searchQuery
      );
      const bScore = scoreRelevance(
        [
          bMeta?.title ?? b.title,
          bMeta?.description ?? b.summary,
          bMeta?.department ?? mapBestPracticeToDepartment(b),
          bMeta?.type ?? b.contentType,
          bMeta?.tags.join(" ") ?? b.impactAreas.join(" "),
        ],
        bMeta?.title ?? b.title,
        searchQuery
      );
      return bScore - aScore;
    });
  }, [filteredBestPractices, sortBy, searchQuery]);

  const sortedTestimonials = useMemo(() => {
    const list = [...filteredTestimonials];
    if (sortBy === "newest") {
      return list.sort((a, b) => {
        const aMeta = getKnowledgeItem("testimonials", a.id);
        const bMeta = getKnowledgeItem("testimonials", b.id);
        return (
          (parseMonthYear(bMeta?.updatedAt ?? b.date)?.getTime() ?? 0) -
          (parseMonthYear(aMeta?.updatedAt ?? a.date)?.getTime() ?? 0)
        );
      });
    }
    if (sortBy === "most-viewed") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 100, 5000) - hashToMetric(a.id, 100, 5000)
      );
    }
    if (sortBy === "highest-rated") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 35, 50) - hashToMetric(a.id, 35, 50)
      );
    }
    return list.sort((a, b) => {
      const aMeta = getKnowledgeItem("testimonials", a.id);
      const bMeta = getKnowledgeItem("testimonials", b.id);
      const aScore = scoreRelevance(
        [
          aMeta?.title ?? a.title,
          a.organization,
          aMeta?.description ?? a.quote,
          aMeta?.author ?? a.speaker.name,
          aMeta?.tags.join(" ") ?? a.outcomes.join(" "),
        ],
        aMeta?.title ?? a.title,
        searchQuery
      );
      const bScore = scoreRelevance(
        [
          bMeta?.title ?? b.title,
          b.organization,
          bMeta?.description ?? b.quote,
          bMeta?.author ?? b.speaker.name,
          bMeta?.tags.join(" ") ?? b.outcomes.join(" "),
        ],
        bMeta?.title ?? b.title,
        searchQuery
      );
      return bScore - aScore;
    });
  }, [filteredTestimonials, sortBy, searchQuery]);

  const sortedPlaybooks = useMemo(() => {
    const list = [...filteredPlaybooks];
    if (sortBy === "newest") {
      return list.sort((a, b) => {
        const aMeta = getKnowledgeItem("playbooks", a.id);
        const bMeta = getKnowledgeItem("playbooks", b.id);
        return (
          (parseMonthYear(bMeta?.updatedAt ?? b.id)?.getTime() ?? 0) -
          (parseMonthYear(aMeta?.updatedAt ?? a.id)?.getTime() ?? 0)
        );
      });
    }
    if (sortBy === "most-viewed") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 100, 5000) - hashToMetric(a.id, 100, 5000)
      );
    }
    if (sortBy === "highest-rated") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 35, 50) - hashToMetric(a.id, 35, 50)
      );
    }
    return list.sort((a, b) => {
      const aMeta = getKnowledgeItem("playbooks", a.id);
      const bMeta = getKnowledgeItem("playbooks", b.id);
      const aScore = scoreRelevance(
        [
          aMeta?.title ?? a.title,
          aMeta?.description ?? a.description,
          aMeta?.department ?? mapIndustryToDepartment(a.industry),
          aMeta?.type ?? a.type,
          aMeta?.tags.join(" ") ?? a.topics.join(" "),
        ],
        aMeta?.title ?? a.title,
        searchQuery
      );
      const bScore = scoreRelevance(
        [
          bMeta?.title ?? b.title,
          bMeta?.description ?? b.description,
          bMeta?.department ?? mapIndustryToDepartment(b.industry),
          bMeta?.type ?? b.type,
          bMeta?.tags.join(" ") ?? b.topics.join(" "),
        ],
        bMeta?.title ?? b.title,
        searchQuery
      );
      return bScore - aScore;
    });
  }, [filteredPlaybooks, sortBy, searchQuery]);

  const sortedLibraryItems = useMemo(() => {
    const list = [...filteredLibraryItems];
    if (sortBy === "newest") {
      return list.sort((a, b) => {
        const aMeta = getKnowledgeItem("library", a.id);
        const bMeta = getKnowledgeItem("library", b.id);
        return (
          (parseMonthYear(bMeta?.updatedAt ?? b.datePublished)?.getTime() ?? 0) -
          (parseMonthYear(aMeta?.updatedAt ?? a.datePublished)?.getTime() ?? 0)
        );
      });
    }
    if (sortBy === "most-viewed") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 100, 5000) - hashToMetric(a.id, 100, 5000)
      );
    }
    if (sortBy === "highest-rated") {
      return list.sort(
        (a, b) => hashToMetric(b.id, 35, 50) - hashToMetric(a.id, 35, 50)
      );
    }
    return list.sort((a, b) => {
      const aMeta = getKnowledgeItem("library", a.id);
      const bMeta = getKnowledgeItem("library", b.id);
      const aScore = scoreRelevance(
        [
          aMeta?.title ?? a.title,
          aMeta?.description ?? a.description,
          aMeta?.type ?? a.contentType,
          aMeta?.author ?? a.author,
          aMeta?.tags.join(" ") ?? a.topics.join(" "),
        ],
        aMeta?.title ?? a.title,
        searchQuery
      );
      const bScore = scoreRelevance(
        [
          bMeta?.title ?? b.title,
          bMeta?.description ?? b.description,
          bMeta?.type ?? b.contentType,
          bMeta?.author ?? b.author,
          bMeta?.tags.join(" ") ?? b.topics.join(" "),
        ],
        bMeta?.title ?? b.title,
        searchQuery
      );
      return bScore - aScore;
    });
  }, [filteredLibraryItems, sortBy, searchQuery]);

  const sortedPolicyReports = useMemo(() => [...filteredPolicyReports], [filteredPolicyReports]);
  const sortedProcedureReports = useMemo(() => [...filteredProcedureReports], [filteredProcedureReports]);
  const sortedExecutiveSummaries = useMemo(
    () => [...filteredExecutiveSummaries],
    [filteredExecutiveSummaries]
  );
  const sortedStrategyDocs = useMemo(() => [...filteredStrategyDocs], [filteredStrategyDocs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedFilters, sortBy]);

  const activeSortedItemsCount = (() => {
    switch (activeTab) {
      case "best-practices":
        return sortedBestPractices.length;
      case "testimonials":
        return sortedTestimonials.length;
      case "playbooks":
        return sortedPlaybooks.length;
      case "library":
        return sortedLibraryItems.length;
      case "policy-reports":
        return sortedPolicyReports.length;
      case "procedure-reports":
        return sortedProcedureReports.length;
      case "executive-summaries":
        return sortedExecutiveSummaries.length;
      case "strategy-docs":
        return sortedStrategyDocs.length;
      default:
        return 0;
    }
  })();

  const totalPages = Math.max(1, Math.ceil(activeSortedItemsCount / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pagedBestPractices = useMemo(
    () =>
      sortedBestPractices.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
      ),
    [sortedBestPractices, safePage]
  );
  const pagedTestimonials = useMemo(
    () =>
      sortedTestimonials.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
      ),
    [sortedTestimonials, safePage]
  );
  const pagedPlaybooks = useMemo(
    () =>
      sortedPlaybooks.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
      ),
    [sortedPlaybooks, safePage]
  );
  const pagedLibraryItems = useMemo(
    () =>
      sortedLibraryItems.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
      ),
    [sortedLibraryItems, safePage]
  );
  const pagedPolicyReports = useMemo(
    () => sortedPolicyReports.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [sortedPolicyReports, safePage]
  );
  const pagedProcedureReports = useMemo(
    () => sortedProcedureReports.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [sortedProcedureReports, safePage]
  );
  const pagedExecutiveSummaries = useMemo(
    () => sortedExecutiveSummaries.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [sortedExecutiveSummaries, safePage]
  );
  const pagedStrategyDocs = useMemo(
    () => sortedStrategyDocs.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE),
    [sortedStrategyDocs, safePage]
  );

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "most-relevant", label: "Most Relevant" },
    { value: "newest", label: "Newest" },
    { value: "most-viewed", label: "Most Viewed" },
    { value: "highest-rated", label: "Highest Rated" },
  ];

  const getResultCount = () => {
    switch (activeTab) {
      case "best-practices":
        return sortedBestPractices.length;
      case "testimonials":
        return sortedTestimonials.length;
      case "playbooks":
        return sortedPlaybooks.length;
      case "library":
        return sortedLibraryItems.length;
      case "policy-reports":
        return sortedPolicyReports.length;
      case "procedure-reports":
        return sortedProcedureReports.length;
      case "executive-summaries":
        return sortedExecutiveSummaries.length;
      case "strategy-docs":
        return sortedStrategyDocs.length;
      default:
        return 0;
    }
  };

  const getResultLabel = () => {
    switch (activeTab) {
      case "best-practices":
        return "best practices";
      case "testimonials":
        return "testimonials";
      case "playbooks":
        return "playbooks";
      case "library":
        return "library items";
      case "policy-reports":
        return "policy reports";
      case "procedure-reports":
        return "procedure reports";
      case "executive-summaries":
        return "executive summaries";
      case "strategy-docs":
        return "strategy docs";
      default:
        return "items";
    }
  };

  const toLibraryCardItem = (
    item: PolicyReport | ProcedureReport | ExecutiveSummary | StrategyDoc
  ): LibraryItem => ({
    id: item.id,
    title: item.title,
    description: item.description,
    contentType: item.category,
    format: item.outputFormats[0] ?? "PDF",
    typeIcon: "FileText",
    author: "Transformation Office",
    length: item.pageLength,
    datePublished: "2024",
    topics: [item.category, item.aiGeneration, item.specialFeature],
    audience: "All Roles",
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Marketplace Header */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">Knowledge Center</span>
          </nav>

          {/* Phase Badge */}
          <span className="inline-block bg-phase-discern-bg text-phase-discern px-3 py-1 rounded-full text-xs font-semibold uppercase mb-3">
            Discern
          </span>

          {/* Title & Description */}
          <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">
            DTMP Knowledge Center
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mb-4">
            Access proven practices, real-world transformation examples, and expert insights. 
            Leverage industry playbooks, best practices, testimonials, and comprehensive 
            reference materials to accelerate your digital transformation journey.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {totalResourceCount} Total Resources
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Enterprise-wide Access
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Expert-Validated Content
            </span>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-2 overflow-x-auto flex justify-start px-4 lg:px-8">
              {([
                "best-practices",
                "testimonials",
                "playbooks",
                "library",
                "policy-reports",
                "procedure-reports",
                "executive-summaries",
                "strategy-docs",
              ] as TabType[]).map((tab) => {
                const Icon = tabIcons[tab];
                const counts = {
                  "best-practices": filteredBestPractices.length,
                  testimonials: filteredTestimonials.length,
                  playbooks: filteredPlaybooks.length,
                  library: filteredLibraryItems.length,
                  "policy-reports": filteredPolicyReports.length,
                  "procedure-reports": filteredProcedureReports.length,
                  "executive-summaries": filteredExecutiveSummaries.length,
                  "strategy-docs": filteredStrategyDocs.length,
                };
                const labels = {
                  "best-practices": "Best Practices",
                  testimonials: "Testimonials",
                  playbooks: "Industry Playbooks",
                  library: "Library",
                  "policy-reports": "Policy Reports",
                  "procedure-reports": "Procedure Reports",
                  "executive-summaries": "Executive Summaries",
                  "strategy-docs": "Strategy Docs",
                };
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex items-center gap-2 px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
                  >
                    <Icon className="w-4 h-4" />
                    {labels[tab]}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>
                      {counts[tab]}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={tabPlaceholders[activeTab]}
        />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto flex">
          {/* Filter Panel */}
          <FilterPanel
            filters={getCurrentFilters()}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
          />

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Result Count + Sort */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 lg:px-8 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{getResultCount()}</span> {getResultLabel()}
              </p>
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-sm text-foreground"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Cards Grid */}
            <div className="px-4 lg:px-8 py-6">
              <TabsContent value="best-practices" className="mt-0">
                {sortedBestPractices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedBestPractices.map((practice) => (
                      <BestPracticeCard
                        key={practice.id}
                        practice={practice}
                        onClick={() => navigate(`/marketplaces/knowledge-center/best-practices/${practice.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No best practices match your search/filters.</p>
                )}
              </TabsContent>

              <TabsContent value="testimonials" className="mt-0">
                {sortedTestimonials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedTestimonials.map((testimonial) => (
                      <TestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                        onClick={() => navigate(`/marketplaces/knowledge-center/testimonials/${testimonial.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No testimonials match your search/filters.</p>
                )}
              </TabsContent>

              <TabsContent value="playbooks" className="mt-0">
                {sortedPlaybooks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedPlaybooks.map((playbook) => (
                      <PlaybookCard
                        key={playbook.id}
                        playbook={playbook}
                        onClick={() => navigate(`/marketplaces/knowledge-center/playbooks/${playbook.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No playbooks match your search/filters.</p>
                )}
              </TabsContent>

              <TabsContent value="library" className="mt-0">
                {sortedLibraryItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedLibraryItems.map((item) => (
                      <LibraryItemCard
                        key={item.id}
                        item={item}
                        onClick={() => navigate(`/marketplaces/knowledge-center/library/${item.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No library items match your search/filters.</p>
                )}
              </TabsContent>

              <TabsContent value="policy-reports" className="mt-0">
                {sortedPolicyReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedPolicyReports.map((item) => (
                      <LibraryItemCard
                        key={item.id}
                        item={toLibraryCardItem(item)}
                        showAccessIcon={false}
                        showAccessLabel={false}
                        onClick={() =>
                          navigate(`/marketplaces/knowledge-center/policy-reports/${item.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No policy reports match your search/filters.</p>
                )}
              </TabsContent>

              <TabsContent value="procedure-reports" className="mt-0">
                {sortedProcedureReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedProcedureReports.map((item) => (
                      <LibraryItemCard
                        key={item.id}
                        item={toLibraryCardItem(item)}
                        showAccessIcon={false}
                        showAccessLabel={false}
                        onClick={() =>
                          navigate(`/marketplaces/knowledge-center/procedure-reports/${item.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No procedure reports match your search/filters.</p>
                )}
              </TabsContent>

              <TabsContent value="executive-summaries" className="mt-0">
                {sortedExecutiveSummaries.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedExecutiveSummaries.map((item) => (
                      <LibraryItemCard
                        key={item.id}
                        item={toLibraryCardItem(item)}
                        showAccessIcon={false}
                        showAccessLabel={false}
                        onClick={() =>
                          navigate(`/marketplaces/knowledge-center/executive-summaries/${item.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No executive summaries match your search/filters.</p>
                )}
              </TabsContent>

              <TabsContent value="strategy-docs" className="mt-0">
                {sortedStrategyDocs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {pagedStrategyDocs.map((item) => (
                      <LibraryItemCard
                        key={item.id}
                        item={toLibraryCardItem(item)}
                        showAccessIcon={false}
                        showAccessLabel={false}
                        onClick={() =>
                          navigate(`/marketplaces/knowledge-center/strategy-docs/${item.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No strategy docs match your search/filters.</p>
                )}
              </TabsContent>

              {getResultCount() > 0 && (
                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Page {safePage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={safePage === 1}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={safePage === totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tabs>

      {/* Mobile Filter Button */}
      <MobileFilterButton onClick={() => setFilterOpen(true)} />

      <Footer />
    </div>
  );
}
