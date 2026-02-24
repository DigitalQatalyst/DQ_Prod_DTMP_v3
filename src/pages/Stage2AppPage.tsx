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
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const { courseId: routeCourseId, view: routeView, tab: routeKnowledgeTab } = useParams<{
    courseId?: string;
    view?: string;
    tab?: string;
  }>();
  const state = (location.state as LocationState) ?? EMPTY_LOCATION_STATE;

  const isLearningCenterRoute =
    !!routeCourseId && (routeView === "user" || routeView === "admin");
  const isKnowledgeCenterRoute = location.pathname.startsWith("/stage2/knowledge");
  const isPortfolioCenterRoute = location.pathname.startsWith("/stage2/portfolio-management");
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
      case "blueprints":
        return "Design Blueprints";
      case "templates":
        return "AI DocWriter";
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
  const [activeSubService, setActiveSubService] = useState<string | null>(null);
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
    if (activeService !== "Knowledge Center") return;
    refreshKnowledgeState();
  }, [activeService, activeKnowledgeTab]);

  useEffect(() => {
    setActiveLearningUserTab("overview");
    setActiveLearningAdminTab("overview");
  }, [activeSubService, viewMode]);

  // Collapsible sidebar states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

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
              onClick={() => handleServiceClick("Design Blueprints")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Design Blueprints")}`}
              title="Design Blueprints"
            >
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Design Blueprints"}
            </button>
            
            <button 
              onClick={() => handleServiceClick("Deploy Blueprints")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Deploy Blueprints")}`}
              title="Deploy Blueprints"
            >
              <Rocket className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Deploy Blueprints"}
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
                      : `${activeService} • Service Hub`)
                    : `${activeService} • Service Hub`
                  }
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
