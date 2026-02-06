import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ChevronDown,
  Activity,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Calendar,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import ApplicationDetailModal from "./ApplicationDetailModal";
import { mockApplications, portfolioHealthMetrics } from "@/data/portfolio/healthDashboard";

interface PortfolioHealthDashboardProps {
  className?: string;
}

export default function PortfolioHealthDashboard({ className = "" }: PortfolioHealthDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState<string>("all");
  const [criticalityFilter, setCriticalityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo(() => {
    return {
      totalApps: portfolioHealthMetrics.totalApplications,
      avgHealthScore: portfolioHealthMetrics.averageHealthScore,
      healthyApps: portfolioHealthMetrics.healthyApplications,
      atRiskApps: portfolioHealthMetrics.atRiskApplications,
      criticalApps: portfolioHealthMetrics.criticalApplications,
      avgUptime: portfolioHealthMetrics.averageUptime,
      totalVulnerabilities: portfolioHealthMetrics.totalVulnerabilities,
      avgResponseTime: portfolioHealthMetrics.averageResponseTime
    };
  }, []);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return mockApplications.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.techStack.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesHealth = healthFilter === "all" || 
        (healthFilter === "healthy" && app.healthScore >= 71) ||
        (healthFilter === "at-risk" && app.healthScore >= 41 && app.healthScore <= 70) ||
        (healthFilter === "critical" && app.healthScore <= 40);
      
      const matchesCriticality = criticalityFilter === "all" || 
        app.businessCriticality.toLowerCase() === criticalityFilter;
      
      const matchesStatus = statusFilter === "all" || 
        app.status.toLowerCase().replace(" ", "-") === statusFilter;

      return matchesSearch && matchesHealth && matchesCriticality && matchesStatus;
    });
  }, [searchTerm, healthFilter, criticalityFilter, statusFilter]);

  const getHealthColor = (score: number) => {
    if (score >= 71) return "text-green-600 bg-green-50";
    if (score >= 41) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getHealthIcon = (score: number) => {
    if (score >= 71) return <CheckCircle className="w-4 h-4" />;
    if (score >= 41) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Online": "bg-green-100 text-green-700",
      "At Risk": "bg-yellow-100 text-yellow-700",
      "Critical": "bg-red-100 text-red-700",
      "Maintenance": "bg-blue-100 text-blue-700"
    };
    return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-700";
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(filteredApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApp = (appId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications(prev => [...prev, appId]);
    } else {
      setSelectedApplications(prev => prev.filter(id => id !== appId));
    }
  };

  const handleViewDetails = (appId: string) => {
    setSelectedApp(appId);
  };

  const selectedAppData = selectedApp ? mockApplications.find(app => app.id === selectedApp) : null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 h-full flex flex-col overflow-hidden ${className}`}>
      {/* Portfolio Health Overview KPIs */}
      <div className="p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-blue-50 p-3 lg:p-4 rounded-lg">
            <div className="flex items-center gap-2 lg:gap-3 mb-2">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900 text-sm lg:text-base">Portfolio Health</h3>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-blue-900">{portfolioMetrics.avgHealthScore}%</p>
            <p className="text-xs lg:text-sm text-blue-700">{portfolioMetrics.totalApps} applications</p>
          </div>
          
          <div className="bg-green-50 p-3 lg:p-4 rounded-lg">
            <div className="flex items-center gap-2 lg:gap-3 mb-2">
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
              <h3 className="font-semibold text-green-900 text-sm lg:text-base">Availability</h3>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-green-900">{portfolioMetrics.avgUptime}%</p>
            <p className="text-xs lg:text-sm text-green-700">Average uptime</p>
          </div>
          
          <div className="bg-orange-50 p-3 lg:p-4 rounded-lg">
            <div className="flex items-center gap-2 lg:gap-3 mb-2">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900 text-sm lg:text-base">Security Risk</h3>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-orange-900">{portfolioMetrics.totalVulnerabilities}</p>
            <p className="text-xs lg:text-sm text-orange-700">Total vulnerabilities</p>
          </div>
          
          <div className="bg-purple-50 p-3 lg:p-4 rounded-lg">
            <div className="flex items-center gap-2 lg:gap-3 mb-2">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900 text-sm lg:text-base">Performance</h3>
            </div>
            <p className="text-xl lg:text-2xl font-bold text-purple-900">{portfolioMetrics.avgResponseTime}s</p>
            <p className="text-xs lg:text-sm text-purple-700">Avg response time</p>
          </div>
        </div>

        {/* Health Distribution */}
        <div className="mt-4 lg:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900 text-sm lg:text-base">{portfolioMetrics.healthyApps} Healthy</p>
              <p className="text-xs lg:text-sm text-green-700">Score 71-100%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900 text-sm lg:text-base">{portfolioMetrics.atRiskApps} At Risk</p>
              <p className="text-xs lg:text-sm text-yellow-700">Score 41-70%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <XCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-900 text-sm lg:text-base">{portfolioMetrics.criticalApps} Critical</p>
              <p className="text-xs lg:text-sm text-red-700">Score 0-40%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 lg:p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search applications, owners, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-32 lg:w-40">
                <SelectValue placeholder="Health Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="healthy">Healthy (71-100%)</SelectItem>
                <SelectItem value="at-risk">At Risk (41-70%)</SelectItem>
                <SelectItem value="critical">Critical (0-40%)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
              <SelectTrigger className="w-32 lg:w-40">
                <SelectValue placeholder="Criticality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Criticality</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-24 lg:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="hidden lg:flex">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing {filteredApplications.length} of {mockApplications.length} applications
          </p>
          
          <div className="flex items-center gap-4">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-16 lg:w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedApplications.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-900">
              {selectedApplications.length} application{selectedApplications.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Assessment
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export Reports
              </Button>
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Assign Owner
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Application Table */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left">
                    <Checkbox
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Name
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health Score
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Business Criticality
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Technology Stack
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Owner
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Last Updated
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.slice(0, itemsPerPage).map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(app.id)}>
                    <td className="px-4 lg:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedApplications.includes(app.id)}
                        onCheckedChange={(checked) => handleSelectApp(app.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${getHealthColor(app.healthScore)}`}>
                          {getHealthIcon(app.healthScore)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm lg:text-base">{app.name}</p>
                          <p className="text-xs lg:text-sm text-gray-500 lg:hidden">{app.owner}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 lg:w-16">
                          <Progress value={app.healthScore} className="h-2" />
                        </div>
                        <span className={`font-medium text-sm lg:text-base ${getHealthColor(app.healthScore).split(' ')[0]}`}>
                          {app.healthScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                      <Badge variant="outline" className={
                        app.businessCriticality === "Critical" ? "border-red-200 text-red-700" :
                        app.businessCriticality === "High" ? "border-orange-200 text-orange-700" :
                        "border-blue-200 text-blue-700"
                      }>
                        {app.businessCriticality}
                      </Badge>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 hidden xl:table-cell">{app.techStack}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 hidden lg:table-cell">{app.owner}</td>
                    <td className="px-4 lg:px-6 py-4">
                      <Badge className={getStatusBadge(app.status)}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden xl:table-cell">{app.lastUpdated}</td>
                    <td className="px-4 lg:px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(app.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Assessment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="w-4 h-4 mr-2" />
                            Export Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredApplications.length > itemsPerPage && (
          <div className="px-4 lg:px-6 py-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <p className="text-sm text-gray-700">
                Showing 1 to {Math.min(itemsPerPage, filteredApplications.length)} of {filteredApplications.length} results
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={filteredApplications.length <= itemsPerPage}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <ApplicationDetailModal
        application={selectedAppData}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
}