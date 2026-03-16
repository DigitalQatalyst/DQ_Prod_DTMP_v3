import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  Send, 
  User,
  Calendar,
  FileEdit,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTemplateTORequests, seedCompletedDemoRequest } from "@/data/templates/requestState";
import { addTemplateRevision } from "@/data/templates/revisionState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DocumentPreviewModal } from "@/components/templates/DocumentPreviewModal";

const steps = [
  { id: 'Open', label: 'Submitted' },
  { id: 'In Review', label: 'In Review' },
  { id: 'Resolved', label: 'Completed' }
];

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  
  // Seed demo request
  React.useEffect(() => {
    seedCompletedDemoRequest();
  }, []);

  const allRequests = getTemplateTORequests();
  const request = allRequests.find(r => r.id === requestId);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-semibold">Request Not Found</h2>
        <Button onClick={() => navigate('/stage2/templates/my-requests')} className="mt-4">
          Back to My Requests
        </Button>
      </div>
    );
  }

  // Calculate current step index for progress bar
  const currentStepIndex = steps.findIndex(s => s.id === request.status);
  const progressPercentage = Math.max(5, (currentStepIndex / (steps.length - 1)) * 100);

  const handleRequestRevision = () => {
    if (!revisionNote.trim()) return;
    
    // Create the revision record
    const revision = addTemplateRevision({
      linkedRequestId: request.id,
      documentType: request.tab === 'assessments' ? 'Assessment' : 'Application Profile',
      documentTitle: request.templateTitle,
      revisionNote: revisionNote,
    });
    
    if (revision) {
      console.log('Revision created:', revision);
      
      setShowRevisionModal(false);
      setRevisionNote('');
      
      // Show success message and navigate to revisions page
      setTimeout(() => {
        navigate('/stage2/templates/revisions');
      }, 100);
    }
  };

  // Parse the message to extract form data
  const messageLines = request.message.split('\n');
  const formData: Record<string, string> = {};
  messageLines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      formData[key] = value;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <button 
            onClick={() => navigate('/stage2/templates/my-requests')}
            className="flex items-center hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Requests
          </button>
          <span className="mx-2 text-gray-300">/</span>
          <span className="font-medium text-gray-900">{request.id}</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{request.templateTitle}</h1>
              <Badge variant="outline" className="text-gray-500 bg-gray-50">
                {request.tab === 'assessments' ? 'Assessment' : 'Application Profile'}
              </Badge>
            </div>
            <p className="text-gray-500 max-w-2xl">{formData['Assessment Request'] || formData['Application Profile Request'] || 'Document request'}</p>
          </div>
          
          <div className="flex gap-2">
            {request.status === 'Resolved' && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setPreviewDocument({
                    id: request.id,
                    title: request.templateTitle,
                    type: request.tab === 'assessments' ? 'Assessment' : 'Application Profile',
                    completedDate: request.updatedAt,
                    format: ['PDF', 'DOCX'],
                  })}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowRevisionModal(true)}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <FileEdit className="w-4 h-4 mr-2" />
                  Request Revision
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Status & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Request Status</span>
                <Badge className={
                  request.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                  request.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                }>
                  {request.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pt-4 pb-8 px-4">
                {/* Progress Bar Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                
                {/* Active Progress */}
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }} 
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 transition-colors ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-white border-gray-200 text-gray-300'
                        }`}>
                          {isCompleted ? <CheckCircle size={14} /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${
                          isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-500' : 'text-gray-300'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="font-medium text-gray-900">Current Status: </span>
                  <span className="text-gray-600">{request.status}</span>
                  <p className="text-xs text-gray-400 mt-1">
                    {request.status === 'Resolved' 
                      ? `Completed on ${new Date(request.updatedAt).toLocaleDateString()}`
                      : `Submitted on ${new Date(request.createdAt).toLocaleDateString()}`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Preview / Download */}
          {request.status === 'Resolved' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {request.templateTitle.replace(/ /g, '_')}_v1.0.pdf
                      </h4>
                      <p className="text-sm text-gray-500">
                        v1.0 • 2.4 MB • {new Date(request.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setPreviewDocument({
                        id: request.id,
                        title: request.templateTitle,
                        type: request.tab === 'assessments' ? 'Assessment' : 'Application Profile',
                        completedDate: request.updatedAt,
                        format: ['PDF', 'DOCX'],
                      })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Need changes?</p>
                      <p>Click "Request Revision" to describe what needs to be updated. A new revision ticket will be created and tracked separately.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Request Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{key}</span>
                    <p className="text-sm text-gray-900 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-gray-400">Request ID</span>
                <p className="text-sm font-mono font-medium text-gray-900 mt-1">{request.id}</p>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-gray-400">Assigned To</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    TO
                  </div>
                  <span className="text-sm font-medium text-gray-900">TO Team</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400">Submitted</span>
                  <p className="text-sm font-medium mt-0.5">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Status</span>
                  <p className="text-sm font-medium mt-0.5">{request.status}</p>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-gray-400">Document Type</span>
                <p className="text-sm font-medium mt-0.5">{request.templateTitle}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400">Category</span>
                <p className="text-sm font-medium mt-0.5">
                  {request.tab === 'assessments' ? 'Assessment' : 'Application Profile'}
                </p>
              </div>
            </CardContent>
          </Card>

          {request.status === 'Resolved' && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileEdit className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Need Revisions?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Request changes to this completed document
                  </p>
                  <Button 
                    onClick={() => setShowRevisionModal(true)}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Request Revision
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Revision Request Modal */}
      <Dialog open={showRevisionModal} onOpenChange={setShowRevisionModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Document Revision</DialogTitle>
            <DialogDescription>
              Describe what changes you'd like made to the document. A new revision ticket will be created and tracked in the Revisions page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="revision-note">What needs to be revised? <span className="text-red-500">*</span></Label>
              <Textarea
                id="revision-note"
                placeholder="e.g., Please update the cloud infrastructure section to include Azure services, and add more detail on the security controls..."
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                Be specific about what needs to change. The original document and context will be automatically included.
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Original Request</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="font-medium">Document:</span> {request.templateTitle}</p>
                <p><span className="font-medium">Request ID:</span> {request.id}</p>
                <p><span className="font-medium">Completed:</span> {new Date(request.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRevisionModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRequestRevision}
              disabled={!revisionNote.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Submit Revision Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
