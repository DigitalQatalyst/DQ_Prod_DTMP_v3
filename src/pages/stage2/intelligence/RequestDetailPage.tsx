import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, User, Calendar, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { dashboardRequests } from '@/data/digitalIntelligence/stage2';

export default function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const request = dashboardRequests.find(r => r.id === requestId);

  if (!request) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Request not found</h3>
          <p className="text-gray-600 mb-4">The requested item could not be found.</p>
          <Button onClick={() => navigate('/stage2/intelligence/requests')}>
            Back to Requests
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'under-review':
        return 'bg-yellow-100 text-yellow-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/stage2/intelligence/requests')}
        className="mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Requests
      </Button>

      {/* Request Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{request.id}</h1>
          <Badge className={getStatusColor(request.status)}>
            {request.status.replace('-', ' ')}
          </Badge>
          <Badge className={getPriorityColor(request.priority)}>
            {request.priority}
          </Badge>
        </div>
        <p className="text-gray-600">{request.dashboardName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Request Type</label>
                <p className="text-gray-900 capitalize">{request.requestType.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900">{request.description}</p>
              </div>
              {request.requestedDataSource && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Requested Data Source</label>
                    <p className="text-gray-900">{request.requestedDataSource.name}</p>
                  </div>
                  {request.requestedDataSource.instanceUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Instance URL</label>
                      <p className="text-gray-900">{request.requestedDataSource.instanceUrl}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Justification</label>
                    <p className="text-gray-900">{request.requestedDataSource.justification}</p>
                  </div>
                </>
              )}
              {request.resolution && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="text-sm font-medium text-green-900 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Resolution
                  </label>
                  <p className="text-green-900">{request.resolution}</p>
                </div>
              )}
              {request.declineReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label className="text-sm font-medium text-red-900 flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    Decline Reason
                  </label>
                  <p className="text-red-900">{request.declineReason}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Messages */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
            <div className="space-y-4">
              {request.messages.length > 0 ? (
                request.messages.map(message => (
                  <div key={message.id} className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{message.from.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.from.role === 'transformation-office' ? 'TO Staff' : 'Requester'}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-auto">{formatDate(message.timestamp)}</span>
                    </div>
                    <p className="text-gray-700">{message.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No messages yet</p>
              )}
            </div>

            {/* Add Message */}
            {request.status !== 'completed' && request.status !== 'declined' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Add a message</label>
                <Textarea placeholder="Type your message here..." className="mb-3" />
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Request Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Request Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-600">Submitted</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(request.submittedDate)}
                </p>
              </div>
              {request.expectedCompletionDate && (
                <div>
                  <label className="text-gray-600">Expected Completion</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(request.expectedCompletionDate)}
                  </p>
                </div>
              )}
              {request.actualCompletionDate && (
                <div>
                  <label className="text-gray-600">Completed</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(request.actualCompletionDate)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Requester */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Requester</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900 font-medium">{request.requestedBy.name}</p>
              <p className="text-gray-600">{request.requestedBy.role}</p>
              <p className="text-gray-600">{request.requestedBy.email}</p>
            </div>
          </Card>

          {/* Assigned To */}
          {request.assignedTo && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Assigned To</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-900 font-medium">{request.assignedTo.name}</p>
                <p className="text-gray-600">{request.assignedTo.role}</p>
              </div>
            </Card>
          )}

          {/* Notifications */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={request.notifyEmail} readOnly className="rounded" />
                <label className="text-gray-700">Email notifications</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={request.notifyInApp} readOnly className="rounded" />
                <label className="text-gray-700">In-app notifications</label>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
