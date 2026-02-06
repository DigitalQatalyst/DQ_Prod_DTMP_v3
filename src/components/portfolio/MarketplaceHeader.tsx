import { Link } from "react-router-dom";
import { ChevronRight, Briefcase, TrendingUp, Target } from "lucide-react";
import { portfolioStats } from "@/data/portfolio";

export function MarketplaceHeader() {
  return (
    <section 
      className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-12 lg:py-16"
      aria-labelledby="marketplace-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                to="/" 
                className="text-gray-600 hover:text-orange-600 transition-colors min-h-[44px] flex items-center px-2"
                aria-label="Navigate to home page"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400 mx-2" aria-hidden="true" />
              <Link 
                to="/marketplaces" 
                className="text-gray-600 hover:text-orange-600 transition-colors min-h-[44px] flex items-center px-2"
                aria-label="Navigate to marketplaces overview"
              >
                Marketplaces
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400 mx-2" aria-hidden="true" />
              <span 
                className="text-orange-600 font-medium min-h-[44px] flex items-center px-2"
                aria-current="page"
              >
                Portfolio Management
              </span>
            </li>
          </ol>
        </nav>

        {/* Header Content */}
        <div className="max-w-4xl">
          {/* Phase Badge */}
          <div className="mb-4">
            <span 
              className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold"
              role="status"
              aria-label="Drive phase marketplace"
            >
              Drive
            </span>
          </div>

          {/* Title */}
          <h1 
            id="marketplace-title"
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
          >
            DTMP Portfolio Management
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Strategic oversight and optimization of application and project portfolios. 
            Gain visibility into portfolio health, rationalize applications, optimize 
            TCO, track project delivery, and make data-driven investment decisions. 
            Centralized governance and portfolio intelligence for continuous improvement.
          </p>

          {/* Statistics */}
          <div 
            className="flex flex-wrap gap-6"
            role="list"
            aria-label="Marketplace statistics"
          >
            <div 
              className="flex items-center gap-2 text-gray-700"
              role="listitem"
            >
              <div className="bg-orange-100 p-2 rounded-lg">
                <Briefcase size={18} className="text-orange-600" aria-hidden="true" />
              </div>
              <span 
                className="font-semibold"
                aria-label={`${portfolioStats.totalServices} total portfolio services available`}
              >
                {portfolioStats.totalServices} Portfolio Services
              </span>
            </div>
            
            <div 
              className="flex items-center gap-2 text-gray-700"
              role="listitem"
            >
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp size={18} className="text-green-600" aria-hidden="true" />
              </div>
              <span 
                className="font-semibold"
                aria-label="Real-time analytics available"
              >
                Real-time Analytics
              </span>
            </div>
            
            <div 
              className="flex items-center gap-2 text-gray-700"
              role="listitem"
            >
              <div className="bg-blue-100 p-2 rounded-lg">
                <Target size={18} className="text-blue-600" aria-hidden="true" />
              </div>
              <span 
                className="font-semibold"
                aria-label="Strategic oversight capabilities"
              >
                Strategic Oversight
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}