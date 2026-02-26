import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft,
  LayoutGrid,
  Settings,
  Home,
  BarChart3,
  FileText,
  PenTool,
  Rocket,
  RefreshCw,
  Briefcase,
  Brain,
  Headphones,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Activity,
  Shield,
  Cloud,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Award,
  Hammer,
  Code,
  Ticket,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { applicationPortfolio } from "@/data/portfolio";
import { enrolledCourses } from "@/data/learning";
import { learningTracks, trackEnrollments } from "@/data/learningCenter";
import {
  buildTrackProgressSnapshots,
  type TrackProgressSnapshot,
} from "@/data/learningCenter/trackProgress";
import { buildPathCertificateState } from "@/data/learningCenter/pathCertificates";
import {
  buildTrackAnalytics,
  findTrackByStage2CourseId,
} from "@/data/learningCenter/trackAnalytics";
import { buildTrackMilestoneNotifications } from "@/data/learningCenter/trackNotifications";
import { adminCourseData, userCourseData } from "@/data/learningCenter/stage2";
import {
  buildUserProgressionData,
  completeLessonAndRecalculate,
  submitQuizAttemptAndRecalculate,
} from "@/data/learningCenter/stage2/progressionEngine";
import { knowledgeItems } from "@/data/knowledgeCenter/knowledgeItems";
import {
  getContinueReading,
  getKnowledgeHistory,
  getSavedKnowledgeIds,
  toggleSavedKnowledgeItem,
  type KnowledgeHistoryEntry,
} from "@/data/knowledgeCenter/userKnowledgeState";
import {
  getMentionNotifications,
  markMentionNotificationRead,
  type MentionNotification,
} from "@/data/knowledgeCenter/collaborationState";
import {
  getTORequests,
  updateTORequestStatus,
  type TORequest,
  type TORequestStatus,
} from "@/data/knowledgeCenter/requestState";
import { getKnowledgeUsageMetrics } from "@/data/knowledgeCenter/analyticsState";
import {
  KnowledgeWorkspaceMain,
  KnowledgeWorkspaceSidebar,
  isKnowledgeWorkspaceTab,
  type KnowledgeWorkspaceTab,
} from "@/components/stage2/knowledge/KnowledgeWorkspacePanels";
import {
  LearningWorkspaceMain,
  LearningWorkspaceSidebar,
} from "@/components/stage2/learning/LearningWorkspacePanels";
import {
  PortfolioWorkspaceMain,
  PortfolioWorkspaceSidebar,
} from "@/components/stage2/portfolio/PortfolioWorkspacePanels";
import { CourseDetailView } from "@/components/learning";
import LifecycleOverview from "./lifecycle/LifecycleOverview";
import TemplatesLibrary from "./lifecycle/TemplatesLibrary";
import ApprovalsPage from "./lifecycle/ApprovalsPage";
import ProjectsPage from "./lifecycle/ProjectsPage";
import ApplicationsPage from "./lifecycle/ApplicationsPage";
import { solutionBuilds } from "@/data/blueprints/solutionBuilds";
import type { SolutionType } from "@/data/blueprints/solutionSpecs";
import { intelligenceServices } from "@/data/digitalIntelligence/stage2";
import {
  IntelligenceOverviewPage,
  IntelligenceServicesPage,
  MyDashboardsPage,
  MyRequestsPage as IntelligenceMyRequestsPage,
  RequestDetailPage as IntelligenceRequestDetailPage,
  ServiceDashboardPage,
} from "@/pages/stage2/intelligence";
import { supportTickets, serviceRequests, knowledgeArticles, ServiceRequest } from "@/data/supportData";
import { technicalSupport, expertConsultancy } from "@/data/supportServices";
import { getSupportServiceDetail } from "@/data/supportServices/detailsSupport";
import { PriorityBadge, SLATimer } from "@/components/stage2";
import { Tag, Calendar, Clock as ClockIcon, Eye } from "lucide-react";
import { createStage3Request } from "@/data/stage3";
import TemplatesOverview from "@/pages/stage2/templates/TemplatesOverview";
import TemplateLibraryPage from "@/pages/stage2/templates/TemplateLibraryPage";
import TemplateDetailPage from "@/pages/stage2/templates/TemplateDetailPage";
import NewRequestPage from "@/pages/stage2/templates/NewRequestPage";
import MyRequestsPage from "@/pages/stage2/templates/MyRequestsPage";
import TemplatesRequestDetailPage from "@/pages/stage2/templates/RequestDetailPage";
import SolutionSpecsOverview from "@/pages/stage2/specs/SolutionSpecsOverview";
import ArchitectureLibraryPage from "@/pages/stage2/specs/ArchitectureLibraryPage";
import BlueprintDetailPage from "@/pages/stage2/specs/BlueprintDetailPage";
import DesignTemplatesPage from "@/pages/stage2/specs/DesignTemplatesPage";
import SpecTemplateDetailPage from "@/pages/stage2/specs/TemplateDetailPage";
import DesignPatternsPage from "@/pages/stage2/specs/DesignPatternsPage";
import PatternDetailPage from "@/pages/stage2/specs/PatternDetailPage";
import MyDesignsPage from "@/pages/stage2/specs/MyDesignsPage";
import DesignDetailPage from "@/pages/stage2/specs/DesignDetailPage";

interface LocationState {
  marketplace?: string;
  tab?: string;
  cardId?: string;
  serviceName?: string;
  action?: string;
  learningRole?: "learner" | "admin";
}
const EMPTY_LOCATION_STATE: LocationState = {};

type EnrolledCourse = (typeof enrolledCourses)[number];
type LearningUserTab = "overview" | "modules" | "progress" | "resources" | "certificate";
type LearningAdminTab = "overview" | "enrollments" | "performance" | "content" | "settings";
type TemplatesWorkspaceTab = "overview" | "library" | "new-request" | "my-requests";
type SpecsWorkspaceTab = "overview" | "blueprints" | "templates" | "patterns" | "my-designs";
type IntelligenceWorkspaceTab = "overview" | "services" | "my-dashboards" | "requests";

const getSeedFromCourseId = (courseId: string) =>
  courseId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

const buildAdminDataForCourse = (course: EnrolledCourse | undefined) => {
  if (!course) return adminCourseData;

  const cloned = JSON.parse(JSON.stringify(adminCourseData)) as typeof adminCourseData;
  const seed = getSeedFromCourseId(course.id);

  const totalEnrollments = Math.max(300, course.enrolledCount + (seed % 6) * 37);
  const completedPercentage = Math.min(
    82,
    Math.max(18, Math.round(course.progress * 0.55 + 12 + (seed % 7)))
  );
  const inProgressPercentage = Math.max(10, Math.min(75, 92 - completedPercentage));
  const completedCount = Math.round((totalEnrollments * completedPercentage) / 100);
  const inProgressCount = Math.round((totalEnrollments * inProgressPercentage) / 100);

  cloned.courseId = course.id;
  cloned.courseTitle = course.courseName;
  cloned.stats.totalEnrollments = totalEnrollments;
  cloned.stats.completedCount = completedCount;
  cloned.stats.completedPercentage = completedPercentage;
  cloned.stats.inProgressCount = inProgressCount;
  cloned.stats.inProgressPercentage = inProgressPercentage;
  cloned.stats.averageRating = course.rating;

  const monthlyBase = Math.round(totalEnrollments / 12);
  cloned.enrollmentTrends = cloned.enrollmentTrends.map((row, index) => {
    const enrollments = monthlyBase + index * 11 + ((seed + index * 3) % 20);
    const completions = Math.round(enrollments * (0.35 + ((seed + index) % 18) / 100));
    return { ...row, enrollments, completions };
  });

  cloned.completionFunnel = [
    { stage: "Enrolled", count: totalEnrollments, percentage: 100 },
    {
      stage: "Started Module 1",
      count: Math.round(totalEnrollments * 0.93),
      percentage: 93,
    },
    {
      stage: "Completed Module 3",
      count: Math.round(totalEnrollments * 0.68),
      percentage: 68,
    },
    {
      stage: "Reached Module 6",
      count: inProgressCount,
      percentage: inProgressPercentage,
    },
    {
      stage: "Completed Course",
      count: completedCount,
      percentage: completedPercentage,
    },
    {
      stage: "Downloaded Cert",
      count: Math.round(completedCount * 0.82),
      percentage: Math.round(completedPercentage * 0.82),
    },
  ];

  cloned.recentActivitySummary.newEnrollments = Math.round(monthlyBase * 0.42);
  cloned.recentActivitySummary.earnedCertificates = Math.round(completedCount * 0.01);
  cloned.recentActivitySummary.avgQuizScore = Math.max(
    70,
    Math.min(98, Math.round(course.stats.averageQuizScore || 82))
  );

  cloned.activityFeed = [
    {
      id: "af-1",
      message: `${cloned.recentActivitySummary.newEnrollments} new enrollments`,
      timestamp: "Today",
    },
    {
      id: "af-2",
      message: `${Math.round(inProgressCount * 0.02)} learners completed a module`,
      timestamp: "Today",
    },
    {
      id: "af-3",
      message: `${cloned.recentActivitySummary.earnedCertificates} certificates issued`,
      timestamp: "Today",
    },
    {
      id: "af-4",
      message: `Avg quiz score: ${cloned.recentActivitySummary.avgQuizScore}%`,
      timestamp: "Today",
    },
  ];

  return cloned;
};

const buildUserDataForCourse = (course: EnrolledCourse | undefined) => {
  if (!course) return userCourseData;

  const cloned = JSON.parse(JSON.stringify(userCourseData)) as typeof userCourseData;
  const seed = getSeedFromCourseId(course.id);
  const totalModules = Math.max(4, Math.min(10, course.stats.totalModules || 6));
  const completedModules = Math.min(
    totalModules,
    Math.round((course.progress / 100) * totalModules)
  );
  const remainingModules = Math.max(0, totalModules - completedModules);

  cloned.courseId = course.id;
  cloned.courseTitle = course.courseName;
  cloned.instructorName = course.instructor;
  cloned.overallProgress = course.progress;
  cloned.completedModules = completedModules;
  cloned.totalModules = totalModules;
  cloned.stats = {
    ...cloned.stats,
    totalModules,
    completedModules,
    progress: course.progress,
    timeLeft: remainingModules > 0 ? `${remainingModules} week${remainingModules > 1 ? "s" : ""}` : "Completed",
  };
  cloned.totalTimeSpent = course.stats.timeInvested;
  cloned.estimatedTimeRemaining = remainingModules > 0 ? `${Math.max(1, remainingModules * 2)}h 00m` : "0h 00m";

  cloned.modules = cloned.modules.slice(0, totalModules).map((module, index) => {
    const moduleNumber = index + 1;
    if (moduleNumber <= completedModules) {
      return {
        ...module,
        number: moduleNumber,
        status: "completed",
        progress: 100,
        quizScore: Math.min(98, Math.max(75, (course.stats.averageQuizScore || 82) + ((seed + index) % 7))),
      };
    }

    if (moduleNumber === completedModules + 1 && completedModules < totalModules) {
      return {
        ...module,
        number: moduleNumber,
        status: "in-progress",
        progress: Math.max(15, course.progress % 100),
      };
    }

    return {
      ...module,
      number: moduleNumber,
      status: "locked",
      progress: 0,
    };
  });

  cloned.quizResults = cloned.modules.map((module) => {
    if (module.status === "completed") {
      return {
        moduleId: module.id,
        moduleName: `Module ${module.number} Assessment`,
        score: module.quizScore ?? Math.max(70, (course.stats.averageQuizScore || 82) - 3),
        attempts: 1 + ((seed + module.number) % 2),
        status: "passed" as const,
      };
    }

    return {
      moduleId: module.id,
      moduleName: `Module ${module.number} Assessment`,
      score: null,
      attempts: 0,
      status: module.status === "in-progress" ? ("pending" as const) : ("locked" as const),
    };
  });

  cloned.certificateRequirements = cloned.certificateRequirements.map((req, index) => {
    if (index === 0) {
      const met = completedModules === totalModules;
      return { ...req, met, detail: `${completedModules}/${totalModules} completed` };
    }
    if (index === 1) {
      const passed = cloned.quizResults.filter((q) => q.status === "passed").length;
      const met = passed === totalModules;
      return { ...req, met, detail: `${passed}/${totalModules} passed` };
    }
    return req;
  });

  return cloned;
};

