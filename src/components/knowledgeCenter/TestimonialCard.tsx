import { BadgeCheck, CheckCircle } from "lucide-react";
import { Testimonial } from "@/data/knowledgeCenter/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
  onClick: () => void;
}

export function TestimonialCard({ testimonial, onClick }: TestimonialCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-blue-50 to-purple-50 border border-purple-200 rounded-xl p-6 hover:shadow-xl hover:border-purple-400 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
            {testimonial.organization.charAt(0)}
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900">
              {testimonial.organization}
            </h4>
            <p className="text-xs text-gray-600">{testimonial.industry}</p>
          </div>
        </div>
        {testimonial.verified && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" />
            Verified
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
        {testimonial.title}
      </h3>
      <p className="text-sm text-gray-700 italic mb-4 line-clamp-3">
        "{testimonial.quote}"
      </p>

      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-900">
          {testimonial.speaker.name}
        </p>
        <p className="text-xs text-gray-600">{testimonial.speaker.role}</p>
      </div>

      <div className="border-t border-purple-200 pt-4 mb-4">
        <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
          Key Outcomes:
        </p>
        <div className="space-y-1">
          {testimonial.outcomes.slice(0, 3).map((outcome) => (
            <div key={outcome} className="flex items-center gap-2 text-xs text-gray-700">
              <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
              {outcome}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-purple-200 pt-4">
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
          {testimonial.phase}
        </span>
        <span className="text-xs text-gray-500">{testimonial.date}</span>
      </div>
    </div>
  );
}
