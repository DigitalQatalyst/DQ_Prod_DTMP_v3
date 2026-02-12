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
  Ticket,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { applicationPortfolio } from "@/data/portfolio";
import PortfolioHealthDashboard from "@/components/portfolio/PortfolioHealthDashboard";
import { enrolledCourses } from "@/data/learning";
import { CourseDetailView } from "@/components/learning";
import { supportTickets, serviceRequests, knowledgeArticles, ServiceRequest } from "@/data/supportData";
import { technicalSupport, expertConsultancy } from "@/data/supportServices";
import { getSupportServiceDetail } from "@/data/supportServices/detailsSupport";
import { PriorityBadge, SLATimer } from "@/components/stage2";
import { Badge } from "@/components/ui/badge";
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
      default:
        return "Overview";
    }
  });
  
  const [activeSubService, setActiveSubService] = useState<string | null>(() => {
    // Auto-select the specific service if coming from a portfolio or learning center card
    if ((marketplace === "portfolio-management" || marketplace === "learning-center") && cardId) {
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
                      : activeService === "Support Services"
                      ? supportSubServices.find(s => s.id === activeSubService)?.description
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
