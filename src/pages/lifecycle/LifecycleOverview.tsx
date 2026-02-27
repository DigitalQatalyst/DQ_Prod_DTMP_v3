import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FolderKanban, 
  CheckSquare, 
  Archive, 
  TrendingUp, 
  Plus, 
  FileText,
  Link2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { lifecycleInstances, approvalWorkflows, lifecycleStatistics } from "@/data/lifecycle/lifecycleData";

export default function LifecycleOverview() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredInstances = typeFilter === 'all' 
    ? lifecycleInstances 
    : lifecycleInstances.filter(i => i.type === typeFilter);

  const myPendingApprovals = approvalWorkflows.filter(a => a.status === 'pending').slice(0, 3);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'on-track': return 'text-green-600 bg-green-50';
      case 'at-risk': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'on-hold': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lifecycle Management Dashboard</h1>
          <p className="text-gray-500 mt-1">Active projects, products, and applications under governance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/stage2/lifecycle/templates')}>
            <FileText className="w-4 h-4 mr-2" />
            View Templates
          </Button>
          <Button onClick={() => navigate('/stage2/lifecycle/projects/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{lifecycleStatistics.activeInstances}</p>
                <p className="text-xs text-gray-500 mt-1">3 in planning stage</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{lifecycleStatistics.pendingApprovals}</p>
                <p className="text-xs text-gray-500 mt-1">Avg. decision time: 2.3 days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Retirements</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {lifecycleInstances.filter(i => i.type === 'application-retirement').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">${(lifecycleStatistics.projectedSavings / 1000).toFixed(0)}K projected savings</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Archive className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
                <p className="text-xs text-gray-500 mt-1">On-time completions</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Integration Callout */}
      <Card className="bg-gradient-to-r from-orange-50 to-white border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Integrated with Portfolio Management</h3>
                <p className="text-sm text-gray-600">5 applications flagged for retirement in Portfolio are now tracked here</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/stage2/portfolio/overview')}>
              View Portfolio →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Lifecycle Instances */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Lifecycle Activities</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={typeFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTypeFilter('all')}
              >
                All ({lifecycleInstances.length})
              </Button>
              <Button 
                variant={typeFilter === 'project' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTypeFilter('project')}
              >
                Projects ({lifecycleInstances.filter(i => i.type === 'project').length})
              </Button>
              <Button 
                variant={typeFilter === 'product' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTypeFilter('product')}
              >
                Products ({lifecycleInstances.filter(i => i.type === 'product').length})
              </Button>
              <Button 
                variant={typeFilter === 'application-retirement' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTypeFilter('application-retirement')}
              >
                Retirements ({lifecycleInstances.filter(i => i.type === 'application-retirement').length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInstances.map((instance) => (
              <Card key={instance.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/stage2/lifecycle/instances/${instance.id}`)}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{instance.name}</h3>
                        <Badge className={getStatusColor(instance.status)}>
                          {instance.status.replace('-', ' ')}
                        </Badge>
                        {instance.portfolioLink && (
                          <Badge variant="outline" className="text-xs">
                            <Link2 className="w-3 h-3 mr-1" />
                            Portfolio Linked
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(instance.forecastEndDate).toLocaleDateString()}
                        </span>
                        <span>Owner: {instance.owner.name}</span>
                        <span>Template: {instance.basedOnTemplate}</span>
                      </div>
                    </div>
                    <Badge className={getHealthColor(instance.overallHealth)}>
                      {instance.overallHealth.replace('-', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-medium">{instance.overallProgress}%</span>
                    </div>
                    <Progress value={instance.overallProgress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Gates: {instance.gatesCompleted}/{instance.totalGates} completed</span>
                      {instance.budget && (
                        <span>Budget: ${(instance.budget.spent / 1000).toFixed(0)}K / ${(instance.budget.total / 1000).toFixed(0)}K</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending My Approval</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/stage2/lifecycle/approvals')}>
              View All →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myPendingApprovals.map((approval) => (
              <Card key={approval.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/stage2/lifecycle/approvals/${approval.id}`)}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{approval.lifecycleInstanceName}</h3>
                      <p className="text-sm text-gray-600">{approval.gate.name}</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Submitted by {approval.submittedBy}</span>
                    <span>Due: {new Date(approval.expectedDecisionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Approvals: {approval.receivedApprovals}/{approval.requiredApprovals}</span>
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
