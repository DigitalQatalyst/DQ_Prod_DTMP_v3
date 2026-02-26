import { useState, useMemo, useEffect } from 'react';
import {
  BarChart3, Clock, CheckCircle, AlertCircle, Loader2, FileText,
  Mail, BellRing, Share2, ShieldCheck, Zap, Database, Edit, Eye,
  ChevronDown, ChevronUp, MessageSquare, User, Calendar, ArrowUpRight,
  PieChart, TrendingUp, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboardRequests } from '@/data/digitalIntelligence/stage2';
import type { DashboardUpdateRequest } from '@/data/digitalIntelligence/stage2';

const requestTypeLabels: Record<string, { label: string; icon: typeof Mail; color: string }> = {
  'schedule-report':    { label: 'Scheduled Report',    icon: Mail,        color: 'bg-blue-100 text-blue-700' },
  'set-alert':          { label: 'Threshold Alert',     icon: BellRing,    color: 'bg-amber-100 text-amber-700' },
  'share-dashboard':    { label: 'Share Dashboard',     icon: Share2,      color: 'bg-indigo-100 text-indigo-700' },
  'request-audit':      { label: 'Data Audit',          icon: ShieldCheck, color: 'bg-rose-100 text-rose-700' },
  'request-api':        { label: 'API Access',          icon: Zap,         color: 'bg-purple-100 text-purple-700' },
  'add-visualization':  { label: 'New Visualization',   icon: BarChart3,   color: 'bg-teal-100 text-teal-700' },
  'modify-chart':       { label: 'Chart Modification',  icon: Edit,        color: 'bg-orange-100 text-orange-700' },
  'fix-data':           { label: 'Data Fix',            icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  'new-data-source':    { label: 'Data Source',         icon: Database,    color: 'bg-green-100 text-green-700' },
  'change-layout':      { label: 'Layout Change',       icon: FileText,    color: 'bg-gray-100 text-gray-700' },
};

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  'submitted':    { label: 'Submitted',    color: 'bg-gray-100 text-gray-700',    dotColor: 'bg-gray-400' },
  'under-review': { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', dotColor: 'bg-yellow-400' },
  'in-progress':  { label: 'In Progress',  color: 'bg-blue-100 text-blue-700',    dotColor: 'bg-blue-400' },
  'completed':    { label: 'Completed',    color: 'bg-green-100 text-green-700',  dotColor: 'bg-green-500' },
  'declined':     { label: 'Declined',     color: 'bg-red-100 text-red-700',      dotColor: 'bg-red-400' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  'low':    { label: 'Low',    color: 'text-gray-500' },
  'medium': { label: 'Medium', color: 'text-yellow-600' },
  'high':   { label: 'High',   color: 'text-orange-600' },
  'urgent': { label: 'Urgent', color: 'text-red-600' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

const statusSteps = ['submitted', 'under-review', 'in-progress', 'completed'] as const;
function getStepIndex(status: string) {
  const idx = statusSteps.indexOf(status as typeof statusSteps[number]);
  return idx >= 0 ? idx : (status === 'declined' ? -1 : 0);
}

export function OverviewTab({ requests, onFilterByType }: { requests: DashboardUpdateRequest[]; onFilterByType?: (type: string) => void }) {
  const stats = useMemo(() => {
    const total = requests.length;
    const byStatus = {
      submitted: requests.filter(r => r.status === 'submitted').length,
      underReview: requests.filter(r => r.status === 'under-review').length,
      inProgress: requests.filter(r => r.status === 'in-progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      declined: requests.filter(r => r.status === 'declined').length,
    };
    const active = byStatus.submitted + byStatus.underReview + byStatus.inProgress;
    const avgSlaHours = requests.filter(r => r.status === 'completed' && r.actualCompletionDate).reduce((sum, r) => {
      const diff = new Date(r.actualCompletionDate!).getTime() - new Date(r.submittedDate).getTime();
      return sum + diff / 3600000;
    }, 0);
    const completedCount = requests.filter(r => r.status === 'completed' && r.actualCompletionDate).length;
    const avgResolution = completedCount > 0 ? avgSlaHours / completedCount : 0;

    const typeDistribution = requests.reduce((acc, r) => {
      acc[r.requestType] = (acc[r.requestType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    type ActivityEvent = { key: string; timestamp: string; label: string; dashboardName: string; requestType: string; status: string };
    const events: ActivityEvent[] = [];
    requests.forEach(req => {
      const typeLbl = requestTypeLabels[req.requestType]?.label || req.requestType;
      events.push({
        key: `${req.id}-submit`,
        timestamp: req.submittedDate,
        label: `${req.requestedBy.name} submitted ${typeLbl}`,
        dashboardName: req.dashboardName,
        requestType: req.requestType,
        status: req.status,
      });
      if (req.actualCompletionDate) {
        events.push({
          key: `${req.id}-complete`,
          timestamp: req.actualCompletionDate,
          label: `${typeLbl} completed`,
          dashboardName: req.dashboardName,
          requestType: req.requestType,
          status: 'completed',
        });
      }
      req.messages.forEach(msg => {
        events.push({
          key: msg.id,
          timestamp: msg.timestamp,
          label: `${msg.from.name} replied on ${typeLbl}`,
          dashboardName: req.dashboardName,
          requestType: req.requestType,
          status: req.status,
        });
      });
    });
    const recentEvents = events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 7);

    return { total, byStatus, active, recentEvents, typeDistribution, avgResolution, completedCount };
  }, [requests]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 leading-none">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-0.5">Total Requests</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-5 h-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 leading-none">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-0.5">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 leading-none">{stats.byStatus.completed}</p>
              <p className="text-xs text-gray-500 mt-0.5">Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-gray-900 leading-none">
                {stats.total > 0 ? Math.round((stats.byStatus.completed / stats.total) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Completion Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status Breakdown + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Status Breakdown — 2 cols */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-gray-400" /> Status Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).map(([key, count]) => {
              const statusKey = key === 'underReview' ? 'under-review' : key === 'inProgress' ? 'in-progress' : key;
              const cfg = statusConfig[statusKey];
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={key} className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg?.dotColor || 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700 w-24 flex-shrink-0">{cfg?.label || key}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-0">
                    <div
                      className={`h-2 rounded-full transition-all ${cfg?.dotColor || 'bg-gray-300'}`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-6 text-right flex-shrink-0">{count}</span>
                </div>
              );
            })}
          </div>
          {/* Avg resolution */}
          {stats.completedCount > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Avg. Resolution</span>
                <span className="font-semibold text-gray-900">
                  {stats.avgResolution < 1
                    ? `${Math.round(stats.avgResolution * 60)} min`
                    : stats.avgResolution < 24
                    ? `${Math.round(stats.avgResolution)} hrs`
                    : `${Math.round(stats.avgResolution / 24)} days`}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Activity — realtime feed from all events */}
        <Card className="p-5 lg:col-span-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentEvents.map(evt => {
              const typeCfg = requestTypeLabels[evt.requestType];
              const TypeIcon = typeCfg?.icon || FileText;
              const stCfg = statusConfig[evt.status];
              return (
                <button
                  key={evt.key}
                  onClick={() => onFilterByType?.(evt.requestType)}
                  className="w-full flex items-start gap-3 p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeCfg?.color || 'bg-gray-100 text-gray-600'}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{evt.label}</p>
                    <p className="text-xs text-gray-500 truncate">{evt.dashboardName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge className={`text-xs ${stCfg?.color || ''}`}>
                      {stCfg?.label || evt.status}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(evt.timestamp)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Request Types Distribution — responsive wrap */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-gray-400" /> Requests by Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.typeDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => {
              const cfg = requestTypeLabels[type];
              const Icon = cfg?.icon || FileText;
              return (
                <button
                  key={type}
                  onClick={() => onFilterByType?.(type)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all hover:shadow-md hover:scale-105 cursor-pointer ${cfg?.color || 'bg-gray-100 text-gray-700'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cfg?.label || type}
                  <span className="bg-white/50 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ml-0.5">{count}</span>
                </button>
              );
            })}
        </div>
      </Card>
    </div>
  );
}

function RequestRow({ request }: { request: DashboardUpdateRequest }) {
  const [expanded, setExpanded] = useState(false);
  const typeCfg = requestTypeLabels[request.requestType];
  const TypeIcon = typeCfg?.icon || FileText;
  const stCfg = statusConfig[request.status];
  const priCfg = priorityConfig[request.priority];

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeCfg?.color || 'bg-gray-100'}`}>
          <TypeIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 truncate">{typeCfg?.label || request.requestType}</span>
            <span className="text-xs text-gray-400">{request.id}</span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">{request.dashboardName} &middot; {request.description.slice(0, 80)}...</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge className={`text-xs ${stCfg?.color || ''}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${stCfg?.dotColor}`} />
            {stCfg?.label}
          </Badge>
          <span className={`text-xs font-medium ${priCfg?.color}`}>{priCfg?.label}</span>
          <span className="text-xs text-gray-400">{formatDate(request.submittedDate)}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Details */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</h4>
                <p className="text-sm text-gray-700">{request.description}</p>
              </div>
              {request.resolution && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Resolution</h4>
                  <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{request.resolution}</p>
                </div>
              )}
              {request.messages.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Messages ({request.messages.length})</h4>
                  <div className="space-y-2">
                    {request.messages.map(msg => (
                      <div key={msg.id} className={`p-3 rounded-lg text-sm ${msg.from.role === 'requester' ? 'bg-blue-50 text-blue-800 ml-8' : 'bg-white border border-gray-200 mr-8'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{msg.from.name}</span>
                          <span className="text-xs text-gray-400">{formatDate(msg.timestamp)}</span>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-500">Requested by</span>
                  <span className="font-medium text-gray-900 ml-auto">{request.requestedBy.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 ml-auto text-xs">{request.requestedBy.email}</span>
                </div>
                {request.assignedTo && (
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">Handler</span>
                    <span className="font-medium text-gray-900 ml-auto">{request.assignedTo.name}</span>
                  </div>
                )}
                {request.assignedTo && (
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium text-gray-900 ml-auto text-xs">{request.assignedTo.role}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex items-center gap-2 text-sm">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-500">Submitted</span>
                  <span className="font-medium text-gray-900 ml-auto">{formatDate(request.submittedDate)}</span>
                </div>
                {request.sla && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">SLA</span>
                    <span className="font-medium text-gray-900 ml-auto">{request.sla}</span>
                  </div>
                )}
                {request.expectedCompletionDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500">ETA</span>
                    <span className="font-medium text-gray-900 ml-auto">{formatDate(request.expectedCompletionDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MyRequestsTab({ requests, initialTypeFilter, onFilterConsumed }: { requests: DashboardUpdateRequest[]; initialTypeFilter?: string; onFilterConsumed?: () => void }) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>(initialTypeFilter || 'all');

  useEffect(() => {
    if (initialTypeFilter && initialTypeFilter !== 'all') {
      setTypeFilter(initialTypeFilter);
      onFilterConsumed?.();
    }
  }, [initialTypeFilter]);

  const filtered = useMemo(() => {
    let result = requests;
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    if (typeFilter !== 'all') result = result.filter(r => r.requestType === typeFilter);
    return result.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
  }, [requests, statusFilter, typeFilter]);

  const uniqueTypes = [...new Set(requests.map(r => r.requestType))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Filter className="w-4 h-4" /> Filter:
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Statuses</option>
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Types</option>
          {uniqueTypes.map(type => (
            <option key={type} value={type}>{requestTypeLabels[type]?.label || type}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} request{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Request List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(req => <RequestRow key={req.id} request={req} />)
        ) : (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or submit a new request from a dashboard.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function DIRequestsHub() {
  const [activeTab, setActiveTab] = useState<'overview' | 'my-requests'>('overview');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Digital Intelligence Hub</h2>
        <p className="text-sm text-gray-500 mt-1">Monitor and manage your intelligence service requests</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('my-requests')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'my-requests'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> My Requests
            <Badge className="bg-gray-100 text-gray-700 text-xs ml-1">{dashboardRequests.length}</Badge>
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <OverviewTab requests={dashboardRequests} />
      ) : (
        <MyRequestsTab requests={dashboardRequests} />
      )}
    </div>
  );
}
