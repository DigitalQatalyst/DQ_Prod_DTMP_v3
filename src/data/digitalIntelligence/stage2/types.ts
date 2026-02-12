// Digital Intelligence Stage 2 - Type Definitions

export interface DataSourceOption {
  id: string;
  name: string;
  type: string;
  available: boolean;
  requiresAuth: boolean;
  icon?: string;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'insight' | 'heatmap';
  title: string;
  description: string;
  position: { row: number; col: number; width: number; height: number };
  chartType?: 'line' | 'bar' | 'pie' | 'donut' | 'radar' | 'scatter' | 'area' | 'gauge';
  dataQuery?: string;
}

export interface DashboardFilter {
  id: string;
  label: string;
  type: 'dropdown' | 'multiselect' | 'daterange' | 'search';
  options?: string[];
  defaultValue?: any;
  rbacRestricted?: boolean;
}

export interface DashboardConfig {
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  defaultDateRange: string;
  defaultView: string;
  exportFormats: ('excel' | 'pdf' | 'powerpoint')[];
  supportsScheduling: boolean;
}

export interface IntelligenceService {
  id: string;
  title: string;
  category: 'systems' | 'projects' | 'maturity';
  subcategory: string;
  description: string;
  aiCapabilities: string[];
  outputType: 'dashboard' | 'excel' | 'powerpoint' | 'chart' | 'heatmap' | 'alert';
  keyInsights: string[];
  dataSource: string;
  updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  accuracy: string;
  complexity: 'low' | 'medium' | 'high';
  transformationPhase: 'discern' | 'design' | 'deploy' | 'drive';
  visibleToRoles: ('staff' | 'associate' | 'manager' | 'lead' | 'director' | 'executive')[];
  dataScope: 'own' | 'team' | 'domain' | 'all';
  availableDataSources: DataSourceOption[];
  defaultDataSource: string;
  dashboardConfig: DashboardConfig;
  views: number;
  favorites: number;
  lastAccessed?: string;
}

export interface ScheduledReport {
  id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: string;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  formats: ('pdf' | 'excel' | 'powerpoint')[];
  includeCharts: boolean;
  includeRawData: boolean;
  active: boolean;
}

export interface UserDashboard {
  id: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  userName: string;
  customName?: string;
  isFavorite: boolean;
  selectedDataSource: string;
  appliedFilters: Record<string, any>;
  lastAccessedAt: string;
  accessCount: number;
  scheduledReports: ScheduledReport[];
}

export interface RequestMessage {
  id: string;
  from: {
    name: string;
    role: 'requester' | 'transformation-office';
  };
  to: string;
  message: string;
  timestamp: string;
  attachments?: {
    fileName: string;
    fileUrl: string;
  }[];
}

export interface DashboardUpdateRequest {
  id: string;
  dashboardId: string;
  dashboardName: string;
  requestType: 'add-visualization' | 'modify-chart' | 'fix-data' | 'new-data-source' | 'change-layout';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  requestedDataSource?: {
    name: string;
    instanceUrl?: string;
    justification: string;
    estimatedUsers: string;
  };
  requestedBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  status: 'submitted' | 'under-review' | 'in-progress' | 'completed' | 'declined';
  submittedDate: string;
  expectedCompletionDate?: string;
  actualCompletionDate?: string;
  assignedTo?: {
    id: string;
    name: string;
    role: string;
  };
  messages: RequestMessage[];
  resolution?: string;
  declineReason?: string;
  notifyEmail: boolean;
  notifyInApp: boolean;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
  metadata?: Record<string, any>;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  trendLabel?: string;
  severity?: 'success' | 'warning' | 'error' | 'info';
}

export interface AIInsight {
  id: string;
  type: 'alert' | 'info' | 'prediction' | 'recommendation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestedAction?: string;
  relatedData?: any;
}

export interface DashboardData {
  serviceId: string;
  dataSource: string;
  timeSeries: TimeSeriesDataPoint[];
  metrics: DashboardMetric[];
  insights: AIInsight[];
  tableData?: any[];
  generatedAt: string;
  dataRange: { start: string; end: string };
}