export default function Stage2AppPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    courseId: routeCourseId,
    view: routeView,
    tab: routeKnowledgeTab,
    templateId: routeTemplateId,
    requestId: routeRequestId,
    blueprintId: routeBlueprintId,
    specTemplateId: routeSpecTemplateId,
    patternId: routePatternId,
    designId: routeDesignId,
    intelligenceTab: routeIntelligenceTab,
    intelligenceItemId: routeIntelligenceItemId,
  } = useParams<{
    courseId?: string;
    view?: string;
    tab?: string;
    templateId?: string;
    requestId?: string;
    blueprintId?: string;
    specTemplateId?: string;
    patternId?: string;
    designId?: string;
    intelligenceTab?: string;
    intelligenceItemId?: string;
  }>();
  const state = (location.state as LocationState) ?? EMPTY_LOCATION_STATE;

  const isLearningCenterRoute =
    !!routeCourseId && (routeView === "user" || routeView === "admin");
  const isKnowledgeCenterRoute = location.pathname.startsWith("/stage2/knowledge");
  const isPortfolioCenterRoute = location.pathname.startsWith("/stage2/portfolio-management");
  const isTemplatesRoute = location.pathname.startsWith("/stage2/templates");
  const isSolutionSpecsRoute = location.pathname.startsWith("/stage2/specs");
  const isIntelligenceRoute = location.pathname.startsWith("/stage2/intelligence");
  const learningRole = state.learningRole === "admin" ? "admin" : "learner";
  const canAccessAdminView = learningRole === "admin";

  const fallbackLearningCourseId = enrolledCourses[0]?.id ?? "";
  const matchedLearningCourse = routeCourseId
    ? enrolledCourses.find((course) => course.id === routeCourseId)
    : undefined;
  const resolvedLearningCourseId =
    matchedLearningCourse?.id || fallbackLearningCourseId;
  
  const {
    marketplace: stateMarketplace = "portfolio-management",
    cardId: stateCardId = "portfolio-dashboard",
    serviceName: stateServiceName = "Portfolio Service",
  } = state;

  const marketplace = isLearningCenterRoute
    ? "learning-center"
    : isKnowledgeCenterRoute
      ? "knowledge-center"
      : isTemplatesRoute
        ? "templates"
      : isSolutionSpecsRoute
        ? "solution-specs"
      : isIntelligenceRoute
        ? "digital-intelligence"
      : isPortfolioCenterRoute
        ? "portfolio-management"
      : stateMarketplace;
  const cardId = isLearningCenterRoute ? resolvedLearningCourseId : stateCardId;
  const serviceName = isLearningCenterRoute
    ? (matchedLearningCourse?.courseName ?? "Learning Course")
    : stateServiceName;

  const getDefaultActiveService = (marketplaceId: string) => {
    switch (marketplaceId) {
      case "portfolio-management":
        return "Portfolio Management";
      case "learning-center":
        return "Learning Center";
      case "knowledge-center":
        return "Knowledge Center";
      case "support-services":
        return "Support Services";
      case "blueprints":
        return "Solutions Specs";
      case "templates":
        return "AI DocWriter";
      case "lifecycle-management":
        return "Lifecycle Management";
      case "solution-build":
        return "Solution Build";
      case "digital-intelligence":
        return "Digital Intelligence";
      case "solution-specs":
        return "Solutions Specs";
      default:
        return "Overview";
    }
  };

  const marketplaceLabel = marketplace
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // State for navigation
  const [activeService, setActiveService] = useState<string>("Overview");
  const [activeSubService, setActiveSubService] = useState<string | null>(() => {
    if (
      (marketplace === "portfolio-management" ||
        marketplace === "learning-center" ||
        marketplace === "lifecycle-management" ||
        marketplace === "solution-build" ||
        marketplace === "digital-intelligence") &&
      cardId
    ) {
      return cardId;
    }
    if (marketplace === "support-services") {
      return cardId ? "support-detail" : "support-overview";
    }
    return null;
  });
  const [viewMode, setViewMode] = useState<"user" | "admin">(
    routeView === "admin" && canAccessAdminView ? "admin" : "user"
  );
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeLearningUserTab, setActiveLearningUserTab] =
    useState<LearningUserTab>("overview");
  const [activeLearningAdminTab, setActiveLearningAdminTab] =
    useState<LearningAdminTab>("overview");
  const [userCourseRuntime, setUserCourseRuntime] = useState<Record<string, typeof userCourseData>>({});
  const [activeKnowledgeTab, setActiveKnowledgeTab] = useState<KnowledgeWorkspaceTab>(
    isKnowledgeWorkspaceTab(routeKnowledgeTab)
      ? routeKnowledgeTab
      : isKnowledgeWorkspaceTab(state.tab)
        ? state.tab
        : "overview"
  );
  const getTemplatesTabFromPath = (): TemplatesWorkspaceTab => {
    if (location.pathname.startsWith("/stage2/templates/library")) return "library";
    if (location.pathname.startsWith("/stage2/templates/new-request")) return "new-request";
    if (location.pathname.startsWith("/stage2/templates/my-requests")) return "my-requests";
    return "overview";
  };
  const [activeTemplatesTab, setActiveTemplatesTab] = useState<TemplatesWorkspaceTab>(
    getTemplatesTabFromPath()
  );
  const getSpecsTabFromPath = (): SpecsWorkspaceTab => {
    if (location.pathname.startsWith("/stage2/specs/blueprints")) return "blueprints";
    if (location.pathname.startsWith("/stage2/specs/templates")) return "templates";
    if (location.pathname.startsWith("/stage2/specs/patterns")) return "patterns";
    if (location.pathname.startsWith("/stage2/specs/my-designs")) return "my-designs";
    return "overview";
  };
  const [activeSpecsTab, setActiveSpecsTab] = useState<SpecsWorkspaceTab>(
    getSpecsTabFromPath()
  );
  const getIntelligenceTabFromPath = (): IntelligenceWorkspaceTab => {
    if (location.pathname.startsWith("/stage2/intelligence/services")) return "services";
    if (location.pathname.startsWith("/stage2/intelligence/my-dashboards")) return "my-dashboards";
    if (location.pathname.startsWith("/stage2/intelligence/requests")) return "requests";
    return "overview";
  };
  const [activeIntelligenceTab, setActiveIntelligenceTab] = useState<IntelligenceWorkspaceTab>(
    getIntelligenceTabFromPath()
  );
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState("");
  const [savedKnowledgeIds, setSavedKnowledgeIds] = useState<string[]>([]);
  const [knowledgeHistory, setKnowledgeHistory] = useState<KnowledgeHistoryEntry[]>([]);
  const [knowledgeMentionNotifications, setKnowledgeMentionNotifications] =
    useState<MentionNotification[]>([]);
  const [knowledgeRequests, setKnowledgeRequests] = useState<TORequest[]>([]);
  const [knowledgeUsageSignals, setKnowledgeUsageSignals] = useState<
    Array<(typeof knowledgeItems)[number] & { views: number; staleFlags: number; helpfulVotes: number }>
  >([]);
  const knowledgeCurrentUserName = "John Doe";

  useEffect(() => {
    setActiveService(getDefaultActiveService(marketplace));

    if (
      (marketplace === "portfolio-management" || marketplace === "learning-center") &&
      cardId
    ) {
      setActiveSubService(cardId);
      return;
    }

    setActiveSubService(null);
  }, [marketplace, cardId]);

  useEffect(() => {
    if (
      routeView === "admin" &&
      isLearningCenterRoute &&
      !canAccessAdminView
    ) {
      navigate(
        `/stage2/learning-center/course/${resolvedLearningCourseId}/user`,
        {
          replace: true,
          state: {
            ...state,
            learningRole,
          },
        }
      );
      return;
    }

    if (routeView === "admin" || routeView === "user") {
      if (routeView === "admin" && !canAccessAdminView) {
        setViewMode("user");
        return;
      }
      setViewMode(routeView);
    }
  }, [
    routeView,
    isLearningCenterRoute,
    canAccessAdminView,
    navigate,
    resolvedLearningCourseId,
    state,
    learningRole,
  ]);

  const refreshKnowledgeState = () => {
    setSavedKnowledgeIds(getSavedKnowledgeIds());
    setKnowledgeHistory(getKnowledgeHistory());
    setKnowledgeMentionNotifications(getMentionNotifications(knowledgeCurrentUserName));
    setKnowledgeRequests(getTORequests(knowledgeCurrentUserName));
    const usageById = new Map(
      getKnowledgeUsageMetrics().map((metric) => [metric.itemId, metric])
    );
    const ranked = knowledgeItems
      .map((item) => {
        const metric = usageById.get(item.id);
        return {
          ...item,
          views: metric?.views ?? 0,
          staleFlags: metric?.staleFlags ?? 0,
          helpfulVotes: metric?.helpfulVotes ?? 0,
        };
      })
      .filter((item) => item.views > 0 || item.staleFlags > 0 || item.helpfulVotes > 0)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
    setKnowledgeUsageSignals(ranked);
  };

  useEffect(() => {
    if (!isKnowledgeCenterRoute) return;
    const nextTab: KnowledgeWorkspaceTab = isKnowledgeWorkspaceTab(routeKnowledgeTab)
      ? routeKnowledgeTab
      : "overview";
    setActiveKnowledgeTab(nextTab);
  }, [isKnowledgeCenterRoute, routeKnowledgeTab]);

  useEffect(() => {
    if (!isKnowledgeCenterRoute) return;
    if (state.action !== "request-clarification" && state.action !== "post-comment") return;

    const resourceTitle = state.serviceName?.trim() || "Knowledge Resource";
    const isClarification = state.action === "request-clarification";

    createStage3Request({
      type: "knowledge-center",
      title: isClarification
        ? `Knowledge Clarification: ${resourceTitle}`
        : `Knowledge Collaboration Follow-up: ${resourceTitle}`,
      description: isClarification
        ? `Escalated from Stage 2 Knowledge action. Clarification requested for "${resourceTitle}".`
        : `Escalated from Stage 2 Knowledge action. Comment/collaboration follow-up for "${resourceTitle}".`,
      requester: {
        name: "John Doe",
        email: "john.doe@dtmp.local",
        department: "Portfolio Management",
        organization: "DTMP",
      },
      priority: isClarification ? "medium" : "low",
      estimatedHours: isClarification ? 4 : 2,
      tags: [
        "knowledge",
        isClarification ? "clarification" : "collaboration",
        state.tab || "library",
        state.cardId || "unknown-resource",
      ],
      notes: [
        `Source: Stage 2 Knowledge Workspace`,
        `Action: ${state.action}`,
      ],
    });

    const { action: _unusedAction, ...nextState } = state;
    navigate(location.pathname, {
      replace: true,
      state: nextState,
    });
  }, [isKnowledgeCenterRoute, state, navigate, location.pathname]);

  useEffect(() => {
    if (!isTemplatesRoute) return;
    setActiveTemplatesTab(getTemplatesTabFromPath());
  }, [isTemplatesRoute, location.pathname]);

  useEffect(() => {
    if (!isSolutionSpecsRoute) return;
    setActiveSpecsTab(getSpecsTabFromPath());
  }, [isSolutionSpecsRoute, location.pathname]);

  useEffect(() => {
    if (!isIntelligenceRoute) return;
    setActiveIntelligenceTab(getIntelligenceTabFromPath());
  }, [isIntelligenceRoute, location.pathname]);

  useEffect(() => {
    if (!isIntelligenceRoute) return;
    if (routeIntelligenceTab === "services" && routeIntelligenceItemId) {
      setActiveSubService(routeIntelligenceItemId);
      return;
    }
    if (routeIntelligenceTab === "services" && !routeIntelligenceItemId) {
      setActiveSubService(null);
      return;
    }
    if (
      routeIntelligenceTab === "overview" ||
      routeIntelligenceTab === "my-dashboards" ||
      routeIntelligenceTab === "requests"
    ) {
      setActiveSubService(null);
    }
  }, [isIntelligenceRoute, routeIntelligenceTab, routeIntelligenceItemId]);

  useEffect(() => {
    if (activeService !== "Knowledge Center") return;
    refreshKnowledgeState();
  }, [activeService, activeKnowledgeTab]);

  useEffect(() => {
    setActiveLearningUserTab("overview");
    setActiveLearningAdminTab("overview");
  }, [activeSubService, viewMode]);
  
  const [supportSelectedService, setSupportSelectedService] = useState(() => {
    if (marketplace === "support-services" && cardId) {
      return technicalSupport.find((s) => s.id === cardId) || expertConsultancy.find((s) => s.id === cardId) || null;
    }
    return null;
  });
  const [supportAttachments, setSupportAttachments] = useState<File[]>([]);
  const [supportSelectedArticleId, setSupportSelectedArticleId] = useState<string | null>(null);
  const [supportTicketsState, setSupportTicketsState] = useState(supportTickets);
  const [supportSubmitMessage, setSupportSubmitMessage] = useState<string | null>(null);
  const [supportRequestsState, setSupportRequestsState] = useState<ServiceRequest[]>(() => {
    const seeded = technicalSupport.slice(0, 8).map((svc, idx) => ({
      id: `REQ-SVC-${String(idx + 1).padStart(3, "0")}`,
      type: "change",
      title: svc.title,
      description: svc.description,
      justification: `Requesting engagement for ${svc.title}`,
      status: idx % 3 === 0 ? "pending-approval" : idx % 3 === 1 ? "in-progress" : "completed",
      requester: {
        id: "user-seeded",
        name: "Support User",
        email: "support.user@example.com",
        department: "IT Operations",
        manager: "Duty Manager",
      },
      approvalWorkflow: [],
      requestedItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activityLog: [],
    }));
    return [...seeded, ...serviceRequests];
  });

  // Collapsible sidebar states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  // Portfolio Management sub-services - Use actual application portfolio services
  const portfolioSubServices = applicationPortfolio.map(service => ({
    id: service.id,
    name: service.title,
    description: service.description,
    icon: getIconComponent(service.iconName),
    category: service.category,
    realtime: service.realtime,
    complexity: service.complexity
  }));

  const learnerScopedCourses = useMemo(() => {
    const workedCourses = enrolledCourses.filter(
      (course) => course.status !== "not-started"
    );
    return workedCourses.length > 0 ? workedCourses : enrolledCourses;
  }, []);

  const scopedLearningCourses =
    viewMode === "admin" ? enrolledCourses : learnerScopedCourses;

  // Learning Center sub-services - Role-scoped courses
  const learningSubServices = scopedLearningCourses.map(course => ({
    id: course.id,
    name: course.courseName,
    description: `${course.instructor} • ${course.duration} • ${course.progress}% complete`,
    icon: BookOpen,
    category: course.difficulty,
    status: course.status,
    progress: course.progress
  }));

  const selectedLearningCourse = activeSubService
    ? enrolledCourses.find((course) => course.id === activeSubService)
    : undefined;
  useEffect(() => {
    if (activeService !== "Learning Center") return;

    const hasActiveSelection =
      !!activeSubService &&
      scopedLearningCourses.some((course) => course.id === activeSubService);
    if (hasActiveSelection) return;

    const nextCourseId = scopedLearningCourses[0]?.id ?? null;
    if (!nextCourseId) return;

    setActiveSubService(nextCourseId);
    navigate(`/stage2/learning-center/course/${nextCourseId}/${viewMode}`, {
      replace: true,
      state: {
        ...state,
        learningRole,
      },
    });
  }, [
    activeService,
    activeSubService,
    scopedLearningCourses,
    navigate,
    viewMode,
    state,
    learningRole,
  ]);
  useEffect(() => {
    if (!selectedLearningCourse || viewMode !== "user") return;

    setUserCourseRuntime((prev) => {
      if (prev[selectedLearningCourse.id]) return prev;
      return {
        ...prev,
        [selectedLearningCourse.id]: buildUserProgressionData(
          selectedLearningCourse,
          userCourseData
        ),
      };
    });

    if (selectedLearningCourse.status === "not-started") {
      setActiveLearningUserTab("modules");
    }
  }, [selectedLearningCourse, viewMode]);
  const learningCourseProgressById = useMemo(
    () =>
      enrolledCourses.reduce<Record<string, number>>((acc, course) => {
        acc[course.id] = course.progress;
        return acc;
      }, {}),
    []
  );
  const learnerTrackSnapshots = useMemo(
    () =>
      buildTrackProgressSnapshots({
        userId: "user-john-doe",
        tracks: learningTracks,
        enrollments: trackEnrollments,
        courseProgressByStage2Id: learningCourseProgressById,
      }),
    [learningCourseProgressById]
  );
  const activeTrackSnapshot = useMemo<TrackProgressSnapshot | undefined>(() => {
    if (learnerTrackSnapshots.length === 0) return undefined;

    if (activeSubService) {
      const matchingTrack = learnerTrackSnapshots.find((trackSnapshot) =>
        trackSnapshot.stage2CourseIds.includes(activeSubService)
      );
      if (matchingTrack) return matchingTrack;
    }

    return (
      learnerTrackSnapshots.find((trackSnapshot) => trackSnapshot.status !== "completed") ??
      learnerTrackSnapshots[0]
    );
  }, [learnerTrackSnapshots, activeSubService]);
  const activeTrackForCertificate = useMemo(
    () =>
      activeTrackSnapshot
        ? learningTracks.find((track) => track.id === activeTrackSnapshot.trackId)
        : undefined,
    [activeTrackSnapshot]
  );
  const activeTrackEnrollmentForCertificate = useMemo(
    () =>
      activeTrackSnapshot
        ? trackEnrollments.find(
            (enrollment) =>
              enrollment.userId === "user-john-doe" &&
              enrollment.trackId === activeTrackSnapshot.trackId
          )
        : undefined,
    [activeTrackSnapshot]
  );
  const activePathCertificate = useMemo(() => {
    if (!activeTrackForCertificate || !activeTrackEnrollmentForCertificate) {
      return undefined;
    }

    return buildPathCertificateState({
      track: activeTrackForCertificate,
      enrollment: activeTrackEnrollmentForCertificate,
      courseProgressByStage2Id: learningCourseProgressById,
    });
  }, [
    activeTrackForCertificate,
    activeTrackEnrollmentForCertificate,
    learningCourseProgressById,
  ]);
  const trackMilestoneNotifications = useMemo(() => {
    if (!activeTrackForCertificate) return [];
    return buildTrackMilestoneNotifications({
      track: activeTrackForCertificate,
      enrollment: activeTrackEnrollmentForCertificate,
      trackProgress: activeTrackSnapshot,
      pathCertificate: activePathCertificate,
    });
  }, [
    activeTrackForCertificate,
    activeTrackEnrollmentForCertificate,
    activeTrackSnapshot,
    activePathCertificate,
  ]);
  const activeTrackForAdminAnalytics = useMemo(() => {
    if (!activeSubService) return undefined;
    return findTrackByStage2CourseId(activeSubService, learningTracks);
  }, [activeSubService]);
  const activeTrackAnalytics = useMemo(() => {
    if (!activeTrackForAdminAnalytics) return undefined;
    return buildTrackAnalytics(activeTrackForAdminAnalytics, trackEnrollments);
  }, [activeTrackForAdminAnalytics]);
  const userViewData = useMemo(() => {
    if (!selectedLearningCourse) return buildUserDataForCourse(undefined);
    return (
      userCourseRuntime[selectedLearningCourse.id] ??
      buildUserProgressionData(selectedLearningCourse, userCourseData)
    );
  }, [selectedLearningCourse, userCourseRuntime]);
  const adminViewData = useMemo(
    () => buildAdminDataForCourse(selectedLearningCourse),
    [selectedLearningCourse]
  );
  const savedKnowledgeItems = useMemo(
    () => knowledgeItems.filter((item) => savedKnowledgeIds.includes(item.id)),
    [savedKnowledgeIds]
  );
  const knowledgeHistoryItems = useMemo(
    () =>
      knowledgeHistory
        .map((entry) => ({
          entry,
          item: knowledgeItems.find((item) => item.id === entry.id),
        }))
        .filter(
          (
            candidate
          ): candidate is { entry: KnowledgeHistoryEntry; item: (typeof knowledgeItems)[number] } =>
            Boolean(candidate.item)
        ),
    [knowledgeHistory]
  );
  const knowledgeContinueReadingItems = useMemo(() => {
    const entries = getContinueReading(6);
    return entries
      .map((entry) => ({
        entry,
        item: knowledgeItems.find((item) => item.id === entry.id),
      }))
      .filter(
        (
          candidate
        ): candidate is { entry: KnowledgeHistoryEntry; item: (typeof knowledgeItems)[number] } =>
          Boolean(candidate.item)
      );
  }, [knowledgeHistory]);
  const normalizedKnowledgeQuery = knowledgeSearchQuery.trim().toLowerCase();
  const filteredSavedKnowledgeItems = savedKnowledgeItems.filter(
    (item) =>
      item.title.toLowerCase().includes(normalizedKnowledgeQuery) ||
      item.tags.join(" ").toLowerCase().includes(normalizedKnowledgeQuery)
  );
  const filteredKnowledgeHistoryItems = knowledgeHistoryItems.filter(
    ({ item }) =>
      item.title.toLowerCase().includes(normalizedKnowledgeQuery) ||
      item.tags.join(" ").toLowerCase().includes(normalizedKnowledgeQuery)
  );
  const filteredKnowledgeContinueItems = knowledgeContinueReadingItems.filter(
    ({ item }) =>
      item.title.toLowerCase().includes(normalizedKnowledgeQuery) ||
      item.tags.join(" ").toLowerCase().includes(normalizedKnowledgeQuery)
  );
  const formatKnowledgeViewedAt = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  const getNextKnowledgeRequestStatus = (status: TORequestStatus): TORequestStatus => {
    if (status === "Open") return "In Review";
    if (status === "In Review") return "Resolved";
    return "Resolved";
  };
  const handleKnowledgeTabClick = (tabId: KnowledgeWorkspaceTab) => {
    setActiveKnowledgeTab(tabId);
    navigate(`/stage2/knowledge/${tabId}`, {
      replace: true,
      state: {
        ...state,
        marketplace: "knowledge-center",
      },
    });
  };
  const handleKnowledgeToggleSave = (itemId: string) => {
    const [sourceTab, sourceId] = itemId.split(":");
    if (
      !sourceTab ||
      !sourceId ||
      (sourceTab !== "best-practices" &&
        sourceTab !== "testimonials" &&
        sourceTab !== "playbooks" &&
        sourceTab !== "library")
    ) {
      return;
    }
    toggleSavedKnowledgeItem(sourceTab, sourceId);
    refreshKnowledgeState();
  };
  const handleTemplatesTabClick = (tabId: TemplatesWorkspaceTab) => {
    setActiveTemplatesTab(tabId);
    const pathByTab: Record<TemplatesWorkspaceTab, string> = {
      overview: "/stage2/templates/overview",
      library: "/stage2/templates/library",
      "new-request": "/stage2/templates/new-request",
      "my-requests": "/stage2/templates/my-requests",
    };
    navigate(pathByTab[tabId], {
      replace: true,
      state: {
        ...state,
        marketplace: "templates",
      },
    });
  };
  const handleSpecsTabClick = (tabId: SpecsWorkspaceTab) => {
    setActiveSpecsTab(tabId);
    const pathByTab: Record<SpecsWorkspaceTab, string> = {
      overview: "/stage2/specs/overview",
      blueprints: "/stage2/specs/blueprints",
      templates: "/stage2/specs/templates",
      patterns: "/stage2/specs/patterns",
      "my-designs": "/stage2/specs/my-designs",
    };
    navigate(pathByTab[tabId], {
      replace: true,
      state: {
        ...state,
        marketplace: "solution-specs",
      },
    });
  };
  const handleIntelligenceTabClick = (tabId: IntelligenceWorkspaceTab) => {
    setActiveIntelligenceTab(tabId);
    const pathByTab: Record<IntelligenceWorkspaceTab, string> = {
      overview: "/stage2/intelligence/overview",
      services: "/stage2/intelligence/services",
      "my-dashboards": "/stage2/intelligence/my-dashboards",
      requests: "/stage2/intelligence/requests",
    };
    navigate(pathByTab[tabId], {
      replace: true,
      state: {
        ...state,
        marketplace: "digital-intelligence",
      },
    });
  };
  const handleKnowledgeNotificationClick = (notification: MentionNotification) => {
    markMentionNotificationRead(notification.id);
    const [sourceTab, sourceId] = notification.itemId.split(":");
    if (!sourceTab || !sourceId) {
      refreshKnowledgeState();
      return;
    }
    navigate(`/stage2/knowledge/${sourceTab}/${sourceId}`);
    refreshKnowledgeState();
  };
  const handleKnowledgeAdvanceRequestStatus = (
    requestId: string,
    currentStatus: TORequestStatus
  ) => {
    updateTORequestStatus(requestId, getNextKnowledgeRequestStatus(currentStatus));
    refreshKnowledgeState();
  };
  const handleLessonComplete = (moduleId: string, lessonId: string) => {
    if (!selectedLearningCourse) return;
    setUserCourseRuntime((prev) => {
      const current =
        prev[selectedLearningCourse.id] ??
        buildUserProgressionData(selectedLearningCourse, userCourseData);
      return {
        ...prev,
        [selectedLearningCourse.id]: completeLessonAndRecalculate(
          current,
          moduleId,
          lessonId
        ),
      };
    });
  };
  const handleQuizSubmit = (
    moduleId: string,
    lessonId: string,
    score: number,
    passThreshold: number
  ) => {
    if (!selectedLearningCourse) return;
    setUserCourseRuntime((prev) => {
      const current =
        prev[selectedLearningCourse.id] ??
        buildUserProgressionData(selectedLearningCourse, userCourseData);
      return {
        ...prev,
        [selectedLearningCourse.id]: submitQuizAttemptAndRecalculate(
          current,
          moduleId,
          lessonId,
          score,
          passThreshold
        ),
      };
    });
  };

  // Solution Build sub-services - Use actual solution builds
  const solutionBuildSubServices = solutionBuilds.map(build => ({
    id: build.id,
    name: build.title,
    description: build.description,
    solutionType: build.solutionType,
    buildComplexity: build.buildComplexity,
    automationLevel: build.automationLevel,
    codeSamples: build.codeSamples,
    technologyStack: build.technologyStack
  }));

  const SOLUTION_TYPE_COLORS: Record<SolutionType, { bg: string; text: string; border: string }> = {
    DBP: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    DXP: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    DWS: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    DIA: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    SDO: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };

  // Digital Intelligence sub-services - Use actual intelligence services
  const intelligenceSubServices = intelligenceServices.map(service => ({
    id: service.id,
    name: service.title,
    description: service.description,
    icon: Brain,
    category: service.category,
    accuracy: service.accuracy,
    updateFrequency: service.updateFrequency
  }));

  // Support sub-services
  const supportSubServices = [
    { id: "support-overview", name: "Overview", description: "Dashboards & SLAs", icon: Headphones },
    { id: "support-tickets", name: "My Tickets", description: "Track incidents", icon: Ticket },
    { id: "support-requests", name: "Service Requests", description: "Access & changes", icon: ClipboardList },
    { id: "support-knowledge", name: "Knowledge Base", description: "Articles and guides", icon: BookOpen }
  ];
  // Icon mapping function
  function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Activity,
      DollarSign,
      Shield,
      Cloud,
      BarChart3,
      Users,
      Target,
      TrendingUp
    };
    return iconMap[iconName] || Activity;
  }

  const isActiveService = (service: string) => {
    // Check if current path matches Solutions Specs routes
    if (service === "Solutions Specs" && location.pathname.startsWith('/stage2/specs')) {
      return "bg-orange-50 text-orange-700 font-medium";
    }
    return activeService === service ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50";
  };

  const isOverviewActive = () => {
    return activeService === "Overview" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700 hover:bg-gray-50";
  };

  const handleServiceClick = (service: string) => {
    setActiveService(service);
    setActiveSubService(null); // Reset sub-service when switching main service
    if (service === "Knowledge Center") {
      navigate(`/stage2/knowledge/${activeKnowledgeTab}`, {
        replace: true,
        state: {
          ...state,
          marketplace: "knowledge-center",
        },
      });
    }
    if (service === "AI DocWriter") {
      navigate("/stage2/templates/overview", {
        replace: true,
        state: {
          ...state,
          marketplace: "templates",
        },
      });
    }
    if (service === "Solutions Specs") {
      navigate("/stage2/specs/overview", {
        replace: true,
        state: {
          ...state,
          marketplace: "solution-specs",
        },
      });
    }
    if (service === "Digital Intelligence") {
      navigate("/stage2/intelligence/overview", {
        replace: true,
        state: {
          ...state,
          marketplace: "digital-intelligence",
        },
      });
    }
    if (service !== "Support Services") {
      setSupportSelectedService(null);
      setSupportSelectedArticleId(null);
    }
  };

  const handleSubServiceClick = (subServiceId: string) => {
    setActiveSubService(subServiceId);

    if (activeService === "Learning Center") {
      navigate(`/stage2/learning-center/course/${subServiceId}/${viewMode}`, {
        replace: true,
        state: {
          ...state,
          learningRole,
        },
      });
    }
    if (activeService === "Digital Intelligence") {
      navigate(`/stage2/intelligence/services/${subServiceId}`, {
        replace: true,
        state: {
          ...state,
          marketplace: "digital-intelligence",
        },
      });
    }
  };

  const handleContinueTrack = () => {
    if (!activeTrackSnapshot?.nextStage2CourseId) return;

    setActiveSubService(activeTrackSnapshot.nextStage2CourseId);
    setActiveLearningUserTab("modules");
    navigate(
      `/stage2/learning-center/course/${activeTrackSnapshot.nextStage2CourseId}/${viewMode}`,
      {
        replace: true,
        state: {
          ...state,
          learningRole,
        },
      }
    );
  };
  const handleEscalateLearningToStage3 = () => {
    if (activeService !== "Learning Center" || viewMode !== "admin" || !selectedLearningCourse) {
      return;
    }

    const created = createStage3Request({
      type: "learning-center",
      title: `Learning Ops: ${selectedLearningCourse.courseName}`,
      description:
        `Escalated from Stage 2 Learning Admin for operational follow-up. ` +
        `Course: ${selectedLearningCourse.courseName}.`,
      requester: {
        name: "Amina TO",
        email: "amina.to@dtmp.local",
        department: "Transformation Office",
        organization: "DTMP",
      },
      priority: "medium",
      estimatedHours: 6,
      tags: ["learning", "stage2-admin", selectedLearningCourse.id],
      notes: ["Created from Learning Stage 2 admin view."],
    });

    navigate("/stage3/new", {
      state: {
        fromStage2: true,
        requestId: created.id,
      },
    });
  };
  const profiles = {
    user: {
      initials: "AT",
      name: "Amina TO",
      role: "Learner",
      label: "User View",
    },
    admin: {
      initials: "AT",
      name: "Amina TO",
      role: "Admin",
      label: "Admin View",
    },
  } as const;

  const activeProfile = profiles[viewMode];

  const handleProfileSwitch = (nextMode: "user" | "admin") => {
    if (nextMode === "admin" && !canAccessAdminView) {
      setProfileMenuOpen(false);
      return;
    }

    setViewMode(nextMode);
    setProfileMenuOpen(false);

    if (isLearningCenterRoute && resolvedLearningCourseId) {
      navigate(
        `/stage2/learning-center/course/${resolvedLearningCourseId}/${nextMode}`,
        {
          replace: true,
          state: {
            ...state,
            learningRole,
          },
        }
      );
    }
    if (subServiceId !== "support-detail") {
      // leaving detail view but keep selection for navigation purposes
    }
    if (subServiceId !== "support-knowledge-detail") {
      setSupportSelectedArticleId(null);
    }
  };

  // Mock requests data
  const mockRequests = [
    {
      id: "req-001",
      resourceName: "Pre-configured Kubernetes Cluster",
      solutionBuild: "Microservices Platform Deployment",
      requestDate: "2024-01-15",
      status: "Approved",
      estimatedDelivery: "2024-01-20"
    },
    {
      id: "req-002",
      resourceName: "Kong Gateway Package",
      solutionBuild: "API Gateway Implementation",
      requestDate: "2024-01-14",
      status: "In Progress",
      estimatedDelivery: "2024-01-18"
    },
    {
      id: "req-003",
      resourceName: "Data Lake Starter Kit",
      solutionBuild: "Modern Data Platform",
      requestDate: "2024-01-13",
      status: "Pending",
      estimatedDelivery: "2024-01-22"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const createTicketFromService = () => {
    if (!supportSelectedService) return;
    const now = new Date();
    const id = `TICKET-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    const resolutionDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const minutesRemaining = Math.max(Math.floor((new Date(resolutionDeadline).getTime() - now.getTime()) / 60000), 0);
    const priority =
      supportSelectedService.slaLevel?.toLowerCase().includes("critical")
        ? "critical"
        : supportSelectedService.slaLevel?.toLowerCase().includes("high")
          ? "high"
          : "medium";
    const newTicket = {
      id,
      subject: supportSelectedService.title,
      description: supportSelectedService.description,
      priority,
      status: "new" as const,
      category: supportSelectedService.type || "Support",
      subcategory: supportSelectedService.title,
      requester: {
        id: "user-current",
        name: "You",
        email: "you@example.com",
        department: "N/A",
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      sla: {
        responseTimeHours: 4,
        resolutionTimeHours: 24,
        responseDeadline: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        resolutionDeadline,
        responseBreached: false,
        resolutionBreached: false,
        timeRemainingMinutes: minutesRemaining,
      },
      conversation: [],
      attachments: supportAttachments.map((file) => ({
        id: `att-${file.name}`,
        filename: file.name,
        fileSize: `${Math.max(file.size / 1024, 1).toFixed(0)} KB`,
        fileType: file.type || "file",
        uploadedBy: "You",
        uploadedAt: now.toISOString(),
        downloadUrl: "#",
      })),
      relatedKBArticles: [],
    };
    setSupportTicketsState((prev) => [newTicket, ...prev]);
    const newRequest: ServiceRequest = {
      id: `REQ-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`,
      type: "change",
      title: supportSelectedService.title,
      description: supportSelectedService.description,
      justification: `Submitted from ${supportSelectedService.title} service`,
      status: "pending-approval",
      requester: {
        id: "user-current",
        name: "You",
        email: "you@example.com",
        department: "N/A",
        manager: "N/A",
      },
      approvalWorkflow: [],
      requestedItems: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      activityLog: [],
    };
    setSupportRequestsState((prev) => [newRequest, ...prev]);
    setSupportSubmitMessage("Request submitted and added to My Tickets.");
    setSupportAttachments([]);
    setActiveSubService("support-tickets");
  };

  const renderSupportWorkspace = () => {
    if (!activeSubService || activeService !== "Support Services") return null;

    // If user arrived from Stage 1 card, show that detail first
    if (activeSubService === "support-detail" && supportSelectedService) {
      const handleAttachmentAdd = (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return;
        const newFiles = Array.from(fileList);
        setSupportAttachments((prev) => {
          const names = new Set(prev.map((f) => f.name));
          const deduped = newFiles.filter((f) => !names.has(f.name));
          return [...prev, ...deduped];
        });
      };

      const handleAttachmentRemove = (name: string) => {
        setSupportAttachments((prev) => prev.filter((f) => f.name !== name));
      };

      const detail = getSupportServiceDetail(supportSelectedService.id);
      return (
        <div className="p-6 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            {supportSubmitMessage && (
              <div className="mb-3 px-3 py-2 rounded-md bg-green-50 text-green-700 border border-green-200 text-sm">
                {supportSubmitMessage}
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">{supportSelectedService.type}</p>
                <h2 className="text-2xl font-bold text-gray-900">{supportSelectedService.title}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-700">
                  {supportSelectedService.responseTime && <Badge variant="secondary">{supportSelectedService.responseTime}</Badge>}
                  {supportSelectedService.deliveryModel && <Badge variant="secondary">{supportSelectedService.deliveryModel}</Badge>}
                  {supportSelectedService.coverage && <Badge variant="secondary">{supportSelectedService.coverage}</Badge>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <PriorityBadge priority={(supportSelectedService.slaLevel?.toLowerCase().includes("critical") ? "critical" : supportSelectedService.slaLevel?.toLowerCase().includes("high") ? "high" : "medium") as any} />
                <button className="btn-primary" onClick={createTicketFromService}>
                  Submit Request
                </button>
                <p className="text-xs text-gray-600">Provided by Support Operations (24x7)</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mt-3">{supportSelectedService.description}</p>

            {detail && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">What's Included</h3>
                  <ul className="text-sm text-gray-700 list-disc ml-4 space-y-1">
                    {detail.whatsIncluded?.slice(0, 6).map((i, idx) => <li key={idx}>{i}</li>)}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Ideal For</h3>
                  <ul className="text-sm text-gray-700 list-disc ml-4 space-y-1">
                    {detail.idealFor?.slice(0, 6).map((i, idx) => <li key={idx}>{i}</li>)}
                  </ul>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-800">
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500">Office / Team</p>
                <p className="font-semibold">Support Operations Center</p>
                <p className="text-xs text-gray-600">Hours: 24x7 • TZ: UTC</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-500">Contact Channels</p>
                <p className="font-semibold">Ticket, Chat, Bridge</p>
                <p className="text-xs text-gray-600">Escalation: Duty Manager</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                <p className="text-xs text-gray-500">Artifacts to attach</p>
                <p className="text-xs text-gray-700">Logs, screenshots, environment, business impact</p>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 cursor-pointer">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => handleAttachmentAdd(e.target.files)}
                    />
                    <span className="px-3 py-1 rounded border border-orange-200 bg-orange-50">Attach files</span>
                  </label>
                  {supportAttachments.length > 0 && (
                    <ul className="space-y-1 text-xs text-gray-700">
                      {supportAttachments.map((file) => (
                        <li key={file.name} className="flex items-center justify-between gap-2">
                          <span className="truncate">{file.name}</span>
                          <button
                            className="text-orange-700 hover:underline"
                            onClick={() => handleAttachmentRemove(file.name)}
                          >
                            remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeSubService === "support-overview") {
      const metrics = [
        { label: "Open Tickets", value: supportTicketsState.filter(t => !["resolved", "closed"].includes(t.status)).length },
        { label: "High / Critical", value: supportTicketsState.filter(t => ["critical", "high"].includes(t.priority as string)).length },
        { label: "Pending User", value: supportTicketsState.filter(t => t.status === "pending-user").length },
        { label: "Requests In Progress", value: supportRequestsState.filter(r => r.status === "in-progress").length },
      ];
      const topTickets = supportTicketsState.filter(t => !["resolved", "closed"].includes(t.status)).slice(0, 3);
      const topRequests = supportRequestsState.slice(0, 3);

      return (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map(m => (
              <div key={m.label} className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">{m.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Priority Tickets</h3>
              </div>
              <div className="space-y-3">
                {topTickets.map(t => (
                  <div key={t.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{t.subject}</p>
                        <p className="text-xs text-gray-600">{t.category} • {t.subcategory}</p>
                      </div>
                      <PriorityBadge priority={t.priority} size="small" />
                    </div>
                    <div className="mt-2">
                      <SLATimer
                        deadline={t.sla.resolutionDeadline}
                        timeRemainingMinutes={t.sla.timeRemainingMinutes}
                        breached={t.sla.resolutionBreached}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Service Requests</h3>
              </div>
              <div className="space-y-3">
                {topRequests.map(r => (
                  <div key={r.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                        <p className="text-xs text-gray-600 capitalize">{r.type}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">{r.status.replace("-", " ")}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">{r.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeSubService === "support-tickets") {
      const list = supportTicketsState;
      return (
        <div className="p-6 space-y-3">
          <div className="hidden md:grid grid-cols-[1fr_1.6fr_1fr_1fr_2fr] px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
            <div>Ticket ID</div>
            <div>Subject</div>
            <div>Priority</div>
            <div>Status</div>
            <div className="text-center">SLA</div>
          </div>
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
            {list.map(t => (
              <div
                key={t.id}
                className="flex flex-col md:grid md:grid-cols-[1fr_1.6fr_1fr_1fr_2fr] px-4 py-3 gap-3 items-start md:items-center"
              >
                <div className="text-sm font-semibold text-gray-900">{t.id}</div>
                <div className="text-sm text-gray-800 md:pr-4">{t.subject}</div>
                <div className="md:justify-self-start"><PriorityBadge priority={t.priority} size="small" /></div>
                <div className="text-sm capitalize text-gray-700">{t.status.replace("-", " ")}</div>
                <div className="w-full md:w-auto md:justify-self-stretch">
                  <SLATimer
                    deadline={t.sla.resolutionDeadline}
                    timeRemainingMinutes={t.sla.timeRemainingMinutes}
                    breached={t.sla.resolutionBreached}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSubService === "support-requests") {
      return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportRequestsState.map(req => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                  <p className="text-xs text-gray-600 capitalize">{req.type}</p>
                </div>
                <Badge variant="secondary" className="capitalize">{req.status.replace("-", " ")}</Badge>
              </div>
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">{req.description}</p>
              <p className="text-xs text-gray-500 mt-1">Requester: {req.requester.name}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeSubService === "support-knowledge") {
      return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {knowledgeArticles.slice(0, 12).map(article => (
            <button
              key={article.id}
              onClick={() => {
                setSupportSelectedArticleId(article.id);
                setActiveSubService("support-knowledge-detail");
              }}
              className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-orange-200 hover:bg-orange-50/40 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Badge variant="secondary">{article.category}</Badge>
                <span>{article.difficulty}</span>
                <span>•</span>
                <span>{article.estimatedReadTime}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mt-2">{article.title}</h3>
              <p className="text-sm text-gray-700 mt-1 line-clamp-3">{article.summary}</p>
              <p className="text-xs text-gray-500 mt-2">{article.views.toLocaleString()} views</p>
            </button>
          ))}
        </div>
      );
    }

    if (activeSubService === "support-knowledge-detail" && supportSelectedArticleId) {
      const article = knowledgeArticles.find(a => a.id === supportSelectedArticleId);
      if (!article) return null;
      return (
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <button
              className="text-sm text-orange-700 font-semibold hover:underline"
              onClick={() => {
                setActiveSubService("support-knowledge");
                setSupportSelectedArticleId(null);
              }}
            >
              ← Back to Knowledge Base
            </button>
            <Badge variant="secondary">{article.category}</Badge>
            <span className="text-xs text-gray-600 capitalize">{article.difficulty}</span>
            <span className="text-xs text-gray-600">{article.estimatedReadTime}</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">{article.title}</h2>
            <p className="text-sm text-gray-700">{article.summary}</p>
            <div className="flex gap-4 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1"><Calendar size={14} /> Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
              <span className="inline-flex items-center gap-1"><ClockIcon size={14} /> {article.estimatedReadTime}</span>
              <span className="inline-flex items-center gap-1"><Eye size={14} /> {article.views.toLocaleString()} views</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {article.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
            <div className="prose prose-sm max-w-none mt-3" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden h-screen">
      {/* Left Sidebar - Navigation */}
      <div className={`${leftSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0 h-full`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-3 ${leftSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              {!leftSidebarCollapsed && (
                <div>
                  <h2 className="font-semibold text-sm">DTMP Platform</h2>
                  <p className="text-xs text-gray-500">Stage 2 - Service Hub</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="p-1 h-6 w-6"
            >
              {leftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <button 
              onClick={() => handleServiceClick("Overview")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isOverviewActive()}`}
              title="Overview"
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Overview"}
            </button>
            
            {/* Service Categories */}
            {!leftSidebarCollapsed && (
              <div className="pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Services
                </p>
              </div>
            )}
            
            <button 
              onClick={() => handleServiceClick("AI DocWriter")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("AI DocWriter")}`}
              title="AI DocWriter"
            >
              <PenTool className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "AI DocWriter"}
            </button>
            
            <button 
              onClick={() => {
                setActiveService("Solutions Specs");
                navigate('/stage2/specs/overview');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Solutions Specs")}`}
              title="Solutions Specs"
            >
              <PenTool className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Solutions Specs"}
            </button>

            <button 
              onClick={() => handleServiceClick("Learning Center")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Learning Center")}`}
              title="Learning Center"
            >
              <Headphones className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Learning Center"}
            </button>

            <button 
              onClick={() => handleServiceClick("Knowledge Center")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Knowledge Center")}`}
              title="Knowledge Center"
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Knowledge Center"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Solution Build")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Solution Build")}`}
              title="Solution Build"
            >
              <Hammer className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Solution Build"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Lifecycle Management")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Lifecycle Management")}`}
              title="Lifecycle Management"
            >
              <RefreshCw className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Lifecycle Management"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Portfolio Management")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Portfolio Management")}`}
              title="Portfolio Management"
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Portfolio Management"}
            </button>

            <button
              onClick={() => handleServiceClick("Digital Intelligence")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Digital Intelligence")}`}
              title="Digital Intelligence"
            >
              <Brain className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Digital Intelligence"}
            </button>
            
            <button 
              onClick={() => {
                handleServiceClick("Support Services");
                setActiveSubService("support-overview");
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Support Services")}`}
              title="Support Services"
            >
              <Headphones className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Support Services"}
            </button>
            
            {/* Analytics Section */}
            {!leftSidebarCollapsed && (
              <div className="pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Analytics
                </p>
              </div>
            )}
            
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50"
              title="Dashboards"
            >
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Dashboards"}
            </button>
            
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50"
              title="Reports"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Reports"}
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 relative">
          <button
            type="button"
            onClick={() =>
              setProfileMenuOpen((prev) => (canAccessAdminView ? !prev : false))
            }
            className={`w-full flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors ${leftSidebarCollapsed ? 'justify-center' : ''}`}
            title="Switch profile view"
          >
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-orange-700 text-xs font-medium">{activeProfile.initials}</span>
            </div>
            {!leftSidebarCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{activeProfile.name}</p>
                <p className="text-xs text-gray-500">{activeProfile.role}</p>
              </div>
            )}
          </button>

          {profileMenuOpen && !leftSidebarCollapsed && canAccessAdminView && (
            <div className="absolute bottom-16 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
              <button
                type="button"
                onClick={() => handleProfileSwitch("user")}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  viewMode === "user" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700"
                }`}
              >
                Amina TO - Learner View
              </button>
              <button
                type="button"
                onClick={() => handleProfileSwitch("admin")}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  viewMode === "admin" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700"
                }`}
              >
                Amina TO - Admin View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle Column - Context & Controls */}
      <div className={`${rightSidebarCollapsed ? 'w-0' : 'w-80'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0 h-full`}>
        {!rightSidebarCollapsed && (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/marketplaces/${marketplace}`)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {marketplaceLabel}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightSidebarCollapsed(true)}
                  className="p-1 h-6 w-6"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>

              {/* Service Context */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{activeService}</h1>
                  <p className="text-sm text-gray-500">Service Hub</p>
                </div>
              </div>
            </div>

            {/* Dynamic Content Based on Active Service */}
            <div className="flex-1 p-4 overflow-y-auto">
              {activeService === "Portfolio Management" ? (
                <PortfolioWorkspaceSidebar
                  portfolioSubServices={portfolioSubServices}
                  activeSubService={activeSubService}
                  onSelectSubService={handleSubServiceClick}
                />
              ) : activeService === "Learning Center" ? (
                <LearningWorkspaceSidebar
                  viewMode={viewMode}
                  learningSubServices={learningSubServices}
                  activeSubService={activeSubService}
                  onSelectSubService={handleSubServiceClick}
                />
              ) : activeService === "Knowledge Center" ? (
                <KnowledgeWorkspaceSidebar
                  activeTab={activeKnowledgeTab}
                  searchQuery={knowledgeSearchQuery}
                  onSearchChange={setKnowledgeSearchQuery}
                  onTabChange={handleKnowledgeTabClick}
                />
              ) : activeService === "AI DocWriter" ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleTemplatesTabClick("overview")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeTemplatesTab === "overview"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">Overview</div>
                      <div className="text-xs text-gray-500 mt-0.5">Template workspace summary</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTemplatesTabClick("library")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeTemplatesTab === "library"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">Template Library</div>
                      <div className="text-xs text-gray-500 mt-0.5">Browse and open templates</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTemplatesTabClick("new-request")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeTemplatesTab === "new-request"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">New Request</div>
                      <div className="text-xs text-gray-500 mt-0.5">Generate a new document</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTemplatesTabClick("my-requests")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeTemplatesTab === "my-requests"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">My Requests</div>
                      <div className="text-xs text-gray-500 mt-0.5">Track request status</div>
                    </div>
                  </button>
                </div>
              ) : activeService === "Solutions Specs" ? (
                <div className="space-y-2">
                  <button
                    onClick={() => handleSpecsTabClick("overview")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeSpecsTab === "overview"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">Overview</div>
                      <div className="text-xs text-gray-500 mt-0.5">Solutions specs workspace summary</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSpecsTabClick("blueprints")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeSpecsTab === "blueprints"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">Architecture Library</div>
                      <div className="text-xs text-gray-500 mt-0.5">Browse architecture blueprints</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSpecsTabClick("templates")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeSpecsTab === "templates"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">Design Templates</div>
                      <div className="text-xs text-gray-500 mt-0.5">Reusable design templates</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSpecsTabClick("patterns")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeSpecsTab === "patterns"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">Design Patterns</div>
                      <div className="text-xs text-gray-500 mt-0.5">Pattern library and standards</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSpecsTabClick("my-designs")}
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                      activeSpecsTab === "my-designs"
                        ? "bg-orange-50 text-orange-700 border border-orange-200"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">My Designs</div>
                      <div className="text-xs text-gray-500 mt-0.5">Saved and in-progress designs</div>
                    </div>
                  </button>
                </div>
              ) : activeService === "Lifecycle Management" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Lifecycle Services</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSubServiceClick('overview')}
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                          activeSubService === 'overview' 
                            ? "bg-orange-50 text-orange-700 border border-orange-200" 
                            : "text-gray-700 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium">Overview Dashboard</div>
                          <div className="text-xs text-gray-500 mt-0.5">Active lifecycles and approvals</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSubServiceClick('projects')}
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                          activeSubService === 'projects' 
                            ? "bg-orange-50 text-orange-700 border border-orange-200" 
                            : "text-gray-700 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium">Projects</div>
                          <div className="text-xs text-gray-500 mt-0.5">Project lifecycle management</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSubServiceClick('applications')}
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                          activeSubService === 'applications' 
                            ? "bg-orange-50 text-orange-700 border border-orange-200" 
                            : "text-gray-700 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium">Applications</div>
                          <div className="text-xs text-gray-500 mt-0.5">Application governance</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSubServiceClick('templates')}
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                          activeSubService === 'templates' 
                            ? "bg-orange-50 text-orange-700 border border-orange-200" 
                            : "text-gray-700 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium">Templates Library</div>
                          <div className="text-xs text-gray-500 mt-0.5">Lifecycle frameworks</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleSubServiceClick('approvals')}
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                          activeSubService === 'approvals' 
                            ? "bg-orange-50 text-orange-700 border border-orange-200" 
                            : "text-gray-700 hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-medium">Pending Approvals</div>
                          <div className="text-xs text-gray-500 mt-0.5">Gate approvals</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeService === "Learning Center" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">My Courses</h3>
                    <div className="space-y-2">
                      {learningSubServices.map((course) => {
                        const Icon = course.icon;
                        const statusColor = course.status === 'completed' ? 'text-green-600' : 
                                          course.status === 'in-progress' ? 'text-blue-600' : 'text-gray-400';
                        return (
                          <button
                            key={course.id}
                            onClick={() => handleSubServiceClick(course.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                              activeSubService === course.id 
                                ? "bg-orange-50 text-orange-700 border border-orange-200" 
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${statusColor}`} />
                            <div className="text-left flex-1">
                              <div className="font-medium">{course.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{course.description}</div>
                              {course.progress > 0 && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-orange-600 h-1.5 rounded-full" 
                                      style={{ width: `${course.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeService === "Solution Build" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Solution Builds</h3>
                    <div className="space-y-2">
                      {solutionBuildSubServices.map((build) => {
                        const colors = SOLUTION_TYPE_COLORS[build.solutionType];
                        return (
                          <button
                            key={build.id}
                            onClick={() => handleSubServiceClick(build.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                              activeSubService === build.id 
                                ? "bg-orange-50 text-orange-700 border border-orange-200" 
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Code className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="text-left flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{build.name}</span>
                                <Badge className={`${colors.bg} ${colors.text} ${colors.border} border text-xs`} variant="outline">
                                  {build.solutionType}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-2">{build.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeService === "Digital Intelligence" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Intelligence Services</h3>
                    <div className="space-y-2">
                      {intelligenceSubServices.map((service) => {
                        const Icon = service.icon;
                        return (
                          <button
                            key={service.id}
                            onClick={() => handleSubServiceClick(service.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                              activeSubService === service.id 
                                ? "bg-purple-50 text-purple-700 border border-purple-200" 
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" />
                            <div className="text-left flex-1">
                              <div className="font-medium">{service.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{service.description}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-purple-600">{service.accuracy}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500 capitalize">{service.updateFrequency}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeService === "Support Services" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Support Services</h3>
                    <div className="space-y-2">
                      {supportSubServices.map((svc) => {
                        const Icon = svc.icon;
                        return (
                          <button
                            key={svc.id}
                            onClick={() => handleSubServiceClick(svc.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                              activeSubService === svc.id
                                ? "bg-orange-50 text-orange-700 border border-orange-200"
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">{svc.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{svc.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeService === "Overview" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Dashboard
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Recent Reports
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Access {activeService}
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        View Documentation
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {rightSidebarCollapsed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightSidebarCollapsed(false)}
                  className="p-1 h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeSubService ? 
                    (activeService === "Portfolio Management" 
                      ? portfolioSubServices.find(s => s.id === activeSubService)?.name 
                      : activeService === "Learning Center"
                      ? learningSubServices.find(s => s.id === activeSubService)?.name
                      : activeService === "Lifecycle Management"
                      ? activeSubService.charAt(0).toUpperCase() + activeSubService.slice(1)
                      : activeService === "Solution Build"
                      ? solutionBuildSubServices.find(s => s.id === activeSubService)?.name
                      : activeService === "Digital Intelligence"
                      ? intelligenceSubServices.find(s => s.id === activeSubService)?.name
                      : activeService === "Support Services"
                      ? supportSubServices.find(s => s.id === activeSubService)?.name
                      : activeService)
                    : activeService
                  }
                </h2>
                <p className="text-sm text-gray-500">
                  {activeSubService ? 
                    (activeService === "Portfolio Management"
                      ? portfolioSubServices.find(s => s.id === activeSubService)?.description
                      : activeService === "Learning Center"
                      ? learningSubServices.find(s => s.id === activeSubService)?.description
                      : activeService === "Solution Build"
                      ? `${solutionBuildSubServices.find(s => s.id === activeSubService)?.solutionType} Solution`
                      : activeService === "Digital Intelligence"
                      ? intelligenceSubServices.find(s => s.id === activeSubService)?.description
                      : activeService === "Support Services"
                      ? supportSubServices.find(s => s.id === activeSubService)?.description
                      : `${activeService} • Service Hub`)
                    : `${activeService} • Service Hub`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeService === "Learning Center" && viewMode === "admin" && (
                <Button size="sm" variant="outline" onClick={handleEscalateLearningToStage3}>
                  <FileText className="w-4 h-4 mr-2" />
                  Send To TO Ops
                </Button>
              )}
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => setShowRequestsModal(true)}>
                <FileText className="w-4 h-4 mr-2" />
                My Requests
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {activeService === "Portfolio Management" && activeSubService ? (
            <PortfolioWorkspaceMain
              activeSubService={activeSubService}
              portfolioSubServices={portfolioSubServices}
            />
          ) : activeService === "Learning Center" && activeSubService ? (
            <LearningWorkspaceMain
              viewMode={viewMode}
              activeTrackSnapshot={activeTrackSnapshot}
              trackMilestoneNotifications={trackMilestoneNotifications}
              onContinueTrack={handleContinueTrack}
              activeLearningUserTab={activeLearningUserTab}
              setActiveLearningUserTab={setActiveLearningUserTab}
              activeLearningAdminTab={activeLearningAdminTab}
              setActiveLearningAdminTab={setActiveLearningAdminTab}
              canAccessAdminView={canAccessAdminView}
              selectedLearningCourse={selectedLearningCourse}
              activeTrackAnalytics={activeTrackAnalytics}
              adminViewData={adminViewData}
              userViewData={userViewData}
              onCompleteLesson={handleLessonComplete}
              onQuizSubmit={handleQuizSubmit}
              activePathCertificate={activePathCertificate}
            />
          ) : activeService === "Knowledge Center" ? (
            <KnowledgeWorkspaceMain
              activeTab={activeKnowledgeTab}
              mentionNotifications={knowledgeMentionNotifications}
              requests={knowledgeRequests}
              usageSignals={knowledgeUsageSignals}
              continueItems={filteredKnowledgeContinueItems}
              savedItems={filteredSavedKnowledgeItems}
              historyItems={filteredKnowledgeHistoryItems}
              formatViewedAt={formatKnowledgeViewedAt}
              onNotificationClick={handleKnowledgeNotificationClick}
              onAdvanceRequestStatus={handleKnowledgeAdvanceRequestStatus}
              getNextRequestStatus={getNextKnowledgeRequestStatus}
              onOpenItem={(sourceTab, sourceId) =>
                navigate(`/stage2/knowledge/${sourceTab}/${sourceId}`)
              }
              onToggleSave={handleKnowledgeToggleSave}
            />
          ) : activeService === "AI DocWriter" ? (
            <div className="h-full">
              {activeTemplatesTab === "overview" && <TemplatesOverview />}
              {activeTemplatesTab === "library" && !routeTemplateId && <TemplateLibraryPage />}
              {activeTemplatesTab === "library" && !!routeTemplateId && <TemplateDetailPage />}
              {activeTemplatesTab === "new-request" && <NewRequestPage />}
              {activeTemplatesTab === "my-requests" && !routeRequestId && <MyRequestsPage />}
              {activeTemplatesTab === "my-requests" && !!routeRequestId && (
                <TemplatesRequestDetailPage />
              )}
            </div>
          ) : activeService === "Solutions Specs" ? (
            <div className="h-full">
              {activeSpecsTab === "overview" && <SolutionSpecsOverview />}
              {activeSpecsTab === "blueprints" && !routeBlueprintId && <ArchitectureLibraryPage />}
              {activeSpecsTab === "blueprints" && !!routeBlueprintId && <BlueprintDetailPage />}
              {activeSpecsTab === "templates" && !routeSpecTemplateId && <DesignTemplatesPage />}
              {activeSpecsTab === "templates" && !!routeSpecTemplateId && <SpecTemplateDetailPage />}
              {activeSpecsTab === "patterns" && !routePatternId && <DesignPatternsPage />}
              {activeSpecsTab === "patterns" && !!routePatternId && <PatternDetailPage />}
              {activeSpecsTab === "my-designs" && !routeDesignId && <MyDesignsPage />}
              {activeSpecsTab === "my-designs" && !!routeDesignId && <DesignDetailPage />}
            </div>
          ) : activeService === "Lifecycle Management" && activeSubService ? (
            <div className="h-full">
              {activeSubService === 'overview' && <LifecycleOverview />}
              {activeSubService === 'projects' && <ProjectsPage />}
              {activeSubService === 'applications' && <ApplicationsPage />}
              {activeSubService === 'templates' && <TemplatesLibrary />}
              {activeSubService === 'approvals' && <ApprovalsPage />}
            </div>
          ) : activeService === "Portfolio Management" && activeSubService ? (
            <div className="h-full">
              {activeSubService === "portfolio-health-dashboard" && (
                <PortfolioHealthDashboard className="h-full" />
              )}

              {activeSubService === "application-rationalization" && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="w-5 h-5 text-red-600" />
                          <h3 className="font-semibold text-red-900">Redundant Apps</h3>
                        </div>
                        <p className="text-2xl font-bold text-red-900">23</p>
                        <p className="text-sm text-red-700">Candidates for retirement</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-orange-600" />
                          <h3 className="font-semibold text-orange-900">Potential Savings</h3>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">$1.2M</p>
                        <p className="text-sm text-orange-700">Annual cost reduction</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-900">Rationalization Score</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-900">78%</p>
                        <p className="text-sm text-green-700">Portfolio efficiency</p>
                      </div>
                    </div>
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Rationalization Assessment</h3>
                      <p className="text-gray-500">Comprehensive analysis and recommendations would be displayed here</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSubService === "tco-optimization" && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">Total TCO</h3>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">$2.4M</p>
                        <p className="text-sm text-blue-700">Annual portfolio cost</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-green-900">Cost per User</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-900">$1,200</p>
                        <p className="text-sm text-green-700">Per user annually</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-purple-900">Savings Potential</h3>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">$480K</p>
                        <p className="text-sm text-purple-700">License optimization</p>
                      </div>
                    </div>
                    <div className="text-center py-12">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">TCO Optimization</h3>
                      <p className="text-gray-500">Cost analysis and optimization tools would be displayed here</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Other sub-services with placeholder content */}
              {!["portfolio-health-dashboard", "application-rationalization", "tco-optimization"].includes(activeSubService) && (
                <div className="p-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {portfolioSubServices.find(s => s.id === activeSubService)?.name}
                      </h3>
                      <p className="text-gray-500">
                        {portfolioSubServices.find(s => s.id === activeSubService)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeService === "Learning Center" && activeSubService ? (
            <div className="h-full">
              {/* Learning Center Course Content */}
              {(() => {
                const course = enrolledCourses.find(c => c.id === activeSubService);
                if (!course) return null;
                
                return <CourseDetailView course={course} />;
              })()}
            </div>
          ) : activeService === "Solution Build" && activeSubService ? (
            <div className="h-full">
              {/* Solution Build Content */}
              {(() => {
                const build = solutionBuilds.find(b => b.id === activeSubService);
                if (!build) return null;
                const colors = SOLUTION_TYPE_COLORS[build.solutionType];
                
                // Microservices Platform Deployment Solutions
                if (build.id === "microservices-deployment") {
                  const solutions = [
                    {
                      id: "k8s-cluster",
                      title: "Pre-configured Kubernetes Cluster",
                      description: "One-click K8s cluster with namespaces, RBAC, and ingress controllers ready to deploy",
                      details: "Includes multi-zone deployment, automated backup configuration, network policies, and integrated monitoring. Supports horizontal pod autoscaling and rolling updates out of the box.",
                      icon: Cloud
                    },
                    {
                      id: "microservices-template",
                      title: "Containerized Microservices Template",
                      description: "Docker images with health checks, logging, and service discovery pre-configured",
                      details: "Production-ready container templates with liveness/readiness probes, structured logging to stdout/stderr, environment-based configuration, and automatic service registration with Consul/Eureka.",
                      icon: Activity
                    },
                    {
                      id: "autoscaling-config",
                      title: "Auto-scaling Configuration Package",
                      description: "HPA and VPA policies with resource limits and monitoring alerts pre-set",
                      details: "Intelligent scaling policies based on CPU, memory, and custom metrics. Includes pod disruption budgets, resource quotas, and integration with cluster autoscaler for node-level scaling.",
                      icon: TrendingUp
                    },
                    {
                      id: "service-mesh-bundle",
                      title: "Service Mesh Bundle",
                      description: "Istio installation with traffic routing, circuit breakers, and mTLS enabled out-of-the-box",
                      details: "Complete service mesh with automatic sidecar injection, advanced traffic management (canary, blue-green), distributed tracing, and zero-trust security with mutual TLS between all services.",
                      icon: Shield
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // API Gateway Implementation Solutions
                if (build.id === "api-gateway-implementation") {
                  const solutions = [
                    {
                      id: "kong-gateway",
                      title: "Kong Gateway Package",
                      description: "Pre-configured Kong with plugins for auth, rate limiting, and CORS ready to deploy",
                      details: "Enterprise-grade API gateway with pre-installed plugins for authentication (OAuth2, JWT, API Key), rate limiting, request/response transformation, and CORS. Includes Kong Manager UI for visual configuration and monitoring.",
                      icon: Shield
                    },
                    {
                      id: "api-security",
                      title: "API Security Bundle",
                      description: "OAuth2 server, JWT validation, and API key management pre-integrated",
                      details: "Complete security layer with OAuth2 authorization server, JWT token generation and validation, API key lifecycle management, IP whitelisting/blacklisting, and bot detection. Includes threat protection against SQL injection and XSS attacks.",
                      icon: Shield
                    },
                    {
                      id: "developer-portal",
                      title: "Developer Portal Template",
                      description: "Swagger UI with auto-generated docs and API testing interface ready to use",
                      details: "Self-service developer portal with interactive API documentation, built-in API testing console, code generation in multiple languages, and automated API key provisioning. Supports OpenAPI 3.0 specifications with real-time updates.",
                      icon: BookOpen
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Modern Data Platform Solutions
                if (build.id === "data-platform-build") {
                  const solutions = [
                    {
                      id: "data-lake",
                      title: "Data Lake Starter Kit",
                      description: "S3 buckets with Glue crawlers, data catalog, and partitioning strategy pre-configured",
                      details: "Production-ready data lake with automated schema discovery, metadata management, and optimized storage layers (raw, processed, curated). Includes lifecycle policies, encryption at rest, and cross-region replication for disaster recovery.",
                      icon: Cloud
                    },
                    {
                      id: "data-warehouse",
                      title: "Data Warehouse Template",
                      description: "Redshift cluster with optimized schemas, user roles, and backup policies ready to use",
                      details: "Enterprise data warehouse with star schema design, distribution and sort keys optimized for query performance, workload management queues, and automated snapshots. Includes user access controls and query monitoring dashboards.",
                      icon: BarChart3
                    },
                    {
                      id: "etl-pipeline",
                      title: "ETL Pipeline Package",
                      description: "Airflow DAGs with data validation, error handling, and scheduling pre-built",
                      details: "Automated data pipelines with incremental loading, data quality checks, error notifications, and retry logic. Includes data lineage tracking, SLA monitoring, and integration with data catalog for metadata synchronization.",
                      icon: Activity
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Enterprise CI/CD Pipeline Setup Solutions
                if (build.id === "ci-cd-pipeline-setup") {
                  const solutions = [
                    {
                      id: "pipeline-template",
                      title: "Multi-Stage Pipeline Template",
                      description: "Pre-configured Jenkins/GitLab CI pipelines with build, test, and deploy stages ready to use",
                      details: "Production-ready pipeline templates with parallel execution, artifact management, and environment promotion workflows. Includes automated code quality checks, security scanning, and deployment approvals with rollback capabilities.",
                      icon: Activity
                    },
                    {
                      id: "testing-framework",
                      title: "Automated Testing Framework",
                      description: "Unit, integration, and E2E testing setup with coverage reporting pre-integrated",
                      details: "Comprehensive testing suite with JUnit, Selenium, and API testing frameworks. Includes code coverage analysis, test result dashboards, and automatic test execution on every commit with parallel test execution for faster feedback.",
                      icon: CheckCircle
                    },
                    {
                      id: "deployment-automation",
                      title: "Multi-Cloud Deployment Package",
                      description: "Kubernetes and cloud-native deployment automation with blue-green and canary strategies",
                      details: "Zero-downtime deployment automation supporting AWS, Azure, and GCP. Includes Helm charts, infrastructure as code templates, automated health checks, and progressive delivery with automatic rollback on failure detection.",
                      icon: Rocket
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Customer Data Platform Implementation Solutions
                if (build.id === "customer-data-platform-build") {
                  const solutions = [
                    {
                      id: "unified-profile",
                      title: "Unified Customer Profile Engine",
                      description: "Real-time customer data integration with identity resolution and profile unification",
                      details: "360-degree customer view with real-time data ingestion from multiple sources, deterministic and probabilistic matching algorithms, and golden record creation. Includes GDPR compliance tools, consent management, and data privacy controls.",
                      icon: Users
                    },
                    {
                      id: "segmentation-engine",
                      title: "Advanced Segmentation Engine",
                      description: "Dynamic customer segmentation with behavioral analytics and predictive modeling",
                      details: "AI-powered segmentation with real-time audience building, behavioral triggers, and predictive scoring. Includes pre-built segment templates, A/B testing capabilities, and integration with marketing automation platforms for personalized campaigns.",
                      icon: Target
                    },
                    {
                      id: "analytics-dashboard",
                      title: "Customer Analytics Dashboard",
                      description: "Real-time analytics with customer journey mapping and attribution modeling",
                      details: "Interactive dashboards with customer lifetime value analysis, churn prediction, and multi-touch attribution. Includes journey visualization, funnel analysis, and custom KPI tracking with automated insights and anomaly detection.",
                      icon: BarChart3
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Identity & Access Management Platform Setup Solutions
                if (build.id === "iam-platform-setup") {
                  const solutions = [
                    {
                      id: "sso-solution",
                      title: "Single Sign-On Package",
                      description: "Enterprise SSO with SAML, OAuth2, and OpenID Connect pre-configured",
                      details: "Unified authentication across all applications with support for SAML 2.0, OAuth2, and OpenID Connect protocols. Includes social login integration, adaptive authentication, and seamless user experience with session management and automatic token refresh.",
                      icon: Shield
                    },
                    {
                      id: "mfa-bundle",
                      title: "Multi-Factor Authentication Bundle",
                      description: "MFA with SMS, email, authenticator apps, and biometric authentication ready to deploy",
                      details: "Comprehensive MFA solution supporting multiple authentication methods including TOTP, push notifications, SMS, email, and biometric verification. Includes risk-based authentication, device trust, and step-up authentication for sensitive operations.",
                      icon: Shield
                    },
                    {
                      id: "identity-governance",
                      title: "Identity Governance & Administration",
                      description: "User lifecycle management with role-based access control and compliance reporting",
                      details: "Automated user provisioning and deprovisioning with approval workflows, role-based access control (RBAC), and segregation of duties enforcement. Includes access certification campaigns, compliance reporting, and audit trails for regulatory requirements.",
                      icon: Users
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Full-Stack Observability Deployment Solutions
                if (build.id === "observability-stack-deploy") {
                  const solutions = [
                    {
                      id: "monitoring-stack",
                      title: "Prometheus & Grafana Monitoring Stack",
                      description: "Pre-configured Prometheus with Grafana dashboards for metrics collection and visualization",
                      details: "Complete monitoring solution with service discovery, metric scraping, alerting rules, and pre-built dashboards for infrastructure, applications, and business metrics. Includes high availability setup, long-term storage, and federation for multi-cluster monitoring.",
                      icon: BarChart3
                    },
                    {
                      id: "logging-solution",
                      title: "Centralized Logging Solution",
                      description: "Loki-based log aggregation with search, filtering, and correlation capabilities",
                      details: "Scalable log management with automatic log collection from all services, structured logging support, and powerful query language. Includes log retention policies, alerting on log patterns, and integration with monitoring dashboards for unified observability.",
                      icon: FileText
                    },
                    {
                      id: "tracing-platform",
                      title: "Distributed Tracing Platform",
                      description: "Jaeger implementation with automatic instrumentation and trace visualization",
                      details: "End-to-end request tracing across microservices with automatic instrumentation for popular frameworks. Includes trace sampling strategies, performance analysis, dependency graphs, and root cause analysis tools for troubleshooting latency issues.",
                      icon: Activity
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Event Streaming Platform Solutions
                if (build.id === "event-streaming-platform-build") {
                  const solutions = [
                    {
                      id: "kafka-cluster",
                      title: "Production Kafka Cluster",
                      description: "Multi-broker Kafka cluster with replication, partitioning, and monitoring pre-configured",
                      details: "High-availability Kafka deployment with automatic leader election, data replication across availability zones, and optimized configurations for throughput and latency. Includes cluster monitoring, topic management, and consumer lag tracking.",
                      icon: Activity
                    },
                    {
                      id: "schema-registry",
                      title: "Schema Registry & Governance",
                      description: "Confluent Schema Registry with versioning and compatibility enforcement",
                      details: "Centralized schema management with automatic schema evolution, backward/forward compatibility checks, and schema validation. Includes schema documentation, lineage tracking, and integration with data catalogs for governance and compliance.",
                      icon: FileText
                    },
                    {
                      id: "stream-processing",
                      title: "Stream Processing Framework",
                      description: "Kafka Streams and KSQL for real-time data processing and transformation",
                      details: "Real-time stream processing with stateful operations, windowing, joins, and aggregations. Includes pre-built processing templates, exactly-once semantics, and integration with external systems for enrichment and output. Supports both code-based and SQL-based processing.",
                      icon: TrendingUp
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Mobile Backend Services Solutions
                if (build.id === "mobile-backend-deployment") {
                  const solutions = [
                    {
                      id: "api-backend",
                      title: "Serverless API Backend",
                      description: "AWS Lambda-based API with API Gateway, authentication, and database integration",
                      details: "Scalable serverless backend with automatic scaling, pay-per-use pricing, and zero server management. Includes RESTful API endpoints, GraphQL support, request validation, and integration with DynamoDB for data persistence. Built-in CORS, throttling, and caching.",
                      icon: Cloud
                    },
                    {
                      id: "push-notifications",
                      title: "Push Notification Service",
                      description: "Multi-platform push notifications with targeting, scheduling, and analytics",
                      details: "Unified push notification system supporting iOS (APNs), Android (FCM), and web push. Includes user segmentation, A/B testing, scheduled campaigns, rich media support, and delivery analytics with open rates and conversion tracking.",
                      icon: Activity
                    },
                    {
                      id: "offline-sync",
                      title: "Offline Data Sync Engine",
                      description: "Automatic data synchronization with conflict resolution and offline-first architecture",
                      details: "Robust offline-first solution with automatic background sync, conflict resolution strategies, and delta synchronization for bandwidth efficiency. Includes local caching, queue management for failed requests, and real-time sync status monitoring.",
                      icon: RefreshCw
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Service Mesh Deployment Solutions
                if (build.id === "service-mesh-deployment") {
                  const solutions = [
                    {
                      id: "istio-installation",
                      title: "Istio Service Mesh Package",
                      description: "Complete Istio installation with control plane, data plane, and observability tools",
                      details: "Production-ready Istio deployment with automatic sidecar injection, traffic management policies, and security configurations. Includes Envoy proxy configuration, mutual TLS setup, and integration with monitoring tools for service-level metrics and distributed tracing.",
                      icon: Shield
                    },
                    {
                      id: "traffic-management",
                      title: "Advanced Traffic Management",
                      description: "Canary deployments, A/B testing, and circuit breaker patterns pre-configured",
                      details: "Sophisticated traffic routing with percentage-based traffic splitting, header-based routing, and fault injection for chaos testing. Includes circuit breaker configurations, retry policies, timeout management, and traffic mirroring for safe production testing.",
                      icon: TrendingUp
                    },
                    {
                      id: "security-policies",
                      title: "Zero-Trust Security Bundle",
                      description: "mTLS, authorization policies, and service-to-service authentication ready to deploy",
                      details: "Comprehensive security layer with automatic mutual TLS between services, fine-grained authorization policies, and JWT validation. Includes certificate management, identity federation, and security policy templates for common use cases with audit logging.",
                      icon: Shield
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Machine Learning Platform Setup Solutions
                if (build.id === "ml-platform-setup") {
                  const solutions = [
                    {
                      id: "mlops-pipeline",
                      title: "MLOps Pipeline Framework",
                      description: "End-to-end ML pipeline with training, validation, and deployment automation",
                      details: "Complete MLOps workflow with automated model training, hyperparameter tuning, and model versioning. Includes experiment tracking, model registry, A/B testing framework, and automated retraining pipelines with data drift detection and model performance monitoring.",
                      icon: Activity
                    },
                    {
                      id: "feature-store",
                      title: "Feature Store Platform",
                      description: "Centralized feature repository with versioning, lineage, and serving capabilities",
                      details: "Enterprise feature store with online and offline serving, feature versioning, and automatic feature computation. Includes feature discovery, lineage tracking, point-in-time correctness, and integration with popular ML frameworks for seamless feature engineering.",
                      icon: BarChart3
                    },
                    {
                      id: "model-serving",
                      title: "Model Serving Infrastructure",
                      description: "Scalable model deployment with REST APIs, batch inference, and monitoring",
                      details: "Production-grade model serving with auto-scaling, multi-model deployment, and canary releases. Includes REST and gRPC APIs, batch prediction pipelines, model performance monitoring, and explainability tools for regulatory compliance and debugging.",
                      icon: Cloud
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Digital Workplace Hub Solutions
                if (build.id === "collaboration-platform-deploy") {
                  const solutions = [
                    {
                      id: "teams-setup",
                      title: "Microsoft Teams Enterprise Setup",
                      description: "Pre-configured Teams with channels, policies, and governance controls",
                      details: "Complete Teams deployment with organizational structure, team templates, naming policies, and retention settings. Includes guest access configuration, meeting policies, app governance, and integration with SharePoint and OneDrive for seamless collaboration.",
                      icon: Users
                    },
                    {
                      id: "sharepoint-intranet",
                      title: "SharePoint Intranet Portal",
                      description: "Modern intranet with document management, workflows, and search capabilities",
                      details: "Enterprise intranet with responsive design, content management, and automated workflows. Includes document libraries with version control, metadata management, enterprise search, and integration with Power Automate for business process automation.",
                      icon: FileText
                    },
                    {
                      id: "power-platform",
                      title: "Power Platform Suite",
                      description: "Power Apps, Power Automate, and Power BI for low-code automation and analytics",
                      details: "Citizen developer platform with pre-built app templates, workflow automation, and business intelligence dashboards. Includes data connectors, approval workflows, mobile apps, and governance policies for enterprise-grade low-code development.",
                      icon: Activity
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Zero Trust Security Implementation Solutions
                if (build.id === "zero-trust-implementation") {
                  const solutions = [
                    {
                      id: "identity-verification",
                      title: "Continuous Identity Verification",
                      description: "Real-time identity verification with risk-based authentication and device trust",
                      details: "Advanced identity verification with continuous authentication, behavioral biometrics, and device fingerprinting. Includes risk scoring engine, anomaly detection, and adaptive access policies that adjust based on user behavior, location, and device posture.",
                      icon: Shield
                    },
                    {
                      id: "microsegmentation",
                      title: "Network Microsegmentation",
                      description: "Software-defined perimeter with granular network segmentation and access controls",
                      details: "Zero-trust network architecture with application-level segmentation, east-west traffic control, and least-privilege access. Includes automated policy generation, network visualization, and integration with SIEM for security monitoring and threat detection.",
                      icon: Shield
                    },
                    {
                      id: "data-protection",
                      title: "Data-Centric Security Bundle",
                      description: "Encryption, DLP, and data classification with automated policy enforcement",
                      details: "Comprehensive data protection with end-to-end encryption, data loss prevention, and automatic classification. Includes sensitive data discovery, access logging, watermarking, and rights management with real-time policy enforcement across all endpoints and cloud services.",
                      icon: Shield
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Conversational AI Platform Solutions
                if (build.id === "chatbot-platform-build") {
                  const solutions = [
                    {
                      id: "nlp-engine",
                      title: "Natural Language Processing Engine",
                      description: "Advanced NLP with intent recognition, entity extraction, and sentiment analysis",
                      details: "State-of-the-art NLP engine with multi-language support, context awareness, and custom entity training. Includes pre-trained models for common use cases, continuous learning from conversations, and integration with knowledge bases for accurate responses.",
                      icon: Brain
                    },
                    {
                      id: "dialog-management",
                      title: "Dialog Management System",
                      description: "Conversational flow builder with context handling and multi-turn conversations",
                      details: "Visual dialog designer with drag-and-drop interface, conditional logic, and slot filling. Includes context management across sessions, fallback handling, human handoff triggers, and A/B testing for conversation optimization with analytics.",
                      icon: Activity
                    },
                    {
                      id: "omnichannel-integration",
                      title: "Omnichannel Integration Package",
                      description: "Multi-channel deployment for web, mobile, messaging apps, and voice assistants",
                      details: "Unified chatbot deployment across web chat, mobile apps, WhatsApp, Facebook Messenger, Slack, and voice platforms. Includes channel-specific optimizations, rich media support, conversation history sync, and centralized analytics dashboard.",
                      icon: Users
                    }
                  ];

                  return (
                    <div className="p-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                            {build.solutionType}
                          </Badge>
                          <Code className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                        <p className="text-gray-600 mb-6">{build.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                          </div>
                          <div>
                            <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                            <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                          </div>
                        </div>
                      </div>

                      {/* Solutions Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-lg font-semibold text-gray-900">Available Solutions</h4>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Request All
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          {solutions.map((solution) => {
                            const Icon = solution.icon;
                            return (
                              <div key={solution.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-orange-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h5>
                                    <p className="text-sm text-gray-600 mb-3">{solution.description}</p>
                                    <p className="text-sm text-gray-500 leading-relaxed">{solution.details}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end">
                                  <Button size="sm" variant="outline">
                                    Request Resource
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Default view for other solutions
                return (
                  <div className="p-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className={`${colors.bg} ${colors.text} ${colors.border} border font-semibold`} variant="outline">
                          {build.solutionType}
                        </Badge>
                        <Code className="w-5 h-5 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{build.title}</h3>
                      <p className="text-gray-600 mb-6">{build.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Complexity</dt>
                          <dd className="text-sm text-gray-900 font-medium capitalize">{build.buildComplexity}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Automation</dt>
                          <dd className="text-sm text-gray-900 font-medium capitalize">{build.automationLevel.replace('-', ' ')}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Code Samples</dt>
                          <dd className="text-sm text-gray-900 font-medium">{build.codeSamples ? 'Available' : 'Not Available'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold text-gray-500 uppercase mb-2">Author</dt>
                          <dd className="text-sm text-gray-900 font-medium">{build.author}</dd>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <dt className="text-xs font-semibold text-gray-500 uppercase mb-3">Technology Stack</dt>
                        <dd className="flex flex-wrap gap-2">
                          {build.technologyStack.map((tech) => (
                            <span key={tech} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {tech}
                            </span>
                          ))}
                        </dd>
                      </div>
                      
                      <div>
                        <dt className="text-xs font-semibold text-gray-500 uppercase mb-3">Tags</dt>
                        <dd className="flex flex-wrap gap-2">
                          {build.tags.map((tag) => (
                            <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-lg text-xs font-medium">
                              {tag}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : activeService === "Digital Intelligence" ? (
            <div className="h-full">
              {activeIntelligenceTab === "overview" && <IntelligenceOverviewPage />}
              {activeIntelligenceTab === "services" && !routeIntelligenceItemId && (
                <IntelligenceServicesPage />
              )}
              {activeIntelligenceTab === "services" && !!routeIntelligenceItemId && (
                <ServiceDashboardPage serviceId={routeIntelligenceItemId} />
              )}
              {activeIntelligenceTab === "my-dashboards" && <MyDashboardsPage />}
              {activeIntelligenceTab === "requests" && !routeIntelligenceItemId && (
                <IntelligenceMyRequestsPage />
              )}
              {activeIntelligenceTab === "requests" && !!routeIntelligenceItemId && (
                <IntelligenceRequestDetailPage />
              )}
            </div>
          ) : activeService === "Support Services" && activeSubService ? (
            <div className="h-full">
              {renderSupportWorkspace()}
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {activeService} Interface
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {activeService === "Overview" ? 
                      "Welcome to the DTMP Service Hub" :
                      activeService === "Learning Center" ?
                      (viewMode === "admin"
                        ? "Select a course from the sidebar to monitor course analytics and progress"
                        : "Select a course from the sidebar to view details and continue learning") :
                      activeService === "Lifecycle Management" ?
                      "Select a lifecycle service from the sidebar to get started" :
                      activeService === "Solution Build" ?
                      "Select a solution build from the sidebar to view details and deployment guides" :
                      activeService === "Digital Intelligence" ?
                      "Select an intelligence service from the sidebar to view AI-powered dashboards" :
                      activeService === "Support Services" ?
                      "Select a support service from the sidebar to get started" :
                      `${activeService} tools and interfaces would be displayed here`
                    }
                  </p>
                  {activeService === "Portfolio Management" && (
                    <p className="text-sm text-gray-400">
                      Select a portfolio service from the sidebar to get started
                    </p>
                  )}
                  {activeService === "Learning Center" && (
                    <p className="text-sm text-gray-400">
                      {viewMode === "admin"
                        ? "Switch profile to User View to preview learner experience"
                        : "Select a course from the sidebar to get started"}
                    </p>
                  )}
                  {activeService === "Lifecycle Management" && (
                    <p className="text-sm text-gray-400">
                      Select a lifecycle service from the sidebar to get started
                    </p>
                  )}
                  {activeService === "Solution Build" && (
                    <p className="text-sm text-gray-400">
                      Select a solution build from the sidebar to get started
                    </p>
                  )}
                  {activeService === "Digital Intelligence" && (
                    <p className="text-sm text-gray-400">
                      Select an intelligence service from the sidebar to get started
                    </p>
                  )}
                  {activeService === "Support Services" && (
                    <p className="text-sm text-gray-400">
                      Select a support service from the sidebar to get started
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* My Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Requests</h2>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {mockRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{request.resourceName}</h3>
                        <p className="text-sm text-gray-600">{request.solutionBuild}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <dt className="text-gray-500 mb-1">Request ID</dt>
                        <dd className="font-medium text-gray-900">{request.id}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500 mb-1">Request Date</dt>
                        <dd className="font-medium text-gray-900">{request.requestDate}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500 mb-1">Est. Delivery</dt>
                        <dd className="font-medium text-gray-900">{request.estimatedDelivery}</dd>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button onClick={() => setShowRequestsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
