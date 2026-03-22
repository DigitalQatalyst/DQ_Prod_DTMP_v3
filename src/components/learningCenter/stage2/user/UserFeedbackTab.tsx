import { useState, useEffect } from "react";
import { Star, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  getCourseFeedback,
  submitCourseFeedback,
  getModuleComments,
  type ModuleComment,
} from "@/data/learningCenter/feedback";

interface UserFeedbackTabProps {
  courseId: string;
  courseTitle: string;
}

const PROMPTS = [
  "What did you find most valuable about this course?",
  "What could be improved?",
  "Would you recommend this course to a colleague?",
];

export default function UserFeedbackTab({ courseId, courseTitle }: UserFeedbackTabProps) {
  const existing = getCourseFeedback(courseId);
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [submitted, setSubmitted] = useState(!!existing);
  const [toast, setToast] = useState<string | null>(null);
  const [moduleComments, setModuleComments] = useState<ModuleComment[]>([]);

  useEffect(() => {
    setModuleComments(getModuleComments(courseId));
  }, [courseId]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = () => {
    if (rating === 0) { showToast("Please select a star rating before submitting."); return; }
    submitCourseFeedback({ courseId, rating, comment, learnerName: "John Doe" });
    setSubmitted(true);
    showToast("Feedback submitted. Thank you!");
  };

  const handleEdit = () => setSubmitted(false);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* Course Rating */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Course Feedback</h3>
          <p className="text-sm text-gray-500 mt-0.5">{courseTitle}</p>
        </div>

        {submitted ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">Feedback submitted — thank you!</span>
            </div>
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= rating ? "fill-orange-400 text-orange-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              {comment && <p className="text-sm text-gray-700 italic">"{comment}"</p>}
            </div>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit Feedback
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Star Rating */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Overall Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hovered || rating)
                          ? "fill-orange-400 text-orange-400"
                          : "text-gray-300 hover:text-orange-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-500 self-center">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Comments</p>
              <p className="text-xs text-gray-400 mb-2">
                {PROMPTS.map((p, i) => (
                  <span key={i}>{p}{i < PROMPTS.length - 1 ? " · " : ""}</span>
                ))}
              </p>
              <Textarea
                placeholder="Share your thoughts about this course..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
            </div>

            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleSubmit}
              disabled={rating === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        )}
      </div>

      {/* My Module Comments — read-only summary */}
      {moduleComments.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">My Module Questions</h3>
            <p className="text-sm text-gray-500 mt-0.5">Questions you submitted per module</p>
          </div>
          <div className="space-y-3">
            {moduleComments.map((mc) => (
              <div
                key={mc.id}
                className="border border-gray-100 rounded-lg px-4 py-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {mc.moduleTitle}
                  </p>
                  {mc.resolved ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Resolved
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">"{mc.comment}"</p>
                <p className="text-xs text-gray-400">
                  {new Date(mc.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                {mc.reply && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-blue-700 mb-0.5">
                      {mc.repliedBy ?? "Course Coordinator"} replied
                      {mc.repliedAt
                        ? ` · ${new Date(mc.repliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                        : ""}
                      :
                    </p>
                    <p className="text-sm text-blue-900 italic">"{mc.reply}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
