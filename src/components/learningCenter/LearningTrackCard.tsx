import { BookOpen, Clock, Award, Route } from "lucide-react";
import { LearningTrack } from "@/data/learningCenter/learningTracks";
import { Badge } from "@/components/ui/badge";

interface LearningTrackCardProps {
  track: LearningTrack;
  onClick: () => void;
}

export function LearningTrackCard({ track, onClick }: LearningTrackCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <Route className="w-7 h-7 text-purple-600" />
        </div>
        <Badge className="bg-purple-100 text-purple-700 border-0">
          {track.courses} Courses
        </Badge>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {track.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {track.description}
      </p>

      {/* Progress Visualization */}
      <div className="flex items-center gap-1 my-4">
        {[...Array(track.courses)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs
                ${i === 0 ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-300 bg-white text-gray-400"}`}
            >
              {i + 1}
            </div>
            {i < track.courses - 1 && (
              <div className="w-4 h-0.5 bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          {track.duration}
        </span>
        <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
          {track.role}
        </Badge>
      </div>

      {/* Certification Badge */}
      {track.certification && (
        <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium w-fit">
          <Award className="w-3 h-3" />
          Certification
        </div>
      )}
    </div>
  );
}
