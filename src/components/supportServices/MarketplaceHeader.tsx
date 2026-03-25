import { Headphones, Clock, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { technicalSupport, expertConsultancy } from "@/data/supportServices";

export function MarketplaceHeader() {
  const totalServices = technicalSupport.length + expertConsultancy.length;
  
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-4 flex-wrap">
          <Link
            to="/"
            className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
            aria-label="Go to home page"
          >
            Home
          </Link>
          <ChevronRight size={16} className="text-gray-400 mx-1" />
          <Link
            to="/marketplaces"
            className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
            aria-label="Go to marketplaces"
          >
            Marketplaces
          </Link>
          <ChevronRight size={16} className="text-gray-400 mx-1" />
          <span className="text-gray-900 font-medium" aria-current="page">
            Support Services
          </span>
        </nav>

        {/* Header Content */}
        <div>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold uppercase inline-block mb-3">
            Drive
          </span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] mb-3">
            DTMP Support Services
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mb-4">
            Expert technical support and specialized consultancy to accelerate your
            transformation journey. Access 24/7 platform support, incident response,
            architecture advisory, transformation coaching, and specialized expertise.
            From break-fix to strategic guidance, we ensure your success at every step.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Headphones size={18} aria-hidden="true" />
              {totalServices} Support Services
            </span>
            <span className="flex items-center gap-2">
              <Clock size={18} aria-hidden="true" />
              24/7 Availability
            </span>
            <span className="flex items-center gap-2">
              <Users size={18} aria-hidden="true" />
              Expert Teams
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
