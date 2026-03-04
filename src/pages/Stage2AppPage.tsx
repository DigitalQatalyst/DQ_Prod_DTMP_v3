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
  ClipboardList,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertCircle,
  MessageSquare,
  Download,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { applicationPortfolio, projectPortfolio } from "@/data/portfolio";
import PortfolioHealthDashboard from "@/components/portfolio/PortfolioHealthDashboard";
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
import type { CourseSettings } from "@/data/learningCenter/stage2/types";
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
  addTORequest,
  getTORequests,
  updateTORequestStatus,
  type TORequest,
  type TORequestStatus,
} from "@/data/knowledgeCenter/requestState";
import { addLearningTORequest } from "@/data/learningCenter/requestState";
import {
  attachStage3RequestToLearningChange,
  buildLearningSettingDiffs,
  getLearningDraftChangeSetByCourse,
  submitLearningDraftChangeSet,
  upsertLearningDraftChangeSet,
} from "@/data/learningCenter/changeReviewState";
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
  type PortfolioWorkspaceTab,
} from "@/components/stage2/portfolio/PortfolioWorkspacePanels";
import {
  SpecsWorkspaceMain,
  SpecsWorkspaceSidebar,
  type SpecsWorkspaceTab,
} from "@/components/stage2/specs/SpecsWorkspacePanels";
import {
  BuildWorkspaceMain,
  BuildWorkspaceSidebar,
} from "@/components/stage2/build/BuildWorkspacePanels";
import { CourseDetailView } from "@/components/learning";
import LifecycleOverview from "./lifecycle/LifecycleOverview";
import TemplatesLibrary from "./lifecycle/TemplatesLibrary";
import ApprovalsPage from "./lifecycle/ApprovalsPage";
import ProjectsPage from "./lifecycle/ProjectsPage";
import ApplicationsPage from "./lifecycle/ApplicationsPage";
import { buildRequests, type BuildRequest, deliveryTeams } from "@/data/solutionBuild";
import { Progress } from "@/components/ui/progress";
import IntelligenceWorkspacePage from "@/pages/stage2/intelligence/IntelligenceWorkspacePage";
import { supportTickets, serviceRequests, knowledgeArticles, ServiceRequest } from "@/data/supportData";
import { technicalSupport, expertConsultancy } from "@/data/supportServices";
import { getSupportServiceDetail } from "@/data/supportServices/detailsSupport";
import { PriorityBadge, SLATimer } from "@/components/stage2";
import { Tag, Calendar, Clock as ClockIcon, Eye } from "lucide-react";
import { createStage3Request } from "@/data/stage3";
import { useSupportWorkspace } from "@/hooks/useSupportWorkspace";
import { SupportWorkspaceSidebar } from "@/components/stage2/support/SupportWorkspaceSidebar";
import { SupportWorkspacePanels } from "@/components/stage2/support/SupportWorkspacePanels";
import { intelligenceServices } from "@/data/digitalIntelligence/stage2/intelligenceServices";
import DigitalIntelligenceDashboardPage from "@/pages/DigitalIntelligenceDashboardPage";
import TemplatesOverview from "@/pages/stage2/templates/TemplatesOverview";
import TemplateLibraryPage from "@/pages/stage2/templates/TemplateLibraryPage";
import TemplateDetailPage from "@/pages/stage2/templates/TemplateDetailPage";
import NewRequestPage from "@/pages/stage2/templates/NewRequestPage";
import TemplatesMyRequestsPage from "@/pages/stage2/templates/MyRequestsPage";
import TemplatesRequestDetailPage from "@/pages/stage2/templates/RequestDetailPage";
import { getUserRequests, seedDemoRequests } from "@/data/requests/mockRequests";

interface LocationState {
  marketplace?: string;
  tab?: string;
  cardId?: string;
  serviceName?: string;
  action?: string;
  learningRole?: "learner" | "admin";
  commentText?: string;
  requestMessage?: string;
  sectionRef?: string;
  requestType?: string;
}
const EMPTY_LOCATION_STATE: LocationState = {};

