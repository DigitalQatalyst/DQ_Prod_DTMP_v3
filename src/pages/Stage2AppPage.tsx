import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import PortfolioHealthDashboard from "@/components/portfolio/PortfolioHealthDashboard";
import { enrolledCourses } from "@/data/learning";
import { CourseDetailView } from "@/components/learning";
import LifecycleOverview from "./lifecycle/LifecycleOverview";
import TemplatesLibrary from "./lifecycle/TemplatesLibrary";
import ApprovalsPage from "./lifecycle/ApprovalsPage";
import ProjectsPage from "./lifecycle/ProjectsPage";
import ApplicationsPage from "./lifecycle/ApplicationsPage";
import { solutionBuilds } from "@/data/blueprints/solutionBuilds";
import type { SolutionType } from "@/data/blueprints/solutionSpecs";
import { intelligenceServices } from "@/data/digitalIntelligence/stage2";
import { ServiceDashboardPage } from "@/pages/stage2/intelligence";
import { supportTickets, serviceRequests, knowledgeArticles, ServiceRequest } from "@/data/supportData";
import { technicalSupport, expertConsultancy } from "@/data/supportServices";
import { getSupportServiceDetail } from "@/data/supportServices/detailsSupport";
import { PriorityBadge, SLATimer } from "@/components/stage2";
import { Tag, Calendar, Clock as ClockIcon, Eye } from "lucide-react";

interface LocationState {
  marketplace?: string;
  tab?: string;
  cardId?: string;
  serviceName?: string;
  action?: string;
}

export default function Stage2AppPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) || {};
  
  const {
    marketplace = "portfolio-management",
    cardId = "portfolio-dashboard",
    serviceName = "Portfolio Service",
  } = state;

  const marketplaceLabel = marketplace
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // State for navigation
  const [activeService, setActiveService] = useState(() => {
    switch (marketplace) {
      case "portfolio-management":
        return "Portfolio Management";
      case "learning-center":
        return "Learning Center";
      case "support-services":
        return "Support Services";
      case "blueprints":
        return "Design Blueprints";
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
  });
  
  const [activeSubService, setActiveSubService] = useState<string | null>(() => {
    // Auto-select the specific service if coming from a marketplace card
    if ((marketplace === "portfolio-management" || marketplace === "learning-center" || marketplace === "lifecycle-management" || marketplace === "solution-build" || marketplace === "digital-intelligence") && cardId) {
      return cardId;
    }
    if (marketplace === "support-services") {
      return cardId ? "support-detail" : "support-overview";
    }
    return null;
  });
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

  // Learning Center sub-services - Use actual enrolled courses
  const learningSubServices = enrolledCourses.map(course => ({
    id: course.id,
    name: course.courseName,
    description: `${course.instructor} • ${course.duration} • ${course.progress}% complete`,
    icon: BookOpen,
    category: course.difficulty,
    status: course.status,
    progress: course.progress
  }));

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
    if (service !== "Support Services") {
      setSupportSelectedService(null);
      setSupportSelectedArticleId(null);
    }
  };

  const handleSubServiceClick = (subServiceId: string) => {
    setActiveSubService(subServiceId);
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
            
            {/* Solutions Specs with sub-items */}
            {!leftSidebarCollapsed && activeService === "Solutions Specs" && (
              <div className="ml-4 space-y-1 mb-2">
                <button
                  onClick={() => navigate('/stage2/specs/overview')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  Architecture Library
                </button>
                <button
                  onClick={() => navigate('/stage2/specs/templates')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  Design Templates
                </button>
                <button
                  onClick={() => navigate('/stage2/specs/patterns')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  Design Patterns
                </button>
                <button
                  onClick={() => navigate('/stage2/specs/my-designs')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  My Designs
                </button>
              </div>
            )}
            
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
              onClick={() => handleServiceClick("Design Blueprints")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService("Design Blueprints")}`}
              title="Design Blueprints"
            >
              <LayoutGrid className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && "Design Blueprints"}
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
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className={`flex items-center gap-3 mb-3 ${leftSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-orange-700 text-xs font-medium">JD</span>
            </div>
            {!leftSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-gray-500">Portfolio Manager</p>
              </div>
            )}
          </div>
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
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Portfolio Tools</h3>
                    <div className="space-y-2">
                      {portfolioSubServices.map((subService) => {
                        const Icon = subService.icon;
                        return (
                          <button
                            key={subService.id}
                            onClick={() => handleSubServiceClick(subService.id)}
                            className={`w-full flex items-start gap-3 p-3 text-sm rounded-lg transition-colors ${
                              activeSubService === subService.id 
                                ? "bg-orange-50 text-orange-700 border border-orange-200" 
                                : "text-gray-700 hover:bg-gray-50 border border-transparent"
                            }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">{subService.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{subService.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => setShowRequestsModal(true)}>
              <FileText className="w-4 h-4 mr-2" />
              My Requests
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {activeService === "Lifecycle Management" && activeSubService ? (
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
          ) : activeService === "Digital Intelligence" && activeSubService ? (
            <div className="h-full">
              {/* Digital Intelligence Dashboard Content */}
              <ServiceDashboardPage serviceId={activeSubService} />
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
                      "Select a course from the sidebar to view details and continue learning" :
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
                      Select a course from the sidebar to get started
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
