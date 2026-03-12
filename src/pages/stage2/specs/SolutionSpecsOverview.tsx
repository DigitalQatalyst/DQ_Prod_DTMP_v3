import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, CheckCircle, Clock, AlertCircle, Eye, Download, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { solutionSpecs } from '@/data/blueprints/solutionSpecs';

// ── Shared request data (single source of truth) ──────────────────────────
export interface SpecRequest {
  id: string;
  solutionName: string;
  requestType: string;
  submittedAt: string;
  status: 'under-review' | 'in-progress' | 'completed' | 'pending' | 'on-hold';
  assignedTo?: string;
  specId?: string;
}

export const allRequests: SpecRequest[] = [
  {
    id: 'REQ-2025-001',
    solutionName: 'Customer Data Unification Platform',
    requestType: 'Current Build',
    submittedAt: '2026-02-10',
    status: 'in-progress',
    assignedTo: 'Sarah Chen',
    specId: 'customer-360-platform',
  },
  {
    id: 'REQ-2025-002',
    solutionName: 'API Integration Hub Enhancement',
    requestType: 'Enhancement',
    submittedAt: '2026-02-05',
    status: 'completed',
    assignedTo: 'Mark Johnson',
    specId: 'api-gateway-architecture',
  },
  {
    id: 'REQ-2025-003',
    solutionName: 'ERP–CRM Connector',
    requestType: 'Integration',
    submittedAt: '2026-01-28',
    status: 'under-review',
    assignedTo: 'Lisa Park',
  },
  {
    id: 'REQ-2025-004',
    solutionName: 'Digital Workplace Revamp',
    requestType: 'Enhancement',
    submittedAt: '2026-01-15',
    status: 'pending',
  },
  {
    id: 'REQ-2025-005',
    solutionName: 'Data Governance Framework',
    requestType: 'Current Build',
    submittedAt: '2026-01-08',
    status: 'on-hold',
    assignedTo: 'James Wu',
    specId: 'enterprise-data-platform',
  },
];

export const statusConfig: Record<SpecRequest['status'], { label: string; color: string; dot: string; icon: React.ComponentType<{ className?: string }> }> = {
  'under-review': { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400', icon: Eye },
  'in-progress':  { label: 'In Progress',  color: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-400',   icon: Clock },
  'completed':    { label: 'Completed',    color: 'bg-green-100 text-green-700 border-green-200',     dot: 'bg-green-400',  icon: CheckCircle },
  'pending':      { label: 'Pending',      color: 'bg-gray-100 text-gray-600 border-gray-200',        dot: 'bg-gray-400',   icon: AlertCircle },
  'on-hold':      { label: 'On Hold',      color: 'bg-orange-100 text-orange-700 border-orange-200',  dot: 'bg-orange-400', icon: AlertCircle },
};

// ── Mock acquired specs ───────────────────────────────────────────────────
const acquiredSpecIds = ['dbp-reference-architecture', 'customer-360-platform', 'enterprise-data-platform'];

interface LocationState {
  fromRequest?: boolean;
  specId?: string;
  serviceName?: string;
  requestType?: string;
}

export default function SolutionSpecsOverview() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  // Merge new request from form submission
  const displayRequests: SpecRequest[] = state.fromRequest
    ? [
        {
          id: `REQ-2026-${String(allRequests.length + 1).padStart(3, '0')}`,
          solutionName: state.serviceName || 'New Request',
          requestType: state.requestType
            ? state.requestType.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
            : 'Current Build',
          submittedAt: new Date().toISOString().split('T')[0],
          status: 'under-review',
          specId: state.specId,
        },
        ...allRequests,
      ]
    : allRequests;

  // Request status counts
  const statusCounts = {
    total: displayRequests.length,
    'under-review': displayRequests.filter((r) => r.status === 'under-review').length,
    'in-progress':  displayRequests.filter((r) => r.status === 'in-progress').length,
    'completed':    displayRequests.filter((r) => r.status === 'completed').length,
    'pending':      displayRequests.filter((r) => r.status === 'pending').length,
    'on-hold':      displayRequests.filter((r) => r.status === 'on-hold').length,
  };

  const acquiredSpecs = solutionSpecs.filter((s) => acquiredSpecIds.includes(s.id));

  // 3 most recent requests across all users
  const recentRequests = [...displayRequests]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  return (
    <div className="stage2-content p-6">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Solutions Specs</h1>
        <p className="text-gray-500 text-sm">Overview of all solution spec requests and acquired assets</p>
      </div>

      {/* ── Request Submitted Banner ─────────────────────────────────────── */}
      {state.fromRequest && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Request Submitted Successfully</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your request has been queued and is now under review by our solution architects.
              </p>
              <div className="bg-white rounded-lg border border-orange-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-gray-900">Request Summary</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Solution</p>
                    <p className="font-medium text-gray-900 truncate">{state.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Request Type</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {state.requestType?.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Status</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                      <Eye className="w-3 h-3" />
                      Under Review
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Submitted</p>
                    <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Reference ID</p>
                    <p className="font-medium text-gray-900 font-mono text-xs">
                      REQ-2026-{String(displayRequests.length).padStart(3, '0')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Request Summary Stats ─────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Request Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{statusCounts.total}</p>
            <p className="text-xs text-gray-400 mt-1">All requests</p>
          </div>

          {/* Under Review */}
          <div className="bg-white rounded-xl border border-yellow-200 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Eye className="w-3.5 h-3.5 text-yellow-500" />
              <p className="text-xs text-yellow-700">Under Review</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusCounts['under-review']}</p>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl border border-blue-200 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-xs text-blue-700">In Progress</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusCounts['in-progress']}</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl border border-green-200 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <p className="text-xs text-green-700">Completed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusCounts['completed']}</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusCounts['pending']}</p>
          </div>

          {/* On Hold */}
          <div className="bg-white rounded-xl border border-orange-200 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-orange-400" />
              <p className="text-xs text-orange-700">On Hold</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{statusCounts['on-hold']}</p>
          </div>
        </div>
      </div>

      {/* ── Recent Requests + CTA ─────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-700">Recent Requests</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/stage2/specs/my-requests')}
            className="text-orange-600 hover:text-orange-700 text-xs"
          >
            View all requests
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {recentRequests.map((req) => {
            const cfg = statusConfig[req.status];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={req.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{req.solutionName}</p>
                    <p className="text-xs text-gray-400">{req.requestType} · {new Date(req.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-4 ${cfg.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Acquired Solution Specs ──────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-700">Acquired Solution Specs</h2>
            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
              {acquiredSpecs.length} specs
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplaces/solution-specs')}
            className="text-orange-600 hover:text-orange-700 text-xs"
          >
            Browse Marketplace
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {acquiredSpecs.map((spec) => (
            <div
              key={spec.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => navigate(`/marketplaces/solution-specs/${spec.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-md">
                  {spec.solutionType}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md ${
                    spec.maturityLevel === 'reference'
                      ? 'bg-blue-100 text-blue-700'
                      : spec.maturityLevel === 'proven'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {spec.maturityLevel.charAt(0).toUpperCase() + spec.maturityLevel.slice(1)}
                </span>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-orange-700 transition-colors">
                {spec.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{spec.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {spec.diagramCount} diagrams
                  </span>
                  <span>{spec.componentCount} components</span>
                </div>
                {spec.downloadUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(spec.downloadUrl, '_blank');
                    }}
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-green-600 font-medium">Acquired</span>
                <span className="text-xs text-gray-400 ml-auto">
                  Updated {new Date(spec.lastUpdated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
