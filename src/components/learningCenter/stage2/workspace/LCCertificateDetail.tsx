import { useState } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardCertificates } from "@/data/learningCenter/stage2/learnerDashboardData";

interface LCCertificateDetailProps {
  certId: string;
}

export default function LCCertificateDetail({ certId }: LCCertificateDetailProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const cert = dashboardCertificates.find((c) => c.id === certId);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!cert) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Certificate not found.
      </div>
    );
  }

  const isTrackCert = cert.type === "Track Completion";
  const accentColor = isTrackCert ? "#d97706" : "#0ea5e9"; // amber vs sky-blue
  const accentBg = isTrackCert ? "bg-amber-500" : "bg-sky-500";
  const accentText = isTrackCert ? "text-amber-600" : "text-sky-600";
  const accentBorder = isTrackCert ? "border-amber-300" : "border-sky-300";

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Certificate card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
          {/* Top bar — DEWA branding */}
          <div className="bg-[#1a2332] px-8 py-5 flex items-center justify-between">
            <div>
              <div className="text-2xl font-extrabold text-white tracking-widest">DEWA</div>
              <div className="text-xs text-gray-400 tracking-wider mt-0.5">
                Dubai Electricity & Water Authority
              </div>
            </div>
            <div className={`w-1 h-12 rounded-full ${accentBg}`} />
          </div>

          {/* Certificate body */}
          <div className={`border-b-4 ${accentBorder} px-8 py-10 text-center`}>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400 mb-3">
              {cert.type}
            </div>
            <div className={`text-3xl font-bold mb-6`} style={{ color: "#1a2332" }}>
              Certificate of Completion
            </div>

            <div className="space-y-1 mb-6">
              <div className="text-sm text-gray-500">This certifies that</div>
              <div className="text-2xl font-bold text-gray-900">John Doe</div>
            </div>

            <div className="space-y-1 mb-8">
              <div className="text-sm text-gray-500">has successfully completed</div>
              <div className={`text-lg font-semibold ${accentText}`}>{cert.courseName}</div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-0.5">
                  Issue Date
                </div>
                <div className="font-medium text-gray-700">{cert.issueDate}</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 mb-0.5">
                  Issued By
                </div>
                <div className="font-medium text-gray-700">
                  EA Office — Digital Transformation & Master Planning
                </div>
              </div>
            </div>
          </div>

          {/* Footer with seal placeholder */}
          <div className="px-8 py-5 bg-gray-50 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              Certificate ID: {cert.id.toUpperCase()}
            </div>
            <div
              className={`w-14 h-14 rounded-full border-4 ${accentBorder} flex items-center justify-center`}
              style={{ borderColor: accentColor }}
            >
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: accentColor, opacity: 0.2 }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-[#1a2332] hover:bg-[#263548] text-white"
            onClick={() => showToast("Certificate downloaded")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Certificates
          </Button>
        </div>
      </div>
    </div>
  );
}
