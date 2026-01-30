import { Star, BookOpen, ThumbsUp, CheckCircle } from "lucide-react";
import { Review } from "@/data/learningCenter/reviews";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {review.reviewer.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{review.reviewer.name}</p>
            <p className="text-xs text-gray-500">{review.date}</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Course Reference */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <BookOpen className="w-3 h-3" />
        {review.courseName}
      </div>

      {/* Review Content */}
      {review.title && (
        <h4 className="text-base font-semibold text-gray-900 mb-2">{review.title}</h4>
      )}
      <p className="text-sm text-gray-700 mb-3 line-clamp-4">{review.text}</p>

      {/* Verified Badge */}
      {review.verified && (
        <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded text-xs text-green-700 font-medium w-fit mb-3">
          <CheckCircle className="w-3 h-3 text-green-600" />
          Verified Learner
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 pt-3">
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          Helpful ({review.helpfulCount})
        </button>
      </div>
    </div>
  );
}
