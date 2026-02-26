import { memo, useMemo } from "react";
import { icons, LucideIcon, Clock, MapPin, Shield, Check, Send } from "lucide-react";
import { TechnicalSupport } from "@/data/supportServices/technicalSupport";
import { ExpertConsultancy } from "@/data/supportServices/expertConsultancy";

interface SupportServiceCardProps {
  service: TechnicalSupport | ExpertConsultancy;
  onClick: () => void;
}

// SLA level color mapping
const slaColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  "High Priority": "bg-orange-100 text-orange-700",
  Standard: "bg-yellow-100 text-yellow-700",
  "Best Effort": "bg-gray-100 text-gray-700",
};

export const SupportServiceCard = memo(function SupportServiceCard({
  service,
  onClick,
}: SupportServiceCardProps) {
  // Get the icon component dynamically - memoized
  const IconComponent: LucideIcon = useMemo(
    () => icons[service.icon as keyof typeof icons] as LucideIcon,
    [service.icon]
  );

  // Check if this is an expert consultancy service
  const isExpertConsultancy = "expertProfile" in service;
  const expertService = service as ExpertConsultancy;
  const techService = service as TechnicalSupport;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${service.title}`}
      className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-green-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {IconComponent && <IconComponent className="text-green-600" size={32} />}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {service.type}
          </span>
          {!isExpertConsultancy && techService.slaLevel && (
            <span
              className={`${
                slaColors[techService.slaLevel] || "bg-gray-100 text-gray-700"
              } px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
            >
              <Clock size={12} />
              {techService.slaLevel}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {service.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Expert Preview (for consultancy services) */}
        {isExpertConsultancy && expertService.expertProfile && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-3 rounded-lg flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0">
              {expertService.expertProfile.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {expertService.expertProfile.name}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {expertService.expertProfile.title}
              </p>
            </div>
          </div>
        )}

        {/* Service Features */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock size={14} className="flex-shrink-0" />
            <span className="truncate">
              {isExpertConsultancy ? expertService.duration : techService.responseTime}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{service.deliveryModel}</span>
          </div>
          {!isExpertConsultancy && techService.coverage && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Shield size={14} className="flex-shrink-0" />
              <span className="truncate">{techService.coverage}</span>
            </div>
          )}
        </div>

        {/* Key Benefits */}
        {service.keyBenefits && service.keyBenefits.length > 0 && (
          <div className="border-t border-gray-200 pt-3 mb-4">
            <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
              Key Benefits:
            </p>
            <div className="flex flex-wrap gap-2">
              {service.keyBenefits.slice(0, 2).map((benefit, index) => (
                <span
                  key={index}
                  className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
                >
                  <Check size={12} />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Card Footer */}
        <div className="flex justify-end items-center border-t border-gray-200 pt-4">
          <button
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={`Request ${service.title} service`}
            tabIndex={-1}
          >
            <Send size={16} />
            Request Service
          </button>
        </div>
      </div>
    </article>
  );
});
