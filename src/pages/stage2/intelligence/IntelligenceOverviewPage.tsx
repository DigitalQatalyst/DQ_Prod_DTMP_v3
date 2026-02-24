import { useNavigate } from 'react-router-dom';
import { TrendingUp, Star, Activity, MessageSquare, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/digitalIntelligence/stage2';
import { intelligenceServices } from '@/data/digitalIntelligence/stage2';

export default function IntelligenceOverviewPage() {
  const navigate = useNavigate();

  // Mock data for favorites and recent activity
  const favoriteDashboards = intelligenceServices.slice(0, 3);
  const activeInsightsCount = 12;
  const pendingRequestsCount = 2;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Intelligence Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered analytics and insights across systems, projects, and digital maturity</p>
        </div>
        <Button onClick={() => navigate('/stage2/intelligence/services')} className="bg-purple-600 hover:bg-purple-700">
          <Grid className="w-4 h-4 mr-2" />
          Browse All Services
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          iconColor="blue"
          label="Available Services"
          value="18"
          change="Based on your role"
          changeType="neutral"
        />
        <MetricCard
          icon={Star}
          iconColor="orange"
          label="Favorited Dashboards"
          value="5"
          change="Quick access"
          changeType="neutral"
          onClick={() => navigate('/stage2/intelligence/my-dashboards')}
        />
        <MetricCard
          icon={Activity}
          iconColor="purple"
          label="Active Insights"
          value={activeInsightsCount}
          change="Requiring attention"
          changeType="neutral"
        />
        <MetricCard
          icon={MessageSquare}
          iconColor="green"
          label="Pending Requests"
          value={pendingRequestsCount}
          change="In progress"
          changeType="neutral"
          onClick={() => navigate('/stage2/intelligence/requests')}
        />
      </div>

      {/* Favorited Dashboards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Dashboards</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/stage2/intelligence/my-dashboards')}>
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteDashboards.map(service => (
            <Card
              key={service.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/stage2/intelligence/services/${service.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                </div>
                <Star className="w-5 h-5 text-orange-500 fill-orange-500 flex-shrink-0 ml-2" />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{service.accuracy}</span>
                <span>•</span>
                <span className="capitalize">{service.updateFrequency}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Viewed <span className="font-medium">Delivery Velocity Analytics</span></p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">New message on request <span className="font-medium">REQ-INT-2026-001</span></p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Favorited <span className="font-medium">System Health Analytics</span></p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 justify-start"
            onClick={() => navigate('/stage2/intelligence/services')}
          >
            <Grid className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Browse Services</div>
              <div className="text-xs text-gray-500">Explore all intelligence services</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 justify-start"
            onClick={() => navigate('/stage2/intelligence/my-dashboards')}
          >
            <Star className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">My Dashboards</div>
              <div className="text-xs text-gray-500">Access your favorite dashboards</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 justify-start"
            onClick={() => navigate('/stage2/intelligence/requests')}
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">My Requests</div>
              <div className="text-xs text-gray-500">Track dashboard update requests</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
