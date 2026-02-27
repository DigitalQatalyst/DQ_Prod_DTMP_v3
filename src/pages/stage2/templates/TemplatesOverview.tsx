import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Zap, 
  Plus, 
  Shield, 
  Settings, 
  FileCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { documentTemplates, documentRequests } from "@/data/stage2/templatesData";

// Simple Metric Card Component
const MetricCard = ({ icon: Icon, iconColor, label, value, change, changeType, onClick }: any) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all ${onClick ? 'hover:border-orange-200' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className={`p-2 rounded-lg ${colorClasses[iconColor as keyof typeof colorClasses] || "bg-gray-100"}`}>
            <Icon size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs">
          <span className={`font-medium ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Request Card Component
const RequestCard = ({ request, onClick }: any) => {
  const statusColors = {
    'submitted': 'bg-blue-100 text-blue-700',
    'under-review': 'bg-yellow-100 text-yellow-700',
    'generating': 'bg-purple-100 text-purple-700',
    'review-required': 'bg-orange-100 text-orange-700',
    'delivered': 'bg-green-100 text-green-700',
    'completed': 'bg-gray-100 text-gray-700',
    'cancelled': 'bg-red-100 text-red-700'
  };

  return (
    <div 
      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <FileText size={20} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{request.title}</h4>
          <p className="text-sm text-gray-500">{request.templateTitle} • {request.id}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant="secondary" className={statusColors[request.status as keyof typeof statusColors]}>
          {request.status.replace('-', ' ')}
        </Badge>
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

// Quick Action Card
const QuickActionCard = ({ icon: Icon, title, description, count, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl hover:border-orange-200 hover:shadow-sm transition-all text-left w-full group"
  >
    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-100 transition-colors">
      <Icon size={20} />
    </div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 mb-3">{description}</p>
    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
      {count} Templates
    </span>
  </button>
);

export default function TemplatesOverview() {
  const navigate = useNavigate();

  // Filter data for dashboard
  const activeRequests = documentRequests.filter(r => 
    ['submitted', 'under-review', 'generating', 'review-required'].includes(r.status)
  );
  
  const completedCount = documentRequests.filter(r => r.status === 'completed' || r.status === 'delivered').length;
  
  // Get popular templates (mock logic: just take first 3)
  const popularTemplates = documentTemplates.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI DocWriter Dashboard</h1>
          <p className="text-gray-500 mt-1">AI-powered document generation for policies, procedures, and governance documents</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/stage2/templates/library')}>
            <FileText className="w-4 h-4 mr-2" />
            Browse Templates
          </Button>
          <Button onClick={() => navigate('/stage2/templates/new-request')} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={FileText}
          iconColor="blue"
          label="Available Templates"
          value={documentTemplates.length}
          change="Documents, policies, procedures"
          changeType="neutral"
          onClick={() => navigate('/stage2/templates/library')}
        />
        <MetricCard
          icon={Clock}
          iconColor="orange"
          label="Active Requests"
          value={activeRequests.length}
          change={`${activeRequests.filter(r => r.status === 'generating').length} in generation`}
          changeType="neutral"
          onClick={() => navigate('/stage2/templates/my-requests')}
        />
        <MetricCard
          icon={CheckCircle}
          iconColor="green"
          label="Completed Documents"
          value={completedCount}
          change="This quarter"
          changeType="positive"
        />
        <MetricCard
          icon={Zap}
          iconColor="purple"
          label="Avg. Delivery Time"
          value="1.2 days"
          change="-0.3 days improvement"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Requests & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Requests */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Active Requests</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/stage2/templates/my-requests')} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            {activeRequests.length > 0 ? (
              <div className="space-y-3">
                {activeRequests.map(request => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onClick={() => navigate(`/stage2/templates/my-requests/${request.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900">No active requests</h3>
                <p className="text-sm text-gray-500 mb-4">Start a new document request to get AI-generated content.</p>
                <Button onClick={() => navigate('/stage2/templates/new-request')} variant="outline">
                  Create New Request
                </Button>
              </div>
            )}
          </section>

          {/* Quick Actions / Categories */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                icon={Shield}
                title="Governance"
                description="Privacy, security & compliance"
                count={documentTemplates.filter(t => t.category === 'governance').length}
                onClick={() => navigate('/stage2/templates/library?category=governance')}
              />
              <QuickActionCard
                icon={Settings}
                title="Operational"
                description="Procedures & incident response"
                count={documentTemplates.filter(t => t.category === 'operational').length}
                onClick={() => navigate('/stage2/templates/library?category=operational')}
              />
              <QuickActionCard
                icon={FileCheck}
                title="Compliance"
                description="Audits & standards"
                count={documentTemplates.filter(t => t.category === 'compliance').length}
                onClick={() => navigate('/stage2/templates/library?category=compliance')}
              />
            </div>
          </section>
        </div>

        {/* Right Column: Popular Templates */}
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Requested</h2>
            <div className="space-y-4">
              {popularTemplates.map(template => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-all hover:border-orange-200"
                  onClick={() => navigate(`/stage2/templates/library/${template.id}`)}
                >
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{template.category}</Badge>
                    <h3 className="font-medium text-gray-900 mb-1">{template.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{template.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {template.estimatedGenerationTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle size={12} /> {template.requestCount} uses
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-gray-500 hover:text-gray-900"
              onClick={() => navigate('/stage2/templates/library')}
            >
              View All Templates
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
}
