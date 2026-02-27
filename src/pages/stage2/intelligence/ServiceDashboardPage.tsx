import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, RefreshCw, Mail, FileSpreadsheet, FileText, Edit, Database, Lock, CheckCircle, CalendarRange, Send, User, Briefcase, MessageSquare, X, LucideIcon, BellRing, Share2, ShieldCheck, Zap, Gauge, ArrowUpDown, Globe, Users } from 'lucide-react';
import { LoginModal } from '@/components/learningCenter/LoginModal';
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

type ActionType = 'schedule-report' | 'export-excel' | 'export-pdf' | 'request-update' | 'request-datasource' | 'set-alert' | 'share-dashboard' | 'request-audit' | 'request-api';

interface ActionField {
  key: string;
  label: string;
  icon: LucideIcon;
  type: 'text' | 'email' | 'select' | 'textarea';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

const priorityField: ActionField = {
  key: 'priority', label: 'Priority Level', icon: Gauge, type: 'select', required: true, options: [
    { value: 'low', label: 'Low — nice to have' },
    { value: 'medium', label: 'Medium — would improve my workflow' },
    { value: 'high', label: 'High — blocking a decision' },
    { value: 'urgent', label: 'Urgent — critical / time-sensitive' },
  ],
};

const actionMeta: Record<ActionType, { title: string; icon: LucideIcon; description: string; successMessage: string; fields: ActionField[] }> = {
  'schedule-report': {
    title: 'Schedule Email Report',
    icon: Mail,
    description: 'Set up automated report delivery to your inbox',
    successMessage: 'Your scheduled report has been configured. You will start receiving reports at the selected frequency.',
    fields: [
      { key: 'email', label: 'Recipient Email', icon: Mail, type: 'email', placeholder: 'e.g. john@company.com', required: true },
      { key: 'frequency', label: 'Report Frequency', icon: RefreshCw, type: 'select', required: true, options: [
        { value: 'daily', label: 'Daily — every morning at 8 AM' },
        { value: 'weekly', label: 'Weekly — every Monday morning' },
        { value: 'biweekly', label: 'Bi-weekly — every other Monday' },
        { value: 'monthly', label: 'Monthly — 1st of each month' },
      ]},
      priorityField,
    ],
  },
  'export-excel': {
    title: 'Export to Excel', icon: FileSpreadsheet, description: 'Download dashboard data as a spreadsheet',
    successMessage: '', fields: [],
  },
  'export-pdf': {
    title: 'Export to PDF', icon: FileText, description: 'Generate a formatted PDF report',
    successMessage: '', fields: [],
  },
  'request-update': {
    title: 'Request Dashboard Update',
    icon: Edit,
    description: 'Suggest improvements or new visualizations',
    successMessage: 'Your dashboard update request has been submitted to the analytics team. You will be notified when the changes are live.',
    fields: [
      { key: 'email', label: 'Contact Email', icon: Mail, type: 'email', placeholder: 'e.g. john@company.com', required: true },
      { key: 'improvement', label: 'What Should We Improve?', icon: Edit, type: 'textarea', placeholder: 'e.g. Add a trend line for monthly revenue, split the bar chart by region...', required: true },
      priorityField,
    ],
  },
  'request-datasource': {
    title: 'Request Data Source',
    icon: Database,
    description: 'Request a new data integration',
    successMessage: 'Your data source request has been submitted. The integration team will review feasibility and reach out within 48 hours.',
    fields: [
      { key: 'email', label: 'Contact Email', icon: Mail, type: 'email', placeholder: 'e.g. john@company.com', required: true },
      { key: 'sourceName', label: 'Data Source Name', icon: Database, type: 'text', placeholder: 'e.g. Salesforce, SAP, Snowflake...', required: true },
      { key: 'connectionType', label: 'Connection Type', icon: Globe, type: 'select', required: true, options: [
        { value: 'api', label: 'REST / GraphQL API' },
        { value: 'database', label: 'Direct Database Connection' },
        { value: 'file', label: 'File Upload (CSV, Excel)' },
        { value: 'cloud', label: 'Cloud Storage (S3, GCS, Azure Blob)' },
      ]},
      priorityField,
    ],
  },
  'set-alert': {
    title: 'Set Threshold Alert',
    icon: BellRing,
    description: 'Get notified when a metric crosses a critical threshold',
    successMessage: 'Your threshold alert has been configured. You will receive notifications when the metric crosses the specified value.',
    fields: [
      { key: 'email', label: 'Alert Recipient Email', icon: Mail, type: 'email', placeholder: 'e.g. ops-team@company.com', required: true },
      { key: 'metric', label: 'Metric to Monitor', icon: Gauge, type: 'text', placeholder: 'e.g. System Uptime, Error Rate, Response Time...', required: true },
      { key: 'direction', label: 'Alert When Value Goes', icon: ArrowUpDown, type: 'select', required: true, options: [
        { value: 'above', label: 'Above threshold (e.g. error rate > 5%)' },
        { value: 'below', label: 'Below threshold (e.g. uptime < 99%)' },
      ]},
      { key: 'threshold', label: 'Threshold Value', icon: BellRing, type: 'text', placeholder: 'e.g. 99.5, 5, 200...', required: true },
      priorityField,
    ],
  },
  'share-dashboard': {
    title: 'Share with Team',
    icon: Share2,
    description: 'Invite colleagues to collaborate on this dashboard',
    successMessage: 'Dashboard access has been shared. Your colleague will receive an invitation email shortly.',
    fields: [
      { key: 'email', label: "Colleague's Email", icon: Users, type: 'email', placeholder: 'e.g. colleague@company.com', required: true },
      { key: 'accessLevel', label: 'Access Level', icon: ShieldCheck, type: 'select', required: true, options: [
        { value: 'viewer', label: 'Viewer — can view dashboards and export data' },
        { value: 'editor', label: 'Editor — can modify filters and layout' },
        { value: 'admin', label: 'Admin — full control including sharing' },
      ]},
      { key: 'message', label: 'Personal Message (optional)', icon: MessageSquare, type: 'textarea', placeholder: 'e.g. Hey, check out this dashboard for our Q2 review...', required: false },
      priorityField,
    ],
  },
  'request-audit': {
    title: 'Request Data Audit',
    icon: ShieldCheck,
    description: 'Verify data accuracy with a certified audit trail',
    successMessage: 'Your data audit request has been submitted. The compliance team will begin the review and share findings within 5 business days.',
    fields: [
      { key: 'email', label: 'Contact Email', icon: Mail, type: 'email', placeholder: 'e.g. compliance@company.com', required: true },
      { key: 'auditScope', label: 'Audit Scope', icon: ShieldCheck, type: 'select', required: true, options: [
        { value: 'full', label: 'Full Audit — all data sources and transformations' },
        { value: 'source', label: 'Source Verification — validate raw data accuracy' },
        { value: 'transform', label: 'Transformation Audit — verify calculation logic' },
        { value: 'access', label: 'Access Audit — review who accessed the data' },
      ]},
      { key: 'reason', label: 'Reason for Audit', icon: MessageSquare, type: 'textarea', placeholder: 'e.g. Quarterly compliance review, numbers seem inconsistent with...', required: true },
      priorityField,
    ],
  },
  'request-api': {
    title: 'Request API Access',
    icon: Zap,
    description: "Get programmatic access to this dashboard's data",
    successMessage: 'Your API access request has been submitted. You will receive API credentials and documentation via email once approved.',
    fields: [
      { key: 'email', label: 'Developer Email', icon: Mail, type: 'email', placeholder: 'e.g. dev@company.com', required: true },
      { key: 'useCase', label: 'Use Case', icon: Zap, type: 'textarea', placeholder: 'e.g. Integrate dashboard metrics into our internal BI tool, feed data into a Slack bot...', required: true },
      { key: 'volume', label: 'Expected Call Volume', icon: Gauge, type: 'select', required: true, options: [
        { value: 'low', label: 'Low — under 100 calls/day' },
        { value: 'medium', label: 'Medium — 100–1,000 calls/day' },
        { value: 'high', label: 'High — 1,000–10,000 calls/day' },
        { value: 'enterprise', label: 'Enterprise — 10,000+ calls/day' },
      ]},
      priorityField,
    ],
  },
};

export default function ServiceDashboardPage({ serviceId }: ServiceDashboardPageProps) {
  const navigate = useNavigate();
  
  const service = intelligenceServices.find(s => s.id === serviceId);
  const [selectedDataSource, setSelectedDataSource] = useState(service?.defaultDataSource || '');
  const [isFavorite, setIsFavorite] = useState(false);

  const [dateRangeGranted, setDateRangeGranted] = useState(false);
  const [showAccessForm, setShowAccessForm] = useState(false);
  const [accessForm, setAccessForm] = useState({ name: '', role: '', justification: '', dateRange: 'last-30-days' });
  const [submitting, setSubmitting] = useState(false);

  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [actionFormData, setActionFormData] = useState<Record<string, string>>({});
  const [completedActions, setCompletedActions] = useState<Set<ActionType>>(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [pendingFormData, setPendingFormData] = useState<Record<string, string>>({});

  const directActions: ActionType[] = ['export-excel', 'export-pdf'];

  const handleActionClick = (action: ActionType) => {
    if (directActions.includes(action)) {
      setCompletedActions(prev => new Set(prev).add(action));
      return;
    }
    setActiveAction(action);
    const defaults: Record<string, string> = {};
    actionMeta[action].fields.forEach(f => {
      defaults[f.key] = f.type === 'select' && f.options?.length ? f.options[0].value : '';
    });
    setActionFormData(defaults);
  };

  const handleActionFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAction(activeAction);
    setPendingFormData({ ...actionFormData });
    setActiveAction(null);
    setShowLoginModal(true);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    setPendingAction(null);
  };

  const closeActionModal = () => {
    setActiveAction(null);
  };

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
          {/* Data Source Selector — freely accessible */}
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

          {/* Date Range — gated behind access request */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
            {dateRangeGranted ? (
              <Select defaultValue={accessForm.dateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['last-7-days', 'last-30-days', 'last-90-days', 'last-6-months', 'last-year'].map(opt => (
                    <SelectItem key={opt} value={opt}>
                      {opt.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <button
                onClick={() => setShowAccessForm(true)}
                className="w-full flex items-center justify-between gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500 hover:border-purple-400 hover:bg-purple-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Request Data Access
                </span>
                <CalendarRange className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Other filters — freely accessible */}
          {service.dashboardConfig.filters.filter(f => f.id !== 'dateRange').slice(0, 1).map(filter => (
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

      {/* Data Access Request Form Modal */}
      {showAccessForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setShowAccessForm(false); }}>
          <Card className="w-full max-w-lg mx-4 p-0 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarRange className="w-5 h-5" />
                Request Data Range Access
              </h3>
              <p className="text-purple-200 text-sm mt-1">Fill in the details below to unlock date range filtering for <strong className="text-white">{service.title}</strong></p>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                setTimeout(() => {
                  setSubmitting(false);
                  setDateRangeGranted(true);
                  setShowAccessForm(false);
                }, 1200);
              }}
            >
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 block">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  value={accessForm.name}
                  onChange={(e) => setAccessForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 block">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Role / Department
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Data Analyst — IT Operations"
                  value={accessForm.role}
                  onChange={(e) => setAccessForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 block">
                  <CalendarRange className="w-3.5 h-3.5 text-gray-400" /> Requested Date Range
                </label>
                <select
                  required
                  value={accessForm.dateRange}
                  onChange={(e) => setAccessForm(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-90-days">Last 90 Days</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="last-year">Last Year</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 block">
                  <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Business Justification
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Briefly describe why you need access to this data range..."
                  value={accessForm.justification}
                  onChange={(e) => setAccessForm(prev => ({ ...prev, justification: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Submit Request
                    </span>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAccessForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Access granted confirmation */}
      {dateRangeGranted && (
        <Card className="border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span><strong>Data access granted.</strong> Date range filter is now unlocked. You requested <strong>{accessForm.dateRange.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</strong> access for {service.title}.</span>
          </div>
        </Card>
      )}

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
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Actions</h3>
        <p className="text-sm text-gray-500 mb-4">Fill a short form and sign in to access a service.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(
            [
              ...(service.dashboardConfig.supportsScheduling ? ['schedule-report' as ActionType] : []),
              ...(service.dashboardConfig.exportFormats.includes('excel') ? ['export-excel' as ActionType] : []),
              ...(service.dashboardConfig.exportFormats.includes('pdf') ? ['export-pdf' as ActionType] : []),
              'request-update' as ActionType,
              'request-datasource' as ActionType,
              'set-alert' as ActionType,
              'share-dashboard' as ActionType,
              'request-audit' as ActionType,
              'request-api' as ActionType,
            ]
          ).map(actionKey => {
            const meta = actionMeta[actionKey];
            const Icon = meta.icon;
            const done = completedActions.has(actionKey);
            return (
              <Button
                key={actionKey}
                variant="outline"
                className={`justify-start h-auto py-3 relative ${done ? 'border-green-300 bg-green-50' : ''}`}
                onClick={() => handleActionClick(actionKey)}
              >
                {done ? <CheckCircle className="w-5 h-5 mr-3 text-green-600" /> : <Icon className="w-5 h-5 mr-3" />}
                <div className="text-left">
                  <div className="font-medium">{meta.title}</div>
                  <div className="text-xs text-gray-500">{done ? (directActions.includes(actionKey) ? 'Download started' : 'Request submitted') : meta.description}</div>
                </div>
                {!done && !directActions.includes(actionKey) && <Lock className="w-3.5 h-3.5 text-gray-400 absolute top-2 right-2" />}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Action Request Form Modal */}
      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) closeActionModal(); }}>
          <Card className="w-full max-w-lg mx-4 p-0 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#0B1437] to-[#1a2555] px-6 py-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {(() => { const Icon = actionMeta[activeAction].icon; return <Icon className="w-5 h-5" />; })()}
                  {actionMeta[activeAction].title}
                </h3>
                <p className="text-gray-300 text-sm mt-1">Fill in the details below to submit your request.</p>
              </div>
              <button onClick={closeActionModal} className="text-white/70 hover:text-white mt-1"><X className="w-5 h-5" /></button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleActionFormSubmit}>
              {actionMeta[activeAction].fields.map(field => {
                const FieldIcon = field.icon;
                return (
                  <div key={field.key}>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5 block">
                      <FieldIcon className="w-3.5 h-3.5 text-gray-400" /> {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={actionFormData[field.key] || ''}
                        onChange={e => setActionFormData(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                      >
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        required={field.required}
                        rows={3}
                        placeholder={field.placeholder}
                        value={actionFormData[field.key] || ''}
                        onChange={e => setActionFormData(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <input
                        required={field.required}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={actionFormData[field.key] || ''}
                        onChange={e => setActionFormData(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    )}
                  </div>
                );
              })}
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                  <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Submit</span>
                </Button>
                <Button type="button" variant="outline" onClick={closeActionModal}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Login Modal — appears after form submission */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginClose}
        context={{
          marketplace: 'digital-intelligence',
          tab: 'intelligence',
          cardId: service.id,
          serviceName: service.title,
          action: pendingAction || '',
          formData: pendingFormData,
          dashboardName: service.title,
        }}
      />

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
