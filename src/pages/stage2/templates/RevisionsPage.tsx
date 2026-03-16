import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileEdit, 
  Clock, 
  Search, 
  Eye,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTemplateRevisions, type TemplateRevision } from "@/data/templates/revisionState";

const statusColors = {
  'Submitted': 'bg-blue-100 text-blue-700',
  'Assigned': 'bg-yellow-100 text-yellow-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Completed': 'bg-green-100 text-green-700',
};

// Calculate SLA status and time
const calculateSLA = (submittedDate: string, status: string, completedDate?: string, isAssignment = true) => {
  const submitted = new Date(submittedDate);
  const now = completedDate ? new Date(completedDate) : new Date();
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

export default function RevisionsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Load revisions from localStorage
  const allRevisions = getTemplateRevisions();

  const filteredRevisions = allRevisions.filter(rev => {
    const matchesSearch = rev.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rev.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rev.linkedRequestId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && rev.status !== 'Completed') ||
                          (statusFilter === 'completed' && rev.status === 'Completed');
    
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
            <span className="font-medium text-gray-900">Revisions</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Document Revisions</h1>
          <p className="text-gray-500 mt-1">Track revision requests for completed documents</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">How to request a revision</p>
          <p>Navigate to <span className="font-medium">My Requests</span>, open a completed request, and click <span className="font-medium">"Request Revision"</span>. Describe what needs to be changed, and a new revision ticket will be created.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search by revision ID, request ID, or document..." 
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-[120px]">Revision ID</TableHead>
              <TableHead>Document & Request</TableHead>
              <TableHead>Revision Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRevisions.length > 0 ? (
              filteredRevisions.map((revision) => {
                const assignSLA = calculateSLA(revision.submittedDate, revision.status, revision.completedDate, true);
                const completeSLA = calculateSLA(revision.submittedDate, revision.status, revision.completedDate, false);
                
                return (
                  <TableRow key={revision.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono text-xs font-medium text-gray-500">
                      {revision.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600 mt-0.5">
                          <FileEdit size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{revision.documentTitle}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/stage2/templates/my-requests/${revision.linkedRequestId}`);
                            }}
                            className="text-sm text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1"
                          >
                            Original: {revision.linkedRequestId}
                            <ExternalLink size={12} />
                          </button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {revision.revisionNote}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`font-normal ${statusColors[revision.status]}`}>
                        {revision.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock size={12} className={assignSLA.color} />
                          <span className={assignSLA.color}>Assign: {assignSLA.time}</span>
                        </div>
                        {revision.status !== 'Submitted' && (
                          <div className="flex items-center gap-1 text-xs">
                            <Clock size={12} className={completeSLA.color} />
                            <span className={completeSLA.color}>Complete: {completeSLA.time}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(revision.submittedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/stage2/templates/my-requests/${revision.linkedRequestId}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileEdit className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="font-medium text-gray-900 mb-1">No revision requests yet</p>
                    <p className="text-sm mb-4">Revisions can be requested from completed documents in My Requests</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/stage2/templates/my-requests')}
                    >
                      View My Requests
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
