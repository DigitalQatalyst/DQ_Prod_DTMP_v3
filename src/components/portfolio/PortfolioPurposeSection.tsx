import { useState } from "react";
import { Target, TrendingUp, Shield, DollarSign, CheckCircle, AlertTriangle, Eye, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PortfolioPurposeSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Does This Marketplace Exist?
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            <span className="font-semibold text-blue-600">You cannot transform what you cannot see.</span>
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            The Portfolio Management Marketplace serves as your organization's single source of truth 
            for strategic decision-making, cost optimization, and digital transformation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Visibility */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Eye className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Full Visibility</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Gain complete visibility of all assets across your organization in real-time.
            </p>
          </div>

          {/* Ownership */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Clear Ownership</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Establish accountability with clear ownership and responsibility tracking.
            </p>
          </div>

          {/* Cost Control */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <DollarSign className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Cost Control</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Optimize spending with comprehensive TCO visibility and license management.
            </p>
          </div>

          {/* Risk Management */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Risk Mitigation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Proactively identify and mitigate security, compliance, and operational risks.
            </p>
          </div>
        </div>

        {/* Read More Section */}
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setShowMore(!showMore)}
            className="mx-auto flex items-center gap-2 mb-6"
          >
            {showMore ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Learn More About Portfolio Management
              </>
            )}
          </Button>

          {showMore && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Comprehensive Portfolio Management Benefits</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Single Source of Truth</p>
                      <p className="text-sm text-gray-600">Centralized repository eliminating data silos and inconsistencies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Real-Time Insights</p>
                      <p className="text-sm text-gray-600">Live dashboards with up-to-the-minute portfolio health metrics</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Compliance Automation</p>
                      <p className="text-sm text-gray-600">Automated tracking with proactive alerts for certifications and renewals</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Strategic Alignment</p>
                      <p className="text-sm text-gray-600">Ensure investments align with business objectives and priorities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Dependency Intelligence</p>
                      <p className="text-sm text-gray-600">Visualize relationships and assess impact before making changes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Transformation Enablement</p>
                      <p className="text-sm text-gray-600">Accelerate cloud migration and modernization initiatives</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact Statement */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold mb-2">The Cost of Inaction</h4>
                    <p className="text-blue-100 leading-relaxed">
                      Organizations without centralized portfolio management face redundant applications, 
                      uncontrolled costs, security vulnerabilities, and missed transformation opportunities. 
                      <span className="font-semibold text-white"> Studies show that mature portfolio management 
                      practices reduce IT costs by 15-30%</span> while improving business agility and compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
