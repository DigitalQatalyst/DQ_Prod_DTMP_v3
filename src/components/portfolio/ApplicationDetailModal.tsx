import { useState } from "react";
import { 
  X, 
  Calendar, 
  FileText, 
  Ticket, 
  Activity, 
  Shield, 
  Code, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Server,
  Users,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Application } from "@/data/portfolio/healthDashboard";

interface ApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationDetailModal({ 
  application, 
  isOpen, 
  onClose 
}: ApplicationDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  if (!application) return null;

  const getHealthColor = (score: number) => {
    if (score >= 71) return "text-green-600";
    if (score >= 41) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBgColor = (score: number) => {
    if (score >= 71) return "bg-green-50";
    if (score >= 41) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getHealthIcon = (score: number) => {
    if (score >= 71) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 41) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const healthCategories = [
    {
      name: "Performance",
      score: application.performance,
      icon: <Activity className="w-4 h-4" />,
      description: "Response time, throughput, resource utilization"
    },
    {
      name: "Security",
      score: application.security,
      icon: <Shield className="w-4 h-4" />,
      description: "Vulnerabilities, compliance, security posture"
    },
    {
      name: "Maintainability",
      score: application.maintainability,
      icon: <Code className="w-4 h-4" />,
      description: "Code quality, technical debt, documentation"
    },
    {
      name: "Business Value",
      score: application.businessValue,
      icon: <TrendingUp className="w-4 h-4" />,
      description: "Usage metrics, ROI, strategic alignment"
    }
  ];

  const mockIssues = [
    {
      severity: "high",
      category: "Performance",
      title: "High CPU usage during peak hours",
      description: "CPU utilization exceeds 85% during business hours",
      recommendation: "Consider horizontal scaling or performance optimization"
    },
    {
      severity: "critical",
      category: "Security",
      title: "3 critical security vulnerabilities",
      description: "Unpatched vulnerabilities in third-party libraries",
      recommendation: "Update dependencies and apply security patches immediately"
    },
    {
      severity: "medium",
      category: "Maintainability",
      title: "Technical debt score above threshold",
      description: "Code complexity and duplication metrics are elevated",
      recommendation: "Schedule refactoring sprint to address technical debt"
    }
  ];

  const mockMetadata = {
    version: application.version,
    deploymentDate: application.deploymentDate,
    environment: application.environment,
    dependencies: application.dependencies,
    team: application.owner,
    repository: "https://github.com/company/" + application.id,
    documentation: "https://docs.company.com/" + application.id
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getHealthBgColor(application.healthScore)}`}>
                {getHealthIcon(application.healthScore)}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{application.name}</DialogTitle>
                <p className="text-sm text-gray-500 mt-1">{application.id}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Health Score Header */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold">Overall Health Score</h3>
                <Badge className={`${getHealthColor(application.healthScore)} bg-transparent border-current`}>
                  {application.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={application.healthScore} className="h-3 mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span className={`font-semibold ${getHealthColor(application.healthScore)}`}>
                      {application.healthScore}%
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{application.uptime}%</p>
                <p className="text-sm text-gray-600">Uptime (30d)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{application.responseTime}s</p>
                <p className="text-sm text-gray-600">Avg Response</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Last updated: {application.lastUpdated} • Owner: {application.owner}
          </p>
        </div>

        {/* Health Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {healthCategories.map((category) => (
            <div key={category.name} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`${getHealthColor(category.score)}`}>
                  {category.icon}
                </div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
              </div>
              <div className="mb-2">
                <Progress value={category.score} className="h-2" />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-lg font-bold ${getHealthColor(category.score)}`}>
                  {category.score}%
                </span>
              </div>
              <p className="text-xs text-gray-500">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues & Recommendations</TabsTrigger>
            <TabsTrigger value="metadata">Application Details</TabsTrigger>
            <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Response Time</span>
                    </div>
                    <span className="font-semibold">{application.responseTime}s</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Uptime</span>
                    </div>
                    <span className="font-semibold">{application.uptime}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Vulnerabilities</span>
                    </div>
                    <span className="font-semibold text-red-600">{application.vulnerabilities}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Application Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Business Criticality</p>
                    <Badge variant="outline" className={
                      application.businessCriticality === "Critical" ? "border-red-200 text-red-700" :
                      application.businessCriticality === "High" ? "border-orange-200 text-orange-700" :
                      "border-blue-200 text-blue-700"
                    }>
                      {application.businessCriticality}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Technology Stack</p>
                    <p className="font-medium">{application.techStack}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Owner Team</p>
                    <p className="font-medium">{application.owner}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Issues & Recommendations</h3>
              {mockIssues.map((issue, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      issue.severity === "critical" ? "bg-red-500" :
                      issue.severity === "high" ? "bg-orange-500" :
                      "bg-yellow-500"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{issue.title}</h4>
                        <Badge variant="outline" className={
                          issue.severity === "critical" ? "border-red-200 text-red-700" :
                          issue.severity === "high" ? "border-orange-200 text-orange-700" :
                          "border-yellow-200 text-yellow-700"
                        }>
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline">{issue.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      <p className="text-sm text-blue-600 font-medium">
                        💡 {issue.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Application Metadata</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Version</span>
                    <span className="font-medium">{mockMetadata.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Deployment Date</span>
                    <span className="font-medium">{mockMetadata.deploymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Environment</span>
                    <span className="font-medium">{mockMetadata.environment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Team</span>
                    <span className="font-medium">{mockMetadata.team}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Dependencies</h3>
                <div className="space-y-2">
                  {mockMetadata.dependencies.map((dep, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <Server className="w-4 h-4 text-gray-600" />
                      <span className="text-sm">{dep}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Repository
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Historical Trends</h3>
              <p className="text-gray-500">
                Health trend charts and historical data visualization would be displayed here
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Assessment
          </Button>
          <Button variant="outline">
            <Ticket className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}