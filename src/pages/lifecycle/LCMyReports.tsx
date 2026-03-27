import { useMemo } from "react";
import { Download, Eye } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import {
  getLCRequests,
  type LCServiceRequest,
} from "@/data/lifecycle/serviceRequestState";
import { getDemoAccount, getLifecycleRole } from "@/data/shared/lifecycleRole";

const isDeliveredOrCompleted = (r: LCServiceRequest) => r.status === "Delivered" || r.status === "Completed";

const toDeliveryDate = (r: LCServiceRequest) => {
  const dt = r.deliveredAt ?? r.updatedAt ?? r.submittedAt;
  return dt;
};

export default function LCMyReports() {
  const role = getLifecycleRole() ?? "initiative-owner";
  const account = getDemoAccount(role);

  const requests = useMemo(() => getLCRequests(account.name), [account.name]);

  const reports = useMemo(() => {
    return [...requests]
      .filter(isDeliveredOrCompleted)
      .sort((a, b) => new Date(toDeliveryDate(b)).getTime() - new Date(toDeliveryDate(a)).getTime());
  }, [requests]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
          <p className="text-gray-500 mt-1">Delivered service outputs (demo).</p>
        </div>
        <Badge variant="outline" className="border-gray-200">
          {reports.length} reports
        </Badge>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="p-5 text-sm text-gray-600">
            No delivered outputs found for your demo role yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => {
            const deliveryDate = new Date(toDeliveryDate(r)).toLocaleDateString();
            const fmt = r.deliverableFormat ?? "PDF";
            return (
              <Card key={r.id}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 truncate">{r.deliverableTitle ?? r.serviceType}</h2>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        Initiative: {r.initiativeName}
                        {r.projectName ? ` · Project: ${r.projectName}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-green-100 text-green-700 border-green-200 border">{r.status}</Badge>
                      <Badge variant="outline" className="border-gray-200 text-xs">
                        {fmt}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm text-gray-500">Delivered: {deliveryDate}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        className="bg-white"
                        onClick={() =>
                          toast({
                            title: "Demo-only",
                            description: "Inline report viewing is not implemented in Stage 2 yet.",
                          })
                        }
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        onClick={() =>
                          toast({
                            title: "Demo-only",
                            description: `Download is demo-only. Expected format: ${fmt}.`,
                          })
                        }
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700">
                    Notes: {r.notes ?? "-"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

