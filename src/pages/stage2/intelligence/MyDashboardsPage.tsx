import { useNavigate } from 'react-router-dom';
import { Star, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { intelligenceServices } from '@/data/digitalIntelligence/stage2';

export default function MyDashboardsPage() {
  const navigate = useNavigate();

  // Mock favorited dashboards
  const favoriteDashboards = intelligenceServices.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboards</h1>
        <p className="text-gray-600 mt-1">Quick access to your favorited intelligence dashboards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Favorited</p>
              <p className="text-2xl font-bold text-gray-900">{favoriteDashboards.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accessed Today</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Favorited Dashboards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Favorited Dashboards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteDashboards.map(service => (
            <Card
              key={service.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/stage2/intelligence/services/${service.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="outline">{service.accuracy}</Badge>
                    <span className="text-xs text-gray-500 capitalize">{service.updateFrequency}</span>
                    {service.aiCapabilities.length > 0 && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-purple-600">AI-Powered</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Last accessed {service.lastAccessed ? formatDate(service.lastAccessed) : 'Never'}</span>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Open →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recently Accessed */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Accessed</h2>
        <Card className="divide-y divide-gray-100">
          {intelligenceServices.slice(0, 5).map(service => (
            <div
              key={service.id}
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate(`/stage2/intelligence/services/${service.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{service.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{service.description}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-500">
                    {service.lastAccessed ? formatDate(service.lastAccessed) : 'Never'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{service.views} views</p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
