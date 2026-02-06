import {
  Award,
  CheckCircle,
  Circle,
  Lock,
  Download,
  GraduationCap,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserCourseData } from "@/data/learningCenter/stage2/types";

interface UserCertificateTabProps {
  data: UserCourseData;
}

const UserCertificateTab = ({ data }: UserCertificateTabProps) => {
  const allMet = data.certificateRequirements.every((r) => r.met);

  return (
    <div className="space-y-8">
      {/* Certificate Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
              allMet ? "bg-green-100" : "bg-orange-100"
            }`}
          >
            <GraduationCap
              className={`w-7 h-7 ${
                allMet ? "text-green-600" : "text-orange-600"
              }`}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-primary-navy mb-1">
              Course Certificate
            </h3>
            <Badge
              className={`${
                allMet
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              } border-0`}
            >
              {allMet ? "Earned" : "In Progress"}
            </Badge>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Requirements for Certificate
          </h4>
          {data.certificateRequirements.map((req) => (
            <div key={req.id} className="flex items-start gap-3">
              {req.met ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span
                  className={`text-sm ${
                    req.met ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {req.text}
                </span>
                {req.detail && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ({req.detail})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Estimated completion: February 28, 2026
        </p>
      </div>

      {/* Certificate Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-4">
          Certificate Preview
        </h3>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center ${
            allMet ? "border-green-300 bg-green-50/30" : "border-gray-300 bg-gray-50/50 opacity-50 grayscale"
          }`}
        >
          {!allMet && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-6 py-3 flex items-center gap-2 shadow-sm">
                <Lock className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">
                  Complete course to unlock certificate
                </span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <GraduationCap className="w-12 h-12 text-orange-600 mx-auto" />
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-widest">
              DTMP Academy
            </p>
            <p className="text-lg font-medium text-muted-foreground">
              Certificate of Completion
            </p>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This certifies that
              </p>
              <p className="text-2xl font-bold text-primary-navy my-2">
                [Your Name]
              </p>
              <p className="text-sm text-muted-foreground">
                has successfully completed the course
              </p>
              <p className="text-xl font-semibold text-primary-navy mt-2">
                {data.courseTitle}
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Issued: [Date]</span>
              <span>&bull;</span>
              <span>{data.cpeCredits} CPE Credits</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Certificate ID: DTMP-2026-[ID]
            </p>
            <div className="flex justify-center gap-16 pt-6">
              <div className="text-center">
                <div className="w-32 border-b border-gray-400 mb-1" />
                <p className="text-xs text-muted-foreground">
                  {data.instructorName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Course Instructor
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-gray-400 mb-1" />
                <p className="text-xs text-muted-foreground">
                  DTMP Academy Director
                </p>
                <p className="text-xs text-muted-foreground">[Signature]</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <Button disabled={!allMet} className="bg-orange-600 hover:bg-orange-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            {allMet ? "Download Certificate" : "Complete course to download"}
          </Button>
        </div>
      </div>

      {/* CPE Credits */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-primary-navy">
              Continuing Professional Education (CPE)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              This course provides {data.cpeCredits} CPE credits upon
              completion:
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-6 ml-8">
          {data.cpeDomains.map((domain, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-foreground">
                {domain.name} ({domain.credits} credits)
              </span>
            </div>
          ))}
        </div>

        <div className="ml-8">
          <p className="text-sm text-muted-foreground mb-2">
            Credits can be reported to:
          </p>
          <div className="space-y-1">
            {data.cpeReportableTo.map((org, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-foreground">{org}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 ml-8">
          <Button variant="outline" disabled={!allMet}>
            <Download className="w-4 h-4 mr-2" />
            Download CPE Certificate
            {!allMet && (
              <span className="text-xs ml-1">(Available after completion)</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCertificateTab;
