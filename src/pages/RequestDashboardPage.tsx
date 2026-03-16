import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Download, Eye, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getUserRequests } from '@/data/requests/mockRequests';
import { RequestStatus, ServiceRequest } from '@/types/requests';
import { RequestDetailModal } from '@/components/portfolio/RequestDetailModal';

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

export default function RequestDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get user's requests
  const allRequests = user ? getUserRequests(user.id) : [];

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    return allRequests.filter(request => {
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesSearch = 
        searchQuery === '' ||
        request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [allRequests, statusFilter, searchQuery]);

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      total: allRequests.length,
      active: 0,
      completed: 0,
    };

    allRequests.forEach(request => {
      if (['submitted', 'under-review', 'approved', 'in-progress', 'pending-information'].includes(request.status)) {
        counts.active++;
      }
      if (['completed', 'delivered', 'closed'].includes(request.status)) {
        counts.completed++;
      }
    });

    return counts;
  }, [allRequests]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
                <p className="text-sm text-gray-600">Track and manage your service requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">{statusCounts.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Requests</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{statusCounts.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">{statusCounts.completed}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by service, type, or request ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending-information">Pending Info</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardContent className="pt-6">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery || statusFilter !== 'all' ? 'No requests found' : 'No requests yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start by exploring our services and submitting a request'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={() => navigate('/marketplaces/portfolio-management')}>
                    Browse Services
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => {
                      const StatusIcon = statusConfig[request.status].icon;
                      return (
                        <TableRow key={request.id} className="cursor-pointer hover:bg-gray-50">
                          <TableCell className="font-mono text-sm">{request.id}</TableCell>
                          <TableCell className="font-medium">{request.serviceName}</TableCell>
                          <TableCell>{request.requestType}</TableCell>
                          <TableCell>
                            <Badge className={`${statusConfig[request.status].color} gap-1`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig[request.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={priorityConfig[request.priority].color}>
                              {priorityConfig[request.priority].label}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(request.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Request Detail Modal */}
      <RequestDetailModal
        request={selectedRequest}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}
