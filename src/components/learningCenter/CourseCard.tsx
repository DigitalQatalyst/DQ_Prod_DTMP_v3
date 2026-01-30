import { Star, Clock, BookOpen, Image } from "lucide-react";
import { Course } from "@/data/learningCenter/courses";
import { Badge } from "@/components/ui/badge";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const levelColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
  Executive: "bg-orange-100 text-orange-700",
};

const gradientColors = [
  "from-blue-400 to-purple-500",
  "from-green-400 to-blue-500",
  "from-orange-400 to-pink-500",
  "from-purple-400 to-pink-500",
  "from-teal-400 to-blue-500",
  "from-rose-400 to-orange-500",
];

export function CourseCard({ course, onClick }: CourseCardProps) {
  const gradientIndex = course.id.length % gradientColors.length;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Image Placeholder */}
      <div className={`aspect-video bg-gradient-to-br ${gradientColors[gradientIndex]} flex items-center justify-center relative`}>
        <Image className="w-12 h-12 text-white/40" />
        {course.featured && (
          <span className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        {course.provider && (
          <p className="text-xs text-gray-500 mb-2">{course.provider.name}</p>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <BookOpen className="w-3 h-3" />
            {course.lessons} lessons
          </span>
          <Badge className={`${levelColors[course.level]} border-0 text-xs`}>
            {course.level}
          </Badge>
        </div>

        {/* Rating */}
        {course.rating && (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(course.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {course.rating} ({course.students} students)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
