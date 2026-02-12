import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, RefreshCw, Mail, FileSpreadsheet, FileText, Edit, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardWidget } from '@/components/digitalIntelligence/stage2';
import { intelligenceServices, sampleDashboardData } from '@/data/digitalIntelligence/stage2';

interface ServiceDashboardPageProps {
  serviceId: string;
}

export default function ServiceDashboardPage({ serviceId }: ServiceDashboardPageProps) {
  const navigate = useNavigate();
  
  const service = intelligenceServices.find(s => s.id === serviceId);
  const [selectedDataSource, setSelectedDataSource] = useState(service?.defaultDataSource || '');
  const [isFavorite, setIsFavorite] = useState(false);

  if (!service) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Service not found</h3>
          <p className="text-gray-600">The requested intelligence service could not be found.</p>
        </Card>
      </div>
    );
  }

  const dashboardData = sampleDashboardData[serviceId || ''];

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
      {/* Service Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h1>
          <p className="text-gray-600 mb-3">{service.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={getPhaseColor(service.transformationPhase)}>
              {service.transformationPhase}
            </Badge>
            <Badge variant="outline">{service.accuracy}</Badge>
            <Badge variant="outline" className="capitalize">{service.updateFrequency}</Badge>
            {service.aiCapabilities.length > 0 && (
              <Badge className="bg-purple-100 text-purple-700">
                AI-Powered
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Star
            className={`w-5 h-5 ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-400'}`}
          />
        </Button>
      </div>

      {/* Dashboard Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Data Source Selector */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Data Source</label>
            <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                {service.availableDataSources.map(source => (
                  <SelectItem
                    key={source.id}
                    value={source.id}
                    disabled={!source.available}
                  >
                    {source.name} {!source.available && '(Not Available)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filters would go here based on dashboardConfig.filters */}
          {service.dashboardConfig.filters.slice(0, 2).map(filter => (
            <div key={filter.id} className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">{filter.label}</label>
              <Select defaultValue={filter.defaultValue}>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="flex items-end">
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Dashboard Widgets */}
      {dashboardData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {service.dashboardConfig.widgets.map(widget => (
            <div
              key={widget.id}
              style={{
                gridColumn: `span ${widget.position.width}`,
                gridRow: `span ${widget.position.height}`
              }}
            >
              <DashboardWidget widget={widget} data={dashboardData} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Dashboard data is being loaded...</p>
        </Card>
      )}

      {/* Actions Menu */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {service.dashboardConfig.supportsScheduling && (
            <Button variant="outline" className="justify-start h-auto py-3">
              <Mail className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Schedule Email Report</div>
                <div className="text-xs text-gray-500">Set up automated reports</div>
              </div>
            </Button>
          )}
          {service.dashboardConfig.exportFormats.includes('excel') && (
            <Button variant="outline" className="justify-start h-auto py-3">
              <FileSpreadsheet className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Export to Excel</div>
                <div className="text-xs text-gray-500">Download data as spreadsheet</div>
              </div>
            </Button>
          )}
          {service.dashboardConfig.exportFormats.includes('pdf') && (
            <Button variant="outline" className="justify-start h-auto py-3">
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Export to PDF</div>
                <div className="text-xs text-gray-500">Generate PDF report</div>
              </div>
            </Button>
          )}
          <Button
            variant="outline"
            className="justify-start h-auto py-3"
            onClick={() => navigate('/stage2/intelligence/requests/new', { state: { serviceId: service.id, serviceName: service.title } })}
          >
            <Edit className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Request Dashboard Update</div>
              <div className="text-xs text-gray-500">Suggest improvements</div>
            </div>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3">
            <Database className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Request Data Source</div>
              <div className="text-xs text-gray-500">Add new integration</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Key Insights */}
      {service.keyInsights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <Card className="p-4">
            <ul className="space-y-2">
              {service.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* AI Capabilities */}
      {service.aiCapabilities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Capabilities</h3>
          <div className="flex flex-wrap gap-2">
            {service.aiCapabilities.map((capability, idx) => (
              <Badge key={idx} className="bg-purple-100 text-purple-700">
                {capability}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