type EnrolledCourse = (typeof enrolledCourses)[number];
type LearningUserTab = "overview" | "modules" | "progress" | "resources" | "certificate";
type LearningAdminTab = "overview" | "enrollments" | "performance" | "content" | "settings";
type TemplatesWorkspaceTab = "overview" | "library" | "new-request" | "my-requests";
const isPortfolioWorkspaceTab = (value: string | undefined): value is PortfolioWorkspaceTab =>
  value === "overview" || value === "my-requests" || value === "my-assets";

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
        marketplace === "solution-build") &&
      cardId
    ) {
      return cardId;
    }
    if (marketplace === "digital-intelligence") {
      return "di-overview";
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
    if (location.pathname.startsWith("/stage2/specs/my-requests")) return "my-requests";
    return "overview";
  };
  const [activeSpecsTab, setActiveSpecsTab] = useState<SpecsWorkspaceTab>(
    getSpecsTabFromPath()
  );
  const [activePortfolioTab, setActivePortfolioTab] = useState<PortfolioWorkspaceTab>(
    isPortfolioWorkspaceTab(state.tab) ? state.tab : "overview"
  );
  const [portfolioUserRequests, setPortfolioUserRequests] = useState<ServiceRequest[]>([]);

  // Solution Build States
  const [sbSearchQuery, setSbSearchQuery] = useState("");
  const [activeBuildRequestId, setActiveBuildRequestId] = useState<string | null>(null);
  const [sbStatusFilter, setSbStatusFilter] = useState("all");
  const [sbPriorityFilter, setSbPriorityFilter] = useState("all");
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
      (marketplace === "portfolio-management" ||
        marketplace === "learning-center") &&
      cardId
    ) {
      setActiveSubService(cardId);
      return;
    }

    if (marketplace === "digital-intelligence" && !cardId) {
      setActiveSubService("di-overview");
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
    const requestType =
      state.action === "post-comment"
        ? "collaboration"
        : state.requestType === "outdated-section"
          ? "outdated-section"
          : "clarification";
    const isClarification = requestType === "clarification";
    const isOutdated = requestType === "outdated-section";
    const userMessage =
      state.requestMessage?.trim() ||
      state.commentText?.trim() ||
      (isOutdated
        ? `Outdated content reported for "${resourceTitle}".`
        : isClarification
          ? `Clarification requested for "${resourceTitle}".`
          : `Collaboration follow-up requested for "${resourceTitle}".`);
    const sectionRef = state.sectionRef?.trim() || state.tab || "library";

    const knowledgeRequest = addTORequest({
      itemId: `${state.tab || "library"}:${state.cardId || "unknown-resource"}`,
      requesterName: knowledgeCurrentUserName,
      requesterRole: "Portfolio Manager",
      type: requestType,
      message: userMessage,
      sectionRef,
    });

    createStage3Request({
      type: "knowledge-center",
      title: isOutdated
        ? `Knowledge Outdated Section: ${resourceTitle}`
        : isClarification
          ? `Knowledge Clarification: ${resourceTitle}`
          : `Knowledge Collaboration Follow-up: ${resourceTitle}`,
      description: isOutdated
        ? `Escalated from Stage 2 Knowledge action. Outdated-section report for "${resourceTitle}". User message: "${userMessage}"`
        : isClarification
          ? `Escalated from Stage 2 Knowledge action. Clarification requested for "${resourceTitle}". User message: "${userMessage}"`
          : `Escalated from Stage 2 Knowledge action. Comment/collaboration follow-up for "${resourceTitle}". User message: "${userMessage}"`,
      requester: {
        name: "John Doe",
        email: "john.doe@dtmp.local",
        department: "Portfolio Management",
        organization: "DTMP",
      },
      priority: isClarification || isOutdated ? "medium" : "low",
      estimatedHours: isClarification || isOutdated ? 4 : 2,
      tags: [
        "knowledge",
        requestType,
        state.tab || "library",
        state.cardId || "unknown-resource",
      ],
      relatedAssets: knowledgeRequest ? [`knowledge-request:${knowledgeRequest.id}`] : [],
      notes: [
        `Source: Stage 2 Knowledge Workspace`,
        `Action: ${state.action}`,
        `Section: ${sectionRef}`,
        `User message: ${userMessage}`,
      ],
    });

    const {
      action: _unusedAction,
      commentText: _unusedCommentText,
      requestMessage: _unusedRequestMessage,
      sectionRef: _unusedSectionRef,
      requestType: _unusedRequestType,
      ...nextState
    } = state;
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
    if (routeIntelligenceTab === "services" && routeIntelligenceItemId) {
      setActiveSubService(routeIntelligenceItemId);
      return;
    }
    if (routeIntelligenceTab === "overview") {
      setActiveSubService("di-overview");
      return;
    }
    if (routeIntelligenceTab === "requests") {
      setActiveSubService("di-my-requests");
      return;
    }
    if (routeIntelligenceTab === "services" && !routeIntelligenceItemId) {
      setActiveSubService("di-overview");
      return;
    }
    setActiveSubService("di-overview");
  }, [isIntelligenceRoute, routeIntelligenceTab, routeIntelligenceItemId]);

  useEffect(() => {
    if (marketplace !== "portfolio-management") return;
    if (!isPortfolioWorkspaceTab(state.tab)) return;
    setActivePortfolioTab(state.tab);
  }, [marketplace, state.tab]);

  useEffect(() => {
    if (activeService !== "Knowledge Center") return;
    refreshKnowledgeState();
  }, [activeService, activeKnowledgeTab]);

  useEffect(() => {
    setActiveLearningUserTab("overview");
    setActiveLearningAdminTab("overview");
  }, [activeSubService, viewMode]);

  useEffect(() => {
    // Seed demo data for portfolio if empty
    const userId = 'user-123';
    const requests = getUserRequests(userId);
    if (requests.length === 0) {
      seedDemoRequests(userId);
      setPortfolioUserRequests(getUserRequests(userId));
    } else {
      setPortfolioUserRequests(requests);
    }
  }, []);

  const {
    knowledgeArticles: supportKnowledgeArticles,
    supportSelectedService,
    setSupportSelectedService,
    supportAttachments,
    setSupportAttachments,
    supportSelectedArticleId,
    setSupportSelectedArticleId,
    supportTicketsState,
    supportSubmitMessage,
    supportRequestsState,
    newRequestForm,
    setNewRequestForm,
    newRequestAttachments,
    setNewRequestAttachments,
    newRequestError,
    setNewRequestError,
    newRequestSuccess,
    setNewRequestSuccess,
    createTicketFromService,
    addNewRequestAttachments,
    removeNewRequestAttachment,
    submitNewSupportRequest,
  } = useSupportWorkspace({
    marketplace,
    cardId,
    submittedTicket: (location.state as { submittedTicket?: Parameters<typeof useSupportWorkspace>[0]["submittedTicket"] })?.submittedTicket,
    submittedRequest: (location.state as { submittedRequest?: Parameters<typeof useSupportWorkspace>[0]["submittedRequest"] })?.submittedRequest,
    onNavigateToTickets: () => setActiveSubService("support-tickets"),
  });

  // Collapsible sidebar states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [learningDraftSettingsByCourse, setLearningDraftSettingsByCourse] = useState<
    Record<string, CourseSettings>
  >({});
  const [learningDeleteIntentByCourse, setLearningDeleteIntentByCourse] = useState<
    Record<string, boolean>
  >({});
  const [learningEscalationMessage, setLearningEscalationMessage] = useState<string | null>(null);

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

  // Project Portfolio sub-services
  const projectSubServices = projectPortfolio.map(service => ({
    id: service.id,
    name: service.title,
    description: service.description,
    icon: getIconComponent(service.iconName),
    category: service.category,
    realtime: service.realtime,
    complexity: service.complexity
  }));

  // Learning Center sub-services - Role-scoped courses
  const learningSubServices = scopedLearningCourses.map(course => ({
    id: course.id,
    name: course.courseName,
    description: `${course.instructor} â€¢ ${course.duration} â€¢ ${course.progress}% complete`,
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
  const activeAdminBaseSettings = adminViewData.settings;
  const activeAdminDraftSettings = useMemo(() => {
    if (!selectedLearningCourse) return activeAdminBaseSettings;
    return learningDraftSettingsByCourse[selectedLearningCourse.id] ?? activeAdminBaseSettings;
  }, [selectedLearningCourse, learningDraftSettingsByCourse, activeAdminBaseSettings]);
  const activeAdminDeleteRequested = selectedLearningCourse
    ? Boolean(learningDeleteIntentByCourse[selectedLearningCourse.id])
    : false;
  const activeAdminPendingChangeCount = useMemo(() => {
    if (!selectedLearningCourse) return 0;
    return buildLearningSettingDiffs(activeAdminBaseSettings, activeAdminDraftSettings).length;
  }, [selectedLearningCourse, activeAdminBaseSettings, activeAdminDraftSettings]);
  const savedKnowledgeItems = useMemo(
    () =>
      savedKnowledgeIds
        .map((id) => knowledgeItems.find((item) => item.id === id))
        .filter((item): item is (typeof knowledgeItems)[number] => Boolean(item)),
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
      "my-requests": "/stage2/specs/my-requests",
    };
    navigate(pathByTab[tabId], {
      replace: true,
      state: {
        ...state,
        marketplace: "solution-specs",
      },
    });
  };
  const handlePortfolioTabClick = (tabId: PortfolioWorkspaceTab) => {
    setActivePortfolioTab(tabId);
    navigate("/stage2/portfolio-management", {
      replace: true,
      state: {
        ...state,
        marketplace: "portfolio-management",
        tab: tabId,
      },
    });
  };

  const filteredBuildRequests = useMemo(() => {
    let filtered = buildRequests.filter(
      (r) => r.requestedBy === "Sarah Johnson" || r.requestedBy === "Current User"
    );
    if (sbSearchQuery) {
      const q = sbSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    if (sbStatusFilter !== "all") filtered = filtered.filter((r) => r.status === sbStatusFilter);
    if (sbPriorityFilter !== "all") filtered = filtered.filter((r) => r.priority === sbPriorityFilter);

    return filtered;
  }, [sbSearchQuery, sbStatusFilter, sbPriorityFilter]);

  const selectedBuildRequest = useMemo(() =>
    buildRequests.find(r => r.id === activeBuildRequestId) || null
    , [activeBuildRequestId]);

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

  // Digital Intelligence Stage 2 workspace menu
  const intelligenceSubServices = [
    {
      id: "di-overview",
      name: "Overview",
      description: "Summary of all your requests",
      icon: BarChart3,
      category: "workspace",
      accuracy: " ",
      updateFrequency: " ",
    },
    {
      id: "di-my-requests",
      name: "My Requests",
      description: "Track status, SLAs & handlers",
      icon: FileText,
      category: "workspace",
      accuracy: " ",
      updateFrequency: " ",
    },
  ];

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
    if (service === "Learning Center") {
      const firstCourse = scopedLearningCourses[0];
      if (firstCourse) {
        navigate(`/stage2/learning-center/course/${firstCourse.id}/${viewMode}`, {
          replace: true,
          state: { ...state, marketplace: "learning-center", learningRole },
        });
        setActiveSubService(firstCourse.id);
      }
    }
    if (service === "Knowledge Center") {
      navigate(`/stage2/knowledge/${activeKnowledgeTab}`, {
        replace: true,
        state: { ...state, marketplace: "knowledge-center" },
      });
    }
    if (service === "AI DocWriter") {
      navigate("/stage2/templates/overview", {
        replace: true,
        state: { ...state, marketplace: "templates" },
      });
    }
    if (service === "Solutions Specs") {
      navigate("/stage2/specs/overview", {
        replace: true,
        state: { ...state, marketplace: "solution-specs" },
      });
    }
    if (service === "Portfolio Management") {
      navigate("/stage2/portfolio-management", {
        replace: true,
        state: { ...state, marketplace: "portfolio-management" },
      });
    }
    if (service === "Digital Intelligence") {
      navigate("/stage2/intelligence/overview", {
        replace: true,
        state: { ...state, marketplace: "digital-intelligence" },
      });
      setActiveSubService("di-overview");
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
      if (subServiceId === "di-overview") {
        navigate(`/stage2/intelligence/overview`, {
          replace: true,
          state: {
            ...state,
            marketplace: "digital-intelligence",
          },
        });
        return;
      }
      if (subServiceId === "di-my-requests") {
        navigate(`/stage2/intelligence/requests`, {
          replace: true,
          state: {
            ...state,
            marketplace: "digital-intelligence",
          },
        });
        return;
      }
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

    const baseSettings = adminViewData.settings;
    const draftSettings =
      learningDraftSettingsByCourse[selectedLearningCourse.id] ?? baseSettings;
    const deleteRequested = Boolean(learningDeleteIntentByCourse[selectedLearningCourse.id]);
    const diffs = buildLearningSettingDiffs(baseSettings, draftSettings);

    if (diffs.length === 0 && !deleteRequested) {
      setLearningEscalationMessage("No pending settings changes to submit.");
      return;
    }

    const draftSet = upsertLearningDraftChangeSet({
      courseId: selectedLearningCourse.id,
      courseName: selectedLearningCourse.courseName,
      requestedBy: "Amina TO",
      settingsBefore: baseSettings,
      settingsAfter: draftSettings,
      deleteRequested,
    });

    const submittedSet = submitLearningDraftChangeSet(draftSet.id);
    if (!submittedSet) return;

    const learningRequest = addLearningTORequest({
      courseId: selectedLearningCourse.id,
      courseName: selectedLearningCourse.courseName,
      requesterName: "Amina TO",
      requesterRole: "Admin",
      message: `Review requested for ${selectedLearningCourse.courseName}: ${diffs.length} field change(s)${deleteRequested ? " and delete request" : ""
        }.`,
    });

    const created = createStage3Request({
      type: "learning-center",
      title: `Learning Ops: ${selectedLearningCourse.courseName}`,
      description:
        `Escalated from Stage 2 Learning Admin for operational follow-up. ` +
        `Course: ${selectedLearningCourse.courseName}. ` +
        `Proposed changes: ${diffs.length}${deleteRequested ? " + delete request" : ""}.`,
      requester: {
        name: "Amina TO",
        email: "amina.to@dtmp.local",
        department: "Transformation Office",
        organization: "DTMP",
      },
      priority: "medium",
      estimatedHours: 6,
      tags: ["learning", "stage2-admin", selectedLearningCourse.id],
      relatedAssets: [
        ...(learningRequest ? [`learning-request:${learningRequest.id}`] : []),
        `learning-change:${submittedSet.id}`,
      ],
      notes: [
        "Created from Learning Stage 2 admin view.",
        ...diffs.slice(0, 12).map(
          (diff) => `CHANGE | ${diff.label}: "${diff.before}" -> "${diff.after}"`
        ),
        ...(deleteRequested ? ["CHANGE | Course Deletion Requested: Yes"] : []),
      ],
    });

    attachStage3RequestToLearningChange(submittedSet.id, created.id);

    navigate("/stage3/new", {
      state: {
        fromStage2: true,
        requestId: created.id,
      },
    });
    setLearningEscalationMessage(
      `Submitted ${diffs.length} change(s)${deleteRequested ? " + delete request" : ""
      } to TO Ops.`
    );
  };
  const handleAdminDraftSettingsChange = (next: CourseSettings) => {
    if (!selectedLearningCourse) return;
    setLearningDraftSettingsByCourse((prev) => ({
      ...prev,
      [selectedLearningCourse.id]: next,
    }));
    upsertLearningDraftChangeSet({
      courseId: selectedLearningCourse.id,
      courseName: selectedLearningCourse.courseName,
      requestedBy: "Amina TO",
      settingsBefore: adminViewData.settings,
      settingsAfter: next,
      deleteRequested: Boolean(learningDeleteIntentByCourse[selectedLearningCourse.id]),
    });
  };
  const handleAdminDeleteRequestedChange = (value: boolean) => {
    if (!selectedLearningCourse) return;
    setLearningDeleteIntentByCourse((prev) => ({
      ...prev,
      [selectedLearningCourse.id]: value,
    }));
    const nextDraft =
      learningDraftSettingsByCourse[selectedLearningCourse.id] ?? adminViewData.settings;
    upsertLearningDraftChangeSet({
      courseId: selectedLearningCourse.id,
      courseName: selectedLearningCourse.courseName,
      requestedBy: "Amina TO",
      settingsBefore: adminViewData.settings,
      settingsAfter: nextDraft,
      deleteRequested: value,
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
    if (activeSubService !== "support-detail") {
      // leaving detail view but keep selection for navigation purposes
    }
    if (activeSubService !== "support-knowledge-detail") {
      setSupportSelectedArticleId(null);
    }
  };

  const renderSupportWorkspace = () => (
    <SupportWorkspacePanels
      activeService={activeService}
      activeSubService={activeSubService}
      supportSelectedService={supportSelectedService}
      supportSubmitMessage={supportSubmitMessage}
      createTicketFromService={createTicketFromService}
      supportAttachments={supportAttachments}
      setSupportAttachments={setSupportAttachments}
      supportTicketsState={supportTicketsState}
      supportRequestsState={supportRequestsState}
      newRequestError={newRequestError}
      newRequestSuccess={newRequestSuccess}
      setActiveSubService={setActiveSubService}
      newRequestForm={newRequestForm}
      setNewRequestForm={setNewRequestForm}
      newRequestAttachments={newRequestAttachments}
      setNewRequestAttachments={setNewRequestAttachments}
      setNewRequestError={setNewRequestError}
      addNewRequestAttachments={addNewRequestAttachments}
      removeNewRequestAttachment={removeNewRequestAttachment}
      submitNewSupportRequest={submitNewSupportRequest}
      knowledgeArticles={supportKnowledgeArticles}
      supportSelectedArticleId={supportSelectedArticleId}
      setSupportSelectedArticleId={setSupportSelectedArticleId}
    />
  );


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
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${viewMode === "user" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700"
                  }`}
              >
                Amina TO - Learner View
              </button>
              <button
                type="button"
                onClick={() => handleProfileSwitch("admin")}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${viewMode === "admin" ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-700"
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
                  activeTab={activePortfolioTab}
                  onTabChange={handlePortfolioTabClick}
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
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeTemplatesTab === "overview"
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
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeTemplatesTab === "library"
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
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeTemplatesTab === "new-request"
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
                    className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeTemplatesTab === "my-requests"
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
                <SpecsWorkspaceSidebar
                  activeTab={activeSpecsTab}
                  onTabChange={handleSpecsTabClick}
                />
              ) : activeService === "Solution Build" ? (
                <BuildWorkspaceSidebar
                  requests={filteredBuildRequests}
                  activeRequestId={activeBuildRequestId}
                  onSelectRequest={setActiveBuildRequestId}
                  searchQuery={sbSearchQuery}
                  setSearchQuery={setSbSearchQuery}
                  statusFilter={sbStatusFilter}
                  setStatusFilter={setSbStatusFilter}
                  priorityFilter={sbPriorityFilter}
                  setPriorityFilter={setSbPriorityFilter}
                />
              ) : activeService === "Lifecycle Management" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Lifecycle Services</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleSubServiceClick('overview')}
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeSubService === 'overview'
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
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeSubService === 'projects'
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
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeSubService === 'applications'
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
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeSubService === 'templates'
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
                        className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeSubService === 'approvals'
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
              ) : activeService === "Digital Intelligence" ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Dashboard</h3>
                    <div className="space-y-2">
                      {intelligenceSubServices.map((service) => {
                        const Icon = service.icon;
                        return (
                          <button
                            key={service.id}
                            onClick={() => handleSubServiceClick(service.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${activeSubService === service.id
                              ? "bg-orange-50 text-orange-700 border border-orange-200"
                              : "text-gray-700 hover:bg-gray-50 border border-transparent"
                              }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-600" />
                            <div className="text-left flex-1">
                              <div className="font-medium">{service.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{service.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : activeService === "Support Services" ? (
                <SupportWorkspaceSidebar
                  supportSubServices={supportSubServices}
                  activeSubService={activeSubService}
                  onSelectSubService={handleSubServiceClick}
                />
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
                  {activeService === "Portfolio Management" && activePortfolioTab === "my-requests"
                    ? "My Assessment Requests"
                    : activeService === "Portfolio Management" && activePortfolioTab === "my-assets"
                      ? "My Managed Assets"
                      : activeSubService ?
                        (activeService === "Portfolio Management"
                          ? (portfolioSubServices.find(s => s.id === activeSubService)?.name ||
                            projectSubServices.find(s => s.id === activeSubService)?.name)
                          : activeService === "Learning Center"
                            ? learningSubServices.find(s => s.id === activeSubService)?.name
                            : activeService === "Lifecycle Management"
                              ? activeSubService.charAt(0).toUpperCase() + activeSubService.slice(1)
                              : activeService === "Digital Intelligence"
                                ? intelligenceSubServices.find(s => s.id === activeSubService)?.name
                                : activeService === "Support Services"
                                  ? supportSubServices.find(s => s.id === activeSubService)?.name
                                  : activeService)
                        : activeService
                  }
                </h2>
                <p className="text-sm text-gray-500">
                  {activeService === "Portfolio Management" && activePortfolioTab === "my-requests"
                    ? "Track and review requests submitted from Stage 1."
                    : activeService === "Portfolio Management" && activePortfolioTab === "my-assets"
                      ? "Applications and projects under your direct responsibility."
                      : activeSubService ?
                        (activeService === "Portfolio Management"
                          ? (portfolioSubServices.find(s => s.id === activeSubService)?.description ||
                            projectSubServices.find(s => s.id === activeSubService)?.description)
                          : activeService === "Learning Center"
                            ? learningSubServices.find(s => s.id === activeSubService)?.description
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
            </div>
          </div>
          {activeService === "Learning Center" && viewMode === "admin" && learningEscalationMessage && (
            <p className="text-xs text-gray-600 mt-2">{learningEscalationMessage}</p>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {activeService === "Portfolio Management" ? (
            <PortfolioWorkspaceMain
              activeTab={activePortfolioTab}
              activeSubService={activeSubService || "portfolio-health-dashboard"}
              portfolioSubServices={portfolioSubServices}
              userRequests={portfolioUserRequests}
              onTabChange={handlePortfolioTabClick}
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
              adminDraftSettings={activeAdminDraftSettings}
              onAdminDraftSettingsChange={handleAdminDraftSettingsChange}
              adminDeleteRequested={activeAdminDeleteRequested}
              onAdminDeleteRequestedChange={handleAdminDeleteRequestedChange}
              adminPendingChangeCount={activeAdminPendingChangeCount}
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
              {activeTemplatesTab === "my-requests" && !routeRequestId && <TemplatesMyRequestsPage />}
              {activeTemplatesTab === "my-requests" && !!routeRequestId && (
                <TemplatesRequestDetailPage />
              )}
            </div>
          ) : activeService === "Solutions Specs" ? (
            <SpecsWorkspaceMain
              activeTab={activeSpecsTab}
            />
          ) : activeService === "Lifecycle Management" && activeSubService ? (
            <div className="h-full">
              {activeSubService === 'overview' && <LifecycleOverview />}
              {activeSubService === 'projects' && <ProjectsPage />}
              {activeSubService === 'applications' && <ApplicationsPage />}
              {activeSubService === 'templates' && <TemplatesLibrary />}
              {activeSubService === 'approvals' && <ApprovalsPage />}
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
          ) : activeService === "Solution Build" ? (
            <BuildWorkspaceMain
              selectedRequest={selectedBuildRequest}
            />
          ) : activeService === "Digital Intelligence" ? (
            <IntelligenceWorkspacePage activeSubService={activeSubService} />
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
        </div >
      </div >

    </div >
  );
}


