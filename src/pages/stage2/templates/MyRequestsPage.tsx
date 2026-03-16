import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  ChevronRight, 
  MoreHorizontal,
  Download,
  Eye,
  User,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTemplateTORequests, seedCompletedDemoRequest } from "@/data/templates/requestState";

const statusColors = {
  'Open': 'bg-blue-100 text-blue-700',
  'In Review': 'bg-yellow-100 text-yellow-700',
  'Resolved': 'bg-green-100 text-green-700',
};

// Calculate SLA status and time
const calculateSLA = (submittedDate: string, status: string, isAssignment: boolean) => {
  const submitted = new Date(submittedDate);
  const now = new Date();
  const hoursElapsed = (now.getTime() - submitted.getTime()) / (1000 * 60 * 60);
  
  // SLA thresholds (in hours)
  const assignSLA = 24; // 24 hours to assign
  const completeSLA = 5 * 8; // 5 business days (40 hours)
  
  const threshold = isAssignment ? assignSLA : completeSLA;
  const percentage = (hoursElapsed / threshold) * 100;
  
  let slaStatus: 'on-track' | 'approaching' | 'breached';
  if (percentage < 70) slaStatus = 'on-track';
  else if (percentage < 100) slaStatus = 'approaching';
  else slaStatus = 'breached';
  
  const days = Math.floor(hoursElapsed / 24);
  const hours = Math.floor(hoursElapsed % 24);
  
  return {
    status: slaStatus,
    time: days > 0 ? `${days}d ${hours}h` : `${hours}h`,
    color: slaStatus === 'on-track' ? 'text-green-600' : slaStatus === 'approaching' ? 'text-yellow-600' : 'text-red-600'
  };
};

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Seed demo completed request on mount
  React.useEffect(() => {
    seedCompletedDemoRequest();
  }, []);

  // Load requests from localStorage
  const allRequests = getTemplateTORequests();

  const filteredRequests = allRequests.filter(req => {
    const matchesSearch = req.templateTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && req.status !== 'Resolved') ||
                          (statusFilter === 'completed' && req.status === 'Resolved');
    const matchesType = typeFilter === 'all' || req.tab === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-500 mt-1">Track status and SLA for all your document requests</p>
        </div>
        <Button onClick={() => navigate('/marketplaces/document-studio')} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search by title, ID, or template..." 
            className="pl-9 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={statusFilter === 'all' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'active' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setStatusFilter('active')}
            className={statusFilter === 'active' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            Active
          </Button>
          <Button 
            variant={statusFilter === 'completed' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setStatusFilter('completed')}
            className={statusFilter === 'completed' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            Completed
          </Button>
          <div className="w-px bg-gray-200 mx-1"></div>
          <Button 
            variant={typeFilter === 'all' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setTypeFilter('all')}
            className={typeFilter === 'all' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            All Types
          </Button>
          <Button 
            variant={typeFilter === 'assessments' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setTypeFilter('assessments')}
            className={typeFilter === 'assessments' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            Assessments
          </Button>
          <Button 
            variant={typeFilter === 'application-profiles' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setTypeFilter('application-profiles')}
            className={typeFilter === 'application-profiles' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            Profiles
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[120px]">Request ID</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Tab / Category</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>SLA - Assign</TableHead>
              <TableHead>SLA - Complete</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const assignSLA = calculateSLA(request.createdAt, request.status, true);
                const completeSLA = calculateSLA(request.createdAt, request.status, false);
                
                return (
                  <TableRow key={request.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => navigate(`/stage2/templates/my-requests/${request.id}`)}>
                    <TableCell className="font-mono text-xs font-medium text-purple-600">
                      {request.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{request.templateTitle}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{request.message.split('\n')[0]}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {request.tab === 'assessments' ? 'Assessment' : 'Application Profile'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`font-normal ${statusColors[request.status as keyof typeof statusColors]}`}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status !== 'Open' ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User size={14} />
                          <span>TO Team</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Pending</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 text-xs font-medium ${assignSLA.color}`}>
                        <Clock size={12} />
                        <span>{assignSLA.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.status !== 'Open' ? (
                        <div className={`flex items-center gap-1 text-xs font-medium ${completeSLA.color}`}>
                          <Clock size={12} />
                          <span>{completeSLA.time}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/stage2/templates/my-requests/${request.id}`)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {request.status === 'Resolved' && (
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" /> Download
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p>No requests found matching your filters.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all');}}
                      className="text-purple-600"
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
