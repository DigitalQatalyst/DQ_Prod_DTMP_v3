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
  Eye
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
import { documentRequests, DocumentRequest } from "@/data/stage2/templatesData";

const statusColors = {
  'submitted': 'bg-blue-100 text-blue-700',
  'under-review': 'bg-yellow-100 text-yellow-700',
  'generating': 'bg-purple-100 text-purple-700',
  'review-required': 'bg-orange-100 text-orange-700',
  'delivered': 'bg-green-100 text-green-700',
  'completed': 'bg-gray-100 text-gray-700',
  'cancelled': 'bg-red-100 text-red-700'
};

const priorityColors = {
  'low': 'text-gray-500',
  'normal': 'text-blue-500',
  'high': 'text-orange-500',
  'urgent': 'text-red-500 font-bold'
};

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requests, setRequests] = useState<DocumentRequest[]>([]);

  // Load requests from localStorage and merge with default data
  React.useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('documentRequests') || '[]');
    const allRequests = [...storedRequests, ...documentRequests];
    setRequests(allRequests);
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.templateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center text-sm text-gray-500 mb-2">
            <button 
              onClick={() => navigate('/stage2/templates/overview')}
              className="hover:text-gray-900 transition-colors"
            >
              Overview
            </button>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-medium text-gray-900">My Requests</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Document Requests</h1>
          <p className="text-gray-500 mt-1">Track and manage your document generation requests</p>
        </div>
        <Button onClick={() => navigate('/stage2/templates/new-request')} className="bg-orange-600 hover:bg-orange-700">
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
            onClick={() => setStatusFilter('active')} // Logic for active needs adjustment if I want 'active' to mean not completed
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Document Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-gray-50/50 cursor-pointer" onClick={() => navigate(`/stage2/templates/my-requests/${request.id}`)}>
                  <TableCell className="font-mono text-xs font-medium text-gray-500">
                    {request.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{request.title}</div>
                        <div className="text-sm text-gray-500">{request.templateTitle}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`font-normal ${statusColors[request.status as keyof typeof statusColors]}`}>
                      {request.status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-[120px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{request.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${request.status === 'completed' || request.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`} 
                          style={{ width: `${request.progress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 truncate max-w-[120px]">
                        {request.currentStep}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{new Date(request.submittedDate).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-400">Due: {new Date(request.expectedDeliveryDate).toLocaleDateString()}</span>
                    </div>
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
                        {request.generatedDocument && (
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" /> Download
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p>No requests found matching your filters.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {setSearchQuery(''); setStatusFilter('all');}}
                      className="text-orange-600"
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
