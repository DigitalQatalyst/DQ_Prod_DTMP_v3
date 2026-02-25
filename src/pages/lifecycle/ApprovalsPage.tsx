import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approvalWorkflows } from "@/data/lifecycle/lifecycleData";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function ApprovalsPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-500 mt-1">Review and approve lifecycle gate submissions</p>
      </div>

      <div className="space-y-4">
        {approvalWorkflows.map((approval) => (
          <Card key={approval.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{approval.lifecycleInstanceName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{approval.gate.name} • {approval.gate.stage}</p>
                  <p className="text-sm text-gray-500">{approval.submissionNotes}</p>
                </div>
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {approval.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                  <p className="text-sm font-medium">{approval.submittedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Submitted Date</p>
                  <p className="text-sm font-medium">{new Date(approval.submittedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Decision Due</p>
                  <p className="text-sm font-medium">{new Date(approval.expectedDecisionDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">Approvers ({approval.receivedApprovals}/{approval.requiredApprovals})</p>
                {approval.approvals.map((approver, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {approver.decision === 'approved' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{approver.approverName}</p>
                        <p className="text-xs text-gray-500">{approver.approverRole}</p>
                      </div>
                    </div>
                    <Badge className={approver.decision === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {approver.decision}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => navigate(`/stage2/lifecycle/approvals/${approval.id}`)}>Review Details</Button>
                <Button variant="outline">View Instance</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
