import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  Send, 
  Paperclip,
  User,
  Bot,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { documentRequests } from "@/data/stage2/templatesData";

const steps = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'under-review', label: 'Review' },
  { id: 'generating', label: 'AI Generation' },
  { id: 'review-required', label: 'QA Check' },
  { id: 'delivered', label: 'Delivered' }
];

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  
  const request = documentRequests.find(r => r.id === requestId);

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
              <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
              <Badge variant="outline" className="text-gray-500 bg-gray-50">
                {request.templateTitle}
              </Badge>
            </div>
            <p className="text-gray-500 max-w-2xl">{request.description}</p>
          </div>
          
          <div className="flex gap-2">
            {request.generatedDocument && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Download Document
              </Button>
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
                  request.status === 'completed' || request.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  request.status === 'generating' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }>
                  {request.status.replace('-', ' ').toUpperCase()}
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
                  <span className="font-medium text-gray-900">Current Step: </span>
                  <span className="text-gray-600">{request.currentStep}</span>
                  <p className="text-xs text-gray-400 mt-1">
                    Expected delivery by {new Date(request.expectedDeliveryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Preview / Download */}
          {request.generatedDocument && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {request.generatedDocument.fileName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        v{request.generatedDocument.version} • {request.generatedDocument.fileSize} • {new Date(request.generatedDocument.generatedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* Revisions */}
                {request.revisions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Previous Versions</h4>
                    <div className="space-y-2">
                      {request.revisions.map((rev) => (
                        <div key={rev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">v{rev.version}</span>
                            <span className="text-gray-600">{rev.changes}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-400 text-xs">
                            <span>{new Date(rev.generatedDate).toLocaleDateString()}</span>
                            <Download className="w-3 h-3 cursor-pointer hover:text-gray-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Messages / Communication */}
          <Card className="flex flex-col h-[500px]">
            <CardHeader className="border-b border-gray-100 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                Communication
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {request.messages.length} messages
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {request.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.from.role === 'requester' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.from.role === 'requester' ? 'bg-gray-900 text-white' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {msg.from.role === 'requester' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`flex flex-col max-w-[80%] ${msg.from.role === 'requester' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{msg.from.name}</span>
                      <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-sm ${
                      msg.from.role === 'requester' 
                        ? 'bg-gray-100 text-gray-800 rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-700 shadow-sm rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Type a message or feedback..." 
                  className="min-h-[40px] max-h-[120px] bg-white resize-none"
                  rows={1}
                />
                <Button size="icon" className="bg-orange-600 hover:bg-orange-700 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
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
                <span className="text-xs text-gray-400">Assigned To</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {request.assignedTo?.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{request.assignedTo?.name}</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400">Submitted</span>
                  <p className="text-sm font-medium mt-0.5">{new Date(request.submittedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Priority</span>
                  <p className="text-sm font-medium mt-0.5 capitalize">{request.priority}</p>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-xs text-gray-400">Inputs Provided</span>
                <ul className="mt-2 space-y-2">
                  {request.inputs.slice(0, 3).map((input, i) => (
                    <li key={i} className="text-xs">
                      <span className="text-gray-500 block">{input.label}</span>
                      <span className="text-gray-900 font-medium truncate block">
                        {Array.isArray(input.value) ? input.value.join(', ') : input.value.toString()}
                      </span>
                    </li>
                  ))}
                  {request.inputs.length > 3 && (
                    <li className="text-xs text-orange-600 cursor-pointer hover:underline">
                      + {request.inputs.length - 3} more details
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
