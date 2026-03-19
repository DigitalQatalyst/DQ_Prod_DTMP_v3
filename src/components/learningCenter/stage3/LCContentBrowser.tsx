import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, FileEdit, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/learningCenter/courses";
import { learningTracks } from "@/data/learningCenter/learningTracks";
import { reviews } from "@/data/learningCenter/reviews";
import LCChangeRequestDialog from "./LCChangeRequestDialog";

// Deterministic mock data
function mockEnrolled(idx: number): number {
  return 12 + ((idx * 7 + 3) % 78);
}
function mockCompletion(idx: number): number {
  return 45 + ((idx * 11 + 5) % 48);
}
function mockTrackEnrolled(idx: number): number {
  return 18 + ((idx * 13 + 7) % 62);
}
function mockTrackCompletion(idx: number): number {
  return 48 + ((idx * 9 + 3) % 40);
}
function mockCerts(idx: number): number {
  return 5 + ((idx * 6 + 2) % 28);
}

const tabs = ["Courses & Curriculum", "Learning Tracks", "Reviews"] as const;
type Tab = (typeof tabs)[number];

interface DialogState {
  open: boolean;
  subject: string;
  subjectId: string;
  subjectType: "course" | "track" | "review";
}

const INITIAL_DIALOG: DialogState = { open: false, subject: "", subjectId: "", subjectType: "course" };

export default function LCContentBrowser({ onRequestCreated }: { onRequestCreated?: () => void }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("Courses & Curriculum");
  const [dialog, setDialog] = useState<DialogState>(INITIAL_DIALOG);

  const openDialog = (subject: string, subjectId: string, subjectType: "course" | "track" | "review") => {
    setDialog({ open: true, subject, subjectId, subjectType });
  };

  return (
    <div className="p-6 space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-orange-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Courses & Curriculum" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Published Courses</h3>
              <p className="text-xs text-gray-500">All 30 DEWA Learning Centre courses</p>
            </div>
            <span className="text-xs text-gray-400">30 courses</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">ID</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Title</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Level</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Division</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">Enrolled</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-24">Completion</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">Status</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course, idx) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">
                      LC-{String(idx + 1).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-800 max-w-xs">
                      <span className="line-clamp-2">{course.title}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          course.level === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : course.level === "Intermediate"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {course.level}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs max-w-[120px]">
                      <span className="truncate block">{course.divisionTags[0]}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">{mockEnrolled(idx)}</td>
                    <td className="px-4 py-2.5 text-gray-700">{mockCompletion(idx)}%</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        Published
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate("/marketplaces/learning-center")}
                          title="View in Stage 1"
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-orange-600 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDialog(course.title, course.id, "course")}
                          title="Raise Change Request"
                          className="p-1.5 rounded hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Learning Tracks" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Published Learning Tracks</h3>
              <p className="text-xs text-gray-500">All 7 structured learning pathways</p>
            </div>
            <span className="text-xs text-gray-400">7 tracks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">ID</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Title</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-16">Courses</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Duration</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">Enrolled</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-24">Completion</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">Certs</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {learningTracks.map((track, idx) => (
                  <tr key={track.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">
                      LT-{String(idx + 1).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-800 max-w-xs">
                      <span className="line-clamp-2">{track.title}</span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">{track.courses}</td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{track.duration}</td>
                    <td className="px-4 py-2.5 text-gray-700">{mockTrackEnrolled(idx)}</td>
                    <td className="px-4 py-2.5 text-gray-700">{mockTrackCompletion(idx)}%</td>
                    <td className="px-4 py-2.5 text-gray-700">{mockCerts(idx)}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => openDialog(track.title, track.id, "track")}
                        title="Raise Change Request"
                        className="p-1.5 rounded hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Reviews" && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Published Reviews</h3>
              <p className="text-xs text-gray-500">All 10 learner reviews</p>
            </div>
            <span className="text-xs text-gray-400">10 reviews</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-20">ID</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Reviewer</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Course</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-24">Rating</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-24">Status</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600 w-36">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review, idx) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">
                      RV-{String(idx + 1).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-2.5">
                      <div>
                        <p className="font-medium text-gray-800">{review.reviewer.name}</p>
                        <p className="text-xs text-gray-400">{review.reviewer.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 text-xs max-w-[160px]">
                      <span className="line-clamp-2">{review.courseName}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{review.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        Visible
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 text-xs">{review.date}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDialog(review.courseName, review.courseId, "review")}
                          title="Raise Change Request"
                          className="p-1.5 rounded hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <LCChangeRequestDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
        prefillSubject={dialog.subject}
        prefillSubjectId={dialog.subjectId}
        prefillSubjectType={dialog.subjectType}
        onCreated={onRequestCreated}
      />
    </div>
  );
}
