import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboardRequests } from '@/data/digitalIntelligence/stage2';

export default function MyRequestsPage() {
  const navigate = useNavigate();

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusCounts = {
    submitted: dashboardRequests.filter(r => r.status === 'submitted').length,
    underReview: dashboardRequests.filter(r => r.status === 'under-review').length,
    inProgress: dashboardRequests.filter(r => r.status === 'in-progress').length,
    completed: dashboardRequests.filter(r => r.status === 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-600 mt-1">Track your dashboard update and data source requests</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.submitted}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.underReview}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.inProgress}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Requests List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Requests</h2>
        <div className="space-y-3">
          {dashboardRequests.map(request => (
            <Card
              key={request.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/stage2/intelligence/requests/${request.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{request.id}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(request.priority)}>
                      {request.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.dashboardName}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{request.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Submitted {formatDate(request.submittedDate)}</span>
                  {request.messages.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {request.messages.length} {request.messages.length === 1 ? 'message' : 'messages'}
                      </span>
                    </>
                  )}
                  {request.assignedTo && (
                    <>
                      <span>•</span>
                      <span>Assigned to {request.assignedTo.name}</span>
                    </>
                  )}
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View Details →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State (if no requests) */}
      {dashboardRequests.length === 0 && (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests yet</h3>
          <p className="text-gray-600 mb-4">
            Request dashboard updates or new data sources to improve your intelligence services
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Request
          </Button>
        </Card>
      )}
    </div>
  );
}
