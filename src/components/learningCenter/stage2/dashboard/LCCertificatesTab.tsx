import { useState } from "react";
import { Award, Download, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dashboardCertificates,
  type DashboardCertificate,
} from "@/data/learningCenter/stage2/learnerDashboardData";

// Simple toast state
function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const show = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };
  return { message, show };
}

function CertificateModal({
  cert,
  onClose,
}: {
  cert: DashboardCertificate;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* DEWA header bar */}
        <div className="bg-[#1a2332] px-8 py-5 flex items-center justify-between">
          <div>
            <span className="text-sky-400 font-bold text-2xl tracking-widest">DEWA</span>
            <p className="text-gray-400 text-xs mt-0.5">Dubai Electricity & Water Authority</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate body */}
        <div className="px-8 py-8 text-center space-y-4 border-b-4 border-sky-400">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Award className="w-9 h-9 text-amber-500" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">Certificate of Completion</h2>
            <div className="mt-1 h-0.5 w-16 bg-sky-400 mx-auto rounded" />
          </div>

          <p className="text-sm text-gray-500">This certifies that</p>
          <p className="text-2xl font-bold text-gray-900">John Doe</p>
          <p className="text-sm text-gray-500">has successfully completed</p>
          <p className="text-base font-semibold text-[#1a2332] leading-snug px-4">
            {cert.courseName}
          </p>

          <div className="pt-4 flex justify-between items-end text-left">
            <div>
              <p className="text-xs text-gray-400">Issue Date</p>
              <p className="text-sm font-medium text-gray-700">{cert.issueDate}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Authorised by</p>
              <p className="text-sm font-medium text-gray-700">EA Office, DEWA</p>
              <div className="mt-1 border-t border-gray-400 pt-1 w-32 ml-auto">
                <p className="text-xs text-gray-400 italic">Corporate EA Office</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-4 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1"
            onClick={() => alert("Certificate downloaded (mock)")}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

function CertCard({
  cert,
  onView,
  onDownload,
}: {
  cert: DashboardCertificate;
  onView: (cert: DashboardCertificate) => void;
  onDownload: () => void;
}) {
  const isCourse = cert.type === "Course Completion";
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
            isCourse ? "bg-orange-100" : "bg-amber-100"
          }`}
        >
          <Award className={`w-8 h-8 ${isCourse ? "text-orange-600" : "text-amber-500"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <Badge
            className={`text-xs mb-2 ${
              isCourse ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {cert.type}
          </Badge>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{cert.courseName}</h3>
          <p className="text-xs text-gray-500 mt-1">Issued {cert.issueDate}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1"
          onClick={() => onView(cert)}
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-1"
          onClick={onDownload}
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </div>
  );
}

export default function LCCertificatesTab() {
  const [selectedCert, setSelectedCert] = useState<DashboardCertificate | null>(null);
  const toast = useToast();

  const handleDownload = (cert: DashboardCertificate) => {
    toast.show(`Certificate for "${cert.courseName}" downloaded.`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Award className="w-6 h-6 text-orange-500" />
        <div>
          <h2 className="text-base font-semibold text-gray-900">My Certificates</h2>
          <p className="text-xs text-gray-500">
            {dashboardCertificates.length} certificate{dashboardCertificates.length !== 1 ? "s" : ""} earned
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-700 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast.message}
        </div>
      )}

      {/* Certificate Grid */}
      {dashboardCertificates.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Award className="w-14 h-14 mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500">No certificates yet</p>
          <p className="text-sm mt-1">Complete a course or track to earn your first certificate.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {dashboardCertificates.map((cert) => (
            <CertCard
              key={cert.id}
              cert={cert}
              onView={(c) => setSelectedCert(c)}
              onDownload={() => handleDownload(cert)}
            />
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
}
