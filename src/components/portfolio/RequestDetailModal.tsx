import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  MessageSquare,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { ServiceRequest, RequestStatus } from '@/types/requests';

interface RequestDetailModalProps {
  request: ServiceRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<RequestStatus, { label: string; color: string; icon: any }> = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: Clock },
  'under-review': { label: 'Under Review', color: 'bg-purple-100 text-purple-800', icon: Eye },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'pending-information': { label: 'Pending Info', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  delivered: { label: 'Delivered', color: 'bg-teal-100 text-teal-800', icon: Download },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800', icon: CheckCircle2 },
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
};

export function RequestDetailModal({ request, isOpen, onClose }: RequestDetailModalProps) {
  if (!request) return null;

  const StatusIcon = statusConfig[request.status].icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{request.serviceName}</DialogTitle>
              <DialogDescription className="text-base">
                Request ID: <span className="font-mono font-semibold">{request.id}</span>
              </DialogDescription>
            </div>
            <Badge className={`${statusConfig[request.status].color} gap-1 ml-4`}>
              <StatusIcon className="h-3 w-3" />
              {statusConfig[request.status].label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Request Overview */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Request Details
            </h3>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Request Type</p>
                <p className="font-medium">{request.requestType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Priority</p>
                <Badge className={priorityConfig[request.priority].color}>
                  {priorityConfig[request.priority].label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Submitted</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {formatShortDate(request.submittedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Desired Completion</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  {request.desiredCompletionDate}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{request.userName}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{request.userEmail}</span>
              </p>
            </div>
          </div>

          {/* Business Justification */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Business Justification</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{request.businessJustification}</p>
            </div>
          </div>

          {/* Optional Fields */}
          {(request.scope || request.stakeholders || request.budgetCode) && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                {request.scope && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Scope</p>
                    <p className="font-medium capitalize">{request.scope.replace('-', ' ')}</p>
                  </div>
                )}
                {request.stakeholders && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Stakeholders</p>
                    <p className="font-medium">{request.stakeholders}</p>
                  </div>
                )}
                {request.budgetCode && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Budget Code</p>
                    <p className="font-medium font-mono">{request.budgetCode}</p>
                  </div>
                )}
                {request.additionalRequirements && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Additional Requirements</p>
                    <p className="text-gray-700">{request.additionalRequirements}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Status History
            </h3>
            <div className="space-y-3">
              {request.statusHistory.map((history, index) => {
                const HistoryIcon = statusConfig[history.status].icon;
                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full ${statusConfig[history.status].color} flex items-center justify-center`}>
                        <HistoryIcon className="h-4 w-4" />
                      </div>
                      {index < request.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold">{statusConfig[history.status].label}</p>
                        <p className="text-sm text-gray-500">{formatDate(history.timestamp)}</p>
                      </div>
                      {history.comment && (
                        <p className="text-sm text-gray-600">{history.comment}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          {request.comments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Comments & Updates
              </h3>
              <div className="space-y-3">
                {request.comments.map((comment) => (
                  <div key={comment.id} className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-blue-900">{comment.author}</p>
                      <p className="text-sm text-blue-600">{formatDate(comment.timestamp)}</p>
                    </div>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {request.deliverables.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600" />
                Deliverables
              </h3>
              <div className="space-y-2">
                {request.deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{deliverable.name}</p>
                        <p className="text-sm text-gray-600">
                          {deliverable.type} • {deliverable.size} • Uploaded {formatShortDate(deliverable.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {request.status !== 'closed' && (
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact Team
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
