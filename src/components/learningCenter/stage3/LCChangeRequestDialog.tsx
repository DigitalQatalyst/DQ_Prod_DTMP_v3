import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveLCChangeRequest, lcChangeTypeLabels } from "@/data/learningCenter/stage3/lcChangeRequests";
import type { LCChangeType, LCUrgency } from "@/data/learningCenter/stage3/lcChangeRequests";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillSubject?: string;
  prefillSubjectId?: string;
  prefillSubjectType?: "course" | "track" | "review";
  onCreated?: () => void;
}

const changeTypes = Object.entries(lcChangeTypeLabels) as [LCChangeType, string][];
const urgencies: { value: LCUrgency; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export default function LCChangeRequestDialog({
  open,
  onOpenChange,
  prefillSubject = "",
  prefillSubjectId = "",
  prefillSubjectType = "course",
  onCreated,
}: Props) {
  const { toast } = useToast();
  const [subject, setSubject] = useState(prefillSubject);
  const [subjectId, setSubjectId] = useState(prefillSubjectId);
  const [subjectType, setSubjectType] = useState<"course" | "track" | "review">(prefillSubjectType);
  const [changeType, setChangeType] = useState<LCChangeType>("update-course-metadata");
  const [changeDescription, setChangeDescription] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState<LCUrgency>("medium");
  const [submitting, setSubmitting] = useState(false);

  const handleOpen = (val: boolean) => {
    if (!val) {
      // Reset form
      setSubject(prefillSubject);
      setSubjectId(prefillSubjectId);
      setSubjectType(prefillSubjectType);
      setChangeType("update-course-metadata");
      setChangeDescription("");
      setReason("");
      setUrgency("medium");
    }
    onOpenChange(val);
  };

  const handleSubmit = () => {
    if (!subject.trim() || !changeDescription.trim() || !reason.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in Subject, Change Description, and Reason.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      saveLCChangeRequest({
        subject: subject.trim(),
        subjectId: subjectId.trim() || subject.trim().toLowerCase().replace(/\s+/g, "-"),
        subjectType,
        changeType,
        changeDescription: changeDescription.trim(),
        reason: reason.trim(),
        urgency,
        status: "submitted",
        submittedBy: "EA Office User",
      });
      toast({
        title: "Change request submitted",
        description: `Your change request for "${subject}" has been submitted for approval.`,
      });
      handleOpen(false);
      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Change Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Course, track, or review title"
            />
          </div>

          {/* Subject Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Type</label>
            <select
              value={subjectType}
              onChange={(e) => setSubjectType(e.target.value as "course" | "track" | "review")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="course">Course</option>
              <option value="track">Learning Track</option>
              <option value="review">Review</option>
            </select>
          </div>

          {/* Change Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Type</label>
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value as LCChangeType)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {changeTypes.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Change Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Description <span className="text-red-500">*</span></label>
            <Textarea
              value={changeDescription}
              onChange={(e) => setChangeDescription(e.target.value)}
              placeholder="Describe exactly what should change..."
              rows={4}
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-red-500">*</span></label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this change needed?"
              rows={3}
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as LCUrgency)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {urgencies.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleSubmit}
            disabled={submitting}
          >
            Submit Change Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
