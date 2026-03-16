import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getLiveSpecRequests, statusConfig, type SpecRequest } from './SolutionSpecsOverview';

const steps = [
  { id: 'pending',      label: 'Submitted' },
  { id: 'under-review', label: 'Under Review' },
  { id: 'in-progress',  label: 'In Progress' },
  { id: 'completed',    label: 'Completed' },
];

const stepOrder = steps.map((s) => s.id);

export default function SpecsRequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const [allRequests, setAllRequests] = useState<SpecRequest[]>(() => getLiveSpecRequests());

  useEffect(() => {
    setAllRequests(getLiveSpecRequests());
  }, []);

  const request = allRequests.find((r) => r.id === requestId);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Not Found</h2>
        <p className="text-gray-500 mb-4">No request with ID "{requestId}" could be found.</p>
        <Button onClick={() => navigate('/stage2/specs/my-requests')}>
          Back to My Requests
        </Button>
      </div>
    );
  }

  const cfg = statusConfig[request.status];
  const StatusIcon = cfg.icon;
  const currentStepIndex = Math.max(0, stepOrder.indexOf(request.status));
  const progressPercentage = Math.max(5, (currentStepIndex / (steps.length - 1)) * 100);

  return (
    <div className="stage2-content p-6 max-w-5xl">
      {/* Back nav */}
      <button
        onClick={() => navigate('/stage2/specs/my-requests')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Requests
      </button>

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{request.solutionName}</h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}
              >
                <StatusIcon className="w-3 h-3" />
                {cfg.label}
              </span>
            </div>
            <p className="text-sm text-gray-400 font-mono">{request.id}</p>
          </div>

          {request.specId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/marketplaces/solution-specs/${request.specId}`)}
              className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <ExternalLink className="w-4 h-4" />
              View Linked Spec
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Progress + Summary */}
        <div className="lg:col-span-2 space-y-5">
          {/* Progress card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Request Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pt-4 pb-8 px-4">
                <div className="absolute top-[18px] left-0 w-full h-1 bg-gray-100 rounded-full" />
                <div
                  className="absolute top-[18px] left-0 h-1 bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                            isCompleted
                              ? 'bg-orange-500 border-orange-500 text-white'
                              : 'bg-white border-gray-200 text-gray-300'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-200" />
                          )}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium text-center ${
                            isCurrent
                              ? 'text-gray-900'
                              : isCompleted
                              ? 'text-gray-500'
                              : 'text-gray-300'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-3 text-sm mt-2">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-900">Current Status: </span>
                  <span className="text-gray-600">{cfg.label}</span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted on{' '}
                    {new Date(request.submittedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-orange-600" />
                Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Solution Name</p>
                  <p className="font-medium text-gray-900">{request.solutionName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Request Type</p>
                  <p className="font-medium text-gray-900">{request.requestType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Submitted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(request.submittedAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Reference ID</p>
                  <p className="font-medium text-gray-900 font-mono text-xs">{request.id}</p>
                </div>
                {request.assignedTo && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Assigned To</p>
                    <p className="font-medium text-gray-900">{request.assignedTo}</p>
                  </div>
                )}
                {request.specId && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-0.5">Linked Spec</p>
                    <button
                      onClick={() => navigate(`/marketplaces/solution-specs/${request.specId}`)}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                    >
                      {request.specId}
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Details sidebar */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-xs text-gray-400">Reference ID</span>
                <p className="font-mono font-medium text-gray-900 mt-0.5">{request.id}</p>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-gray-400">Status</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-gray-400">Request Type</span>
                <p className="font-medium text-gray-900 mt-0.5">{request.requestType}</p>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-gray-400">Submitted</span>
                <p className="font-medium text-gray-900 mt-0.5">
                  {new Date(request.submittedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {request.assignedTo && (
                <>
                  <Separator />
                  <div>
                    <span className="text-xs text-gray-400">Assigned To</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold">
                        {request.assignedTo.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{request.assignedTo}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {request.status === 'on-hold' && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Request On Hold</p>
                    <p className="text-xs text-gray-600">
                      This request has been paused. Please contact your assigned architect for more details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {request.status === 'completed' && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Build Completed</p>
                    <p className="text-xs text-gray-600">
                      Your solution spec build has been completed. Check the marketplace for the deliverables.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
