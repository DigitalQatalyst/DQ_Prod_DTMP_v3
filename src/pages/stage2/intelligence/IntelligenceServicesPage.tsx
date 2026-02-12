import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Server, FolderKanban, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { intelligenceServices } from '@/data/digitalIntelligence/stage2';

export default function IntelligenceServicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter services by search
  const filteredServices = intelligenceServices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by category
  const systemsServices = filteredServices.filter(s => s.category === 'systems');
  const projectsServices = filteredServices.filter(s => s.category === 'projects');
  const maturityServices = filteredServices.filter(s => s.category === 'maturity');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'systems':
        return Server;
      case 'projects':
        return FolderKanban;
      case 'maturity':
        return TrendingUp;
      default:
        return Server;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'discern':
        return 'bg-blue-100 text-blue-700';
      case 'design':
        return 'bg-purple-100 text-purple-700';
      case 'deploy':
        return 'bg-orange-100 text-orange-700';
      case 'drive':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Intelligence Services</h1>
        <p className="text-gray-600 mt-1">{filteredServices.length} services available to you</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Systems Portfolio & Lifecycle */}
      {systemsServices.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Systems Portfolio & Lifecycle</h2>
            <Badge variant="secondary">{systemsServices.length} services</Badge>
          </div>
          <div className="space-y-3">
            {systemsServices.map(service => {
              const Icon = getCategoryIcon(service.category);
              return (
                <Card
                  key={service.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/stage2/intelligence/services/${service.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getPhaseColor(service.transformationPhase)}>
                          {service.transformationPhase}
                        </Badge>
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
                    <div className="text-right flex-shrink-0">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        View Dashboard →
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects Portfolio & Lifecycle */}
      {projectsServices.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Projects Portfolio & Lifecycle</h2>
            <Badge variant="secondary">{projectsServices.length} services</Badge>
          </div>
          <div className="space-y-3">
            {projectsServices.map(service => {
              const Icon = getCategoryIcon(service.category);
              return (
                <Card
                  key={service.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/stage2/intelligence/services/${service.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getPhaseColor(service.transformationPhase)}>
                          {service.transformationPhase}
                        </Badge>
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
                    <div className="text-right flex-shrink-0">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        View Dashboard →
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Digital Maturity */}
      {maturityServices.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Digital Maturity</h2>
            <Badge variant="secondary">{maturityServices.length} services</Badge>
          </div>
          <div className="space-y-3">
            {maturityServices.map(service => {
              const Icon = getCategoryIcon(service.category);
              return (
                <Card
                  key={service.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/stage2/intelligence/services/${service.id}`)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getPhaseColor(service.transformationPhase)}>
                          {service.transformationPhase}
                        </Badge>
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
                    <div className="text-right flex-shrink-0">
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        View Dashboard →
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search query</p>
        </Card>
      )}
    </div>
  );
}
