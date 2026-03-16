import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  ExternalLink
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
import { getTemplateTORequests, seedCompletedDemoRequest } from "@/data/templates/requestState";
import { DocumentPreviewModal } from "@/components/templates/DocumentPreviewModal";

export default function MyDocumentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [previewDocument, setPreviewDocument] = useState<any>(null);

  // Seed demo completed request on mount
  React.useEffect(() => {
    seedCompletedDemoRequest();
  }, []);

  // Get completed requests from localStorage
  const allRequests = getTemplateTORequests();
  const completedRequests = allRequests.filter(r => r.status === 'Resolved');

  const filteredDocuments = completedRequests.filter(doc => {
    const matchesSearch = doc.templateTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.tab === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handlePreview = (doc: any) => {
    setPreviewDocument({
      id: doc.id,
      title: doc.templateTitle,
      type: doc.tab === 'assessments' ? 'Assessment' : 'Application Profile',
      completedDate: doc.updatedAt,
      format: ['PDF', 'DOCX'],
    });
  };

  const handleDownload = (docId: string, format: string) => {
    // Simulate download
    console.log(`Downloading document ${docId} in ${format} format`);
    // In real implementation, this would trigger actual file download
  };

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
            <span className="font-medium text-gray-900">My Documents</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Completed Documents</h1>
          <p className="text-gray-500 mt-1">Download and preview your delivered documents</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search documents..." 
            className="pl-9 bg-gray-50 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Button 
            variant={typeFilter === 'all' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setTypeFilter('all')}
            className={typeFilter === 'all' ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          >
            All
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
            Application Profiles
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead>Document Name</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead>Delivered Date</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-50 rounded-lg text-green-600 mt-0.5">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{doc.templateTitle}</div>
                        <div className="text-sm text-gray-500">{doc.message.split('\n')[0]}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {doc.tab === 'assessments' ? 'Assessment' : 'Application Profile'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/stage2/templates/my-requests/${doc.id}`)}
                      className="font-mono text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      {doc.id}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">PDF</Badge>
                      <Badge variant="secondary" className="text-xs">DOCX</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePreview(doc)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(doc.id, 'pdf')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mb-3" />
                    <p>No completed documents yet.</p>
                    <Button 
                      variant="link" 
                      onClick={() => navigate('/marketplaces/document-studio')}
                      className="text-purple-600"
                    >
                      Browse document types to get started
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreviewModal
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          document={previewDocument}
        />
      )}
    </div>
  );
}
