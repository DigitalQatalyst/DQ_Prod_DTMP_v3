import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { allRequests, statusConfig, SpecRequest } from './SolutionSpecsOverview';

type StatusFilter = SpecRequest['status'] | 'all';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all',          label: 'All' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'in-progress',  label: 'In Progress' },
  { value: 'completed',    label: 'Completed' },
  { value: 'pending',      label: 'Pending' },
  { value: 'on-hold',      label: 'On Hold' },
];

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = allRequests.filter((req) => {
    const matchesStatus = activeFilter === 'all' || req.status === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      req.solutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requestType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="stage2-content p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">My Requests</h1>
          <p className="text-sm text-gray-500">Track and manage your solution spec requests</p>
        </div>
        <Button
          onClick={() => navigate('/marketplaces/solution-specs')}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          New Request
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === f.value
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className={`ml-1.5 ${activeFilter === f.value ? 'text-orange-200' : 'text-gray-400'}`}>
                  {allRequests.filter((r) => r.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className="col-span-1">Ref</div>
          <div className="col-span-4">Solution Name</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Submitted</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Spec</div>
        </div>

        {/* Rows */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filtered.map((req) => {
              const cfg = statusConfig[req.status];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={req.id}
                  className="grid grid-cols-12 gap-2 px-5 py-4 items-center hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1">
                    <span className="text-xs font-mono text-gray-400">{req.id}</span>
                  </div>

                  <div className="col-span-4 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{req.solutionName}</p>
                    {req.assignedTo && (
                      <p className="text-xs text-gray-400 mt-0.5">Assigned to {req.assignedTo}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">{req.requestType}</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">
                      {new Date(req.submittedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-end">
                    {req.specId ? (
                      <button
                        onClick={() => navigate(`/marketplaces/solution-specs/${req.specId}`)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        title="View linked spec"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No requests match your filter.</p>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          Showing {filtered.length} of {allRequests.length} requests
        </p>
      )}
    </div>
  );
}
