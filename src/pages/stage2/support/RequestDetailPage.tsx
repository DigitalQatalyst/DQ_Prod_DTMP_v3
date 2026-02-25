import { useParams, useNavigate } from "react-router-dom";
import SupportLayout from "./SupportLayout";
import { serviceRequests } from "@/data/supportData";
import { ApprovalWorkflow } from "@/components/stage2";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const request = serviceRequests.find((r) => r.id === requestId);

  if (!request) {
    return (
      <SupportLayout title="Request not found">
        <div className="bg-white border border-gray-200 rounded-lg p-6">Request {requestId} not found.</div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout title={request.title} description={request.id}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-orange-700 font-semibold mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            <p className="text-sm text-gray-700 mt-1">{request.description}</p>
            <p className="text-xs text-gray-600 mt-1">Type: {request.type}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Requested Items</h3>
            <ul className="space-y-2">
              {request.requestedItems.map((item) => (
                <li key={item.id} className="border border-gray-200 rounded-md p-2">
                  <p className="text-sm font-semibold text-gray-900">{item.itemName}</p>
                  <p className="text-xs text-gray-600">{item.itemType} • {item.itemDetails}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Activity Log</h3>
            <ul className="space-y-2">
              {request.activityLog.map((log) => (
                <li key={log.id} className="text-sm text-gray-700">
                  <span className="font-semibold">{log.actor}</span> • {log.action}
                  {log.details && <span className="text-gray-600"> — {log.details}</span>}
                  <span className="text-xs text-gray-500 block">{new Date(log.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Approvals</h3>
            <ApprovalWorkflow steps={request.approvalWorkflow} />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Status</h3>
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <CheckCircle className="text-green-600" size={18} />
              <span className="capitalize">{request.status.replace("-", " ")}</span>
            </div>
            {request.estimatedCompletionDate && (
              <p className="text-xs text-gray-600 mt-1">ETA: {new Date(request.estimatedCompletionDate).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
