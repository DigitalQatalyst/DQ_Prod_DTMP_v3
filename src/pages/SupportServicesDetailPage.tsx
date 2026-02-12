import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft, ArrowRight, icons, LucideIcon, Clock, MapPin, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { technicalSupport, expertConsultancy } from "@/data/supportServices";
import { platform24x7SupportDetail, architectureAdvisoryDetail, getSupportServiceDetail } from "@/data/supportServices/detailsSupport";
import { SLATiersDisplay } from "@/components/supportServices/SLATiersDisplay";
import { ExpertProfileCard } from "@/components/supportServices/ExpertProfileCard";
import { EngagementModelsComparison } from "@/components/supportServices/EngagementModelsComparison";
import { LoginModal } from "@/components/learningCenter/LoginModal";

type TabValue = "technical-support" | "expert-consultancy";

export default function SupportServicesDetailPage() {
  const { tab, cardId } = useParams<{ tab: TabValue; cardId: string }>();
  const navigate = useNavigate();
  const [activeContentTab, setActiveContentTab] = useState("about");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Handle invalid tab parameter
  const validTab: TabValue = tab === "expert-consultancy" ? "expert-consultancy" : "technical-support";

  // Fetch service data based on tab and ID
  const service =
    validTab === "technical-support"
      ? technicalSupport.find((s) => s.id === cardId)
      : expertConsultancy.find((s) => s.id === cardId);

  // Get detail data using helper function
  const detailData = getSupportServiceDetail(cardId || "");

  // Handle invalid service ID
  useEffect(() => {
    if (!service) {
      navigate(`/marketplaces/support-services?tab=${validTab}`, { replace: true });
    }
  }, [service, navigate, validTab]);

  if (!service) {
    return null;
  }

  // Get the icon component dynamically
  const IconComponent: LucideIcon = icons[service.icon as keyof typeof icons] as LucideIcon;

  // Determine if this is an expert consultancy service
  const isExpertConsultancy = validTab === "expert-consultancy";
  const expertService = service as typeof expertConsultancy[0];
  const techService = service as typeof technicalSupport[0];

  // Type guard for detail data
  const isTechnicalSupportDetail = (data: typeof detailData): data is typeof platform24x7SupportDetail => {
    return 'slaCommitments' in data;
  };

  // Tab display name
  const tabName = validTab === "technical-support" ? "Technical Support" : "Expert Consultancy";

  // Handle back navigation
  const handleBackClick = () => {
    navigate(`/marketplaces/support-services?tab=${validTab}`);
  };

  // If no detail data available, show placeholder
  if (!detailData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center" id="main-content">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              {IconComponent && <IconComponent className="text-green-600" size={48} />}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
            <p className="text-lg text-gray-600 mb-8">
              Detailed information for this service is coming soon. Please check back later or contact us for more information.
            </p>
            <Button
              onClick={handleBackClick}
              className="bg-[hsl(var(--orange))] text-white hover:bg-[hsl(var(--orange-hover))]"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Support Services
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1" id="main-content">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6 flex-wrap">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label="Go to home page"
            >
              Home
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <button
              onClick={() => navigate("/marketplaces")}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label="Go to marketplaces"
            >
              Marketplaces
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <button
              onClick={() => navigate("/marketplaces/support-services")}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label="Go to support services marketplace"
            >
              Support Services
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <button
              onClick={handleBackClick}
              className="hover:text-[hsl(var(--orange))] transition-colors duration-300 min-h-[44px] px-2 flex items-center focus:outline-none focus:ring-2 focus:ring-[hsl(var(--orange))] focus:ring-offset-2 rounded"
              aria-label={`Go back to ${tabName}`}
            >
              {tabName}
            </button>
            <ChevronRight size={16} aria-hidden="true" />
            <span className="text-gray-900 font-medium" aria-current="page">
              {service.title}
            </span>
          </nav>

          {/* Header Section */}
          <article aria-labelledby="service-title">
            <header className="bg-white border border-gray-200 rounded-xl p-8 mb-6">
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  {IconComponent && <IconComponent className="text-green-600" size={48} />}
                </div>

                {/* Title and Badges */}
                <div className="flex-1">
                  <h1 id="service-title" className="text-3xl lg:text-4xl font-bold text-primary-navy mb-3">
                    {service.title}
                  </h1>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {service.type}
                    </span>
                    {!isExpertConsultancy && techService.slaLevel && (
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Clock size={14} />
                        {techService.slaLevel}
                      </span>
                    )}
                  </div>

                  {/* Service Features */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-blue-600" />
                      <span>{isExpertConsultancy ? expertService.duration : techService.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      <span>{service.deliveryModel}</span>
                    </div>
                    {!isExpertConsultancy && techService.coverage && (
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-blue-600" />
                        <span>{techService.coverage}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Content Tabs */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <Tabs value={activeContentTab} onValueChange={setActiveContentTab}>
                <TabsList className="w-full justify-start bg-gray-50 border border-gray-200 rounded-lg p-1 mb-6">
                  <TabsTrigger value="about" className="flex-1 lg:flex-none">
                    About
                  </TabsTrigger>
                  {!isExpertConsultancy && (
                    <TabsTrigger value="coverage-sla" className="flex-1 lg:flex-none">
                      Coverage & SLA
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="how-it-works" className="flex-1 lg:flex-none">
                    How It Works
                  </TabsTrigger>
                  <TabsTrigger value="team-expertise" className="flex-1 lg:flex-none">
                    Team & Expertise
                  </TabsTrigger>
                  <TabsTrigger value="getting-started" className="flex-1 lg:flex-none">
                    Getting Started
                  </TabsTrigger>
                </TabsList>

                {/* About Tab */}
                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                    <p className="text-base text-gray-700 leading-relaxed mb-6">
                      {detailData.overview}
                    </p>
                  </div>

                  {'whatsIncluded' in detailData && detailData.whatsIncluded && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">What's Included</h3>
                      <ul className="space-y-2">
                        {detailData.whatsIncluded.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {'serviceScope' in detailData && detailData.serviceScope && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Service Scope</h3>
                      <ul className="space-y-2">
                        {detailData.serviceScope.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {detailData.idealFor && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Ideal For</h3>
                      <ul className="space-y-2">
                        {detailData.idealFor.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-blue-600 mt-1">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {'valueProposition' in detailData && detailData.valueProposition && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Value Proposition</h3>
                      <p className="text-gray-700">{detailData.valueProposition}</p>
                    </div>
                  )}
                </TabsContent>

                {/* Coverage & SLA Tab (Technical Support only) */}
                {!isExpertConsultancy && isTechnicalSupportDetail(detailData) && detailData.slaCommitments && (
                  <TabsContent value="coverage-sla" className="space-y-6">
                    <SLATiersDisplay slaCommitments={detailData.slaCommitments} />

                    {detailData.performanceMetrics && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(detailData.performanceMetrics).map(([key, value]) => (
                            <div key={key} className="bg-white rounded-lg p-4">
                              <p className="text-sm text-gray-600 mb-1">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                              <p className="text-lg font-bold text-gray-900">{value as string}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                )}

                {/* How It Works Tab */}
                <TabsContent value="how-it-works" className="space-y-6">
                  {'engagementModels' in detailData && detailData.engagementModels && (
                    <EngagementModelsComparison engagementModels={detailData.engagementModels} />
                  )}

                  {'requestProcess' in detailData && detailData.requestProcess && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Request Process</h3>
                      <div className="space-y-4">
                        {detailData.requestProcess.map((step, index: number) => (
                          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-2">
                              {index + 1}. {step.step}
                            </h4>
                            <p className="text-gray-700 mb-2">{step.description}</p>
                            {step.channels && (
                              <ul className="text-sm text-gray-600 space-y-1">
                                {step.channels.map((channel: string, idx: number) => (
                                  <li key={idx}>• {channel}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Team & Expertise Tab */}
                <TabsContent value="team-expertise" className="space-y-6">
                  {'leadArchitect' in detailData && detailData.leadArchitect && (
                    <ExpertProfileCard leadArchitect={detailData.leadArchitect} />
                  )}

                  {'supportTeam' in detailData && detailData.supportTeam && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Team</h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
                        <p className="text-gray-700">
                          <span className="font-semibold">Team Size:</span> {detailData.supportTeam.size}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Locations:</span>{" "}
                          {detailData.supportTeam.locations.join(", ")}
                        </p>
                        {detailData.supportTeam.teamStructure && (
                          <div>
                            <p className="font-semibold text-gray-900 mb-2">Team Structure:</p>
                            <ul className="space-y-1">
                              {detailData.supportTeam.teamStructure.map((item: string, idx: number) => (
                                <li key={idx} className="text-gray-700">• {item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Getting Started Tab */}
                <TabsContent value="getting-started" className="space-y-6">
                  {'prerequisites' in detailData && detailData.prerequisites && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h3>
                      <ul className="space-y-2">
                        {detailData.prerequisites.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-orange-600 mt-1">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {'onboardingProcess' in detailData && detailData.onboardingProcess && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Onboarding Process</h3>
                      <div className="space-y-4">
                        {detailData.onboardingProcess.map((phase, index: number) => (
                          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-900">{phase.phase}</h4>
                              <span className="text-sm text-gray-600">{phase.duration}</span>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {phase.activities.map((activity: string, idx: number) => (
                                <li key={idx}>• {activity}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-8 mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-primary-navy mb-2">Ready to get started?</h2>
                  <p className="text-gray-600">
                    Request this service to access expert support and guidance.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-end">
                  <button
                    type="button"
                    onClick={handleBackClick}
                    className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--orange))] focus-visible:ring-offset-2"
                  >
                    <ArrowLeft size={18} />
                    Back to Services
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--orange))] focus-visible:ring-offset-2"
                  >
                    Request Service
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "support-services",
          tab: validTab,
          cardId: cardId || "",
          serviceName: service.title,
          action: "request-service",
        }}
      />
    </div>
  );
}
