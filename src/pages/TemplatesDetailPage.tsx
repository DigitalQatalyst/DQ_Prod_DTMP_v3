import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Star, 
  Users, 
  CheckCircle2,
  Sparkles,
  Wand2,
  ShieldCheck,
  ExternalLink,
  icons,
  LucideIcon
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginModal } from "@/components/learningCenter/LoginModal";

import { 
  policyReports,
  procedureReports,
  applicationProfiles,
  strategyDocs,
  assessments,
  executiveSummaries
} from "@/data/templates";

type TabType = "policy-reports" | "procedure-reports" | "application-profiles" | "strategy-docs" | "assessments" | "executive-summaries";

const getDataForTab = (tab: string) => {
  switch (tab) {
    case "policy-reports": return policyReports;
    case "procedure-reports": return procedureReports;
    case "application-profiles": return applicationProfiles;
    case "strategy-docs": return strategyDocs;
    case "assessments": return assessments;
    case "executive-summaries": return executiveSummaries;
    default: return [];
  }
};

const getTabDisplayName = (tab: string): string => {
  switch (tab) {
    case "policy-reports": return "Policy Reports";
    case "procedure-reports": return "Procedure Reports";
    case "application-profiles": return "Application Profiles";
    case "strategy-docs": return "Strategy Documents";
    case "assessments": return "Assessments";
    case "executive-summaries": return "Executive Summaries";
    default: return "Templates";
  }
};

export default function TemplatesDetailPage() {
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const navigate = useNavigate();
  const [activeContentTab, setActiveContentTab] = useState("about");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const data = getDataForTab(tab || "");
  const template = data.find(item => item.id === cardId);

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
            <Link to="/marketplaces/templates" className="text-purple-600 hover:text-purple-700">
              ← Back to Templates
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const IconComponent: LucideIcon = (icons[template.icon as keyof typeof icons] as LucideIcon) || FileText;

  const handleGenerateClick = () => {
    setShowLoginModal(true);
  };

  // Get related templates (same category, different ID)
  const relatedTemplates = data
    .filter(t => t.id !== template.id && t.category === template.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-gray-600 flex items-center gap-2">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link to="/marketplaces" className="hover:text-gray-900">Marketplaces</Link>
            <span>/</span>
            <Link to="/marketplaces/templates" className="hover:text-gray-900">Templates</Link>
            <span>/</span>
            <Link to={`/marketplaces/templates?tab=${tab}`} className="hover:text-gray-900">
              {getTabDisplayName(tab || "")}
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900 truncate max-w-[200px]">{template.title}</span>
          </nav>
        </div>
      </div>

      {/* Detail Header */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={() => navigate("/marketplaces/templates")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Templates</span>
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Template Info */}
            <div className="flex-1">
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 px-3 py-1.5 rounded-full text-purple-700 font-semibold text-xs mb-4">
                <Sparkles size={14} className="text-purple-600" />
                <span>{(template as any).aiGeneration}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-[#001F3F] mb-4">
                {template.title}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {template.category}
                </span>
                {(template as any).compliance && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <ShieldCheck size={14} />
                    {(template as any).compliance}
                  </span>
                )}
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {getTabDisplayName(tab || "")}
                </span>
              </div>

              <p className="text-lg text-gray-600 mb-6">
                {template.description}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <FileText size={18} />
                  {(template as any).pageLength}
                </span>
                <span className="flex items-center gap-2">
                  <Download size={18} />
                  {(template as any).outputFormats?.join(', ')}
                </span>
                <span className="flex items-center gap-2">
                  <Users size={18} />
                  {template.usageCount} uses
                </span>
              </div>
            </div>

            {/* Right: Icon Preview */}
            <div className="lg:w-48 flex-shrink-0">
              <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto">
                <IconComponent className="text-purple-600" size={64} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <Tabs value={activeContentTab} onValueChange={setActiveContentTab} className="flex-1">
        <div className="bg-white border-b-2 border-gray-200 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 flex gap-1 overflow-x-auto">
              {["about", "customization", "process", "output", "support"].map((contentTab) => (
                <TabsTrigger
                  key={contentTab}
                  value={contentTab}
                  className="px-6 py-4 text-gray-600 hover:text-gray-900 font-medium relative data-[state=active]:text-[#001F3F] data-[state=active]:border-b-2 data-[state=active]:border-purple-600 data-[state=active]:-mb-0.5 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none capitalize"
                >
                  {contentTab === "output" ? "Output Formats" : contentTab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Tab Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1">
              <TabsContent value="about" className="mt-0">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Template Overview</h2>
                  <p className="text-gray-700 mb-6">
                    This AI-powered template helps you create professional {template.title.toLowerCase()} documents 
                    with intelligent content generation and organizational context awareness. The template follows 
                    industry best practices and can be customized to match your organization's standards.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-gray-700">AI-powered content generation with context awareness</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Customizable sections and formatting options</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Multiple output formats supported</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                      <span className="text-gray-700">Built-in compliance and governance alignment</span>
                    </li>
                    {(template as any).specialFeature && (
                      <li className="flex items-start gap-3">
                        <Star className="text-yellow-500 mt-0.5 flex-shrink-0" size={20} />
                        <span className="text-gray-700">Special feature: {(template as any).specialFeature}</span>
                      </li>
                    )}
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Use Cases</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Enterprise governance documentation</li>
                    <li>Digital transformation initiatives</li>
                    <li>Compliance and audit requirements</li>
                    <li>Stakeholder communication</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="customization" className="mt-0">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Customization Options</h2>
                  <p className="text-gray-700 mb-6">
                    Tailor this template to your organization's specific needs with our comprehensive customization options.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Available Customizations</h3>
                  <div className="grid gap-4">
                    {["Branding & Styling", "Section Configuration", "Content Depth", "Terminology"].map((item) => (
                      <div key={item} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{item}</h4>
                        <p className="text-sm text-gray-600">
                          Customize {item.toLowerCase()} to match your organizational standards and preferences.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="process" className="mt-0">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Generation Process</h2>
                  
                  <div className="space-y-6">
                    {[
                      { step: 1, title: "Configure Template", description: "Select your customization options and organizational context" },
                      { step: 2, title: "Input Context", description: "Provide relevant information for AI content generation" },
                      { step: 3, title: "AI Generation", description: "DocWriter 4.0 generates tailored content based on your inputs" },
                      { step: 4, title: "Review & Edit", description: "Review generated content and make any necessary adjustments" },
                      { step: 5, title: "Export", description: "Download in your preferred format (PDF, DOCX, etc.)" }
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="output" className="mt-0">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Output Formats</h2>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {(template as any).outputFormats?.map((format: string) => (
                      <div key={format} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="text-gray-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{format}</h4>
                          <p className="text-sm text-gray-600">Export as {format} format</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Document Specifications</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">Page Length</td>
                          <td className="py-2 font-medium text-gray-900">{(template as any).pageLength}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 text-gray-600">AI Generation</td>
                          <td className="py-2 font-medium text-gray-900">{(template as any).aiGeneration}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-gray-600">Complexity</td>
                          <td className="py-2 font-medium text-gray-900">{(template as any).complexity || "Standard"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="support" className="mt-0">
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Support & Resources</h2>
                  
                  <div className="grid gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Documentation</h4>
                      <p className="text-sm text-gray-600 mb-3">Access comprehensive guides and tutorials for this template.</p>
                      <a href="#" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                        View Documentation <ExternalLink size={14} />
                      </a>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Expert Support</h4>
                      <p className="text-sm text-gray-600 mb-3">Get help from our template experts for complex customizations.</p>
                      <a href="#" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1">
                        Contact Support <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Right Sidebar */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg lg:sticky lg:top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Template Details</h3>

                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-gray-600 py-3 pr-4">Category</td>
                      <td className="text-sm font-medium text-gray-900 py-3">{template.category}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-gray-600 py-3 pr-4">Page Length</td>
                      <td className="text-sm font-medium text-gray-900 py-3">{(template as any).pageLength}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-gray-600 py-3 pr-4">Formats</td>
                      <td className="text-sm font-medium text-gray-900 py-3">{(template as any).outputFormats?.join(', ')}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-gray-600 py-3 pr-4">AI Mode</td>
                      <td className="text-sm font-medium text-gray-900 py-3">{(template as any).aiGeneration}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-green-600" size={16} />
                      AI content generation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-green-600" size={16} />
                      Customizable sections
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-green-600" size={16} />
                      Multiple export formats
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="text-green-600" size={16} />
                      Version history
                    </li>
                    {(template as any).specialFeature && (
                      <li className="flex items-center gap-2 text-sm text-gray-700">
                        <Star className="text-yellow-500" size={16} />
                        {(template as any).specialFeature}
                      </li>
                    )}
                  </ul>
                </div>

                <Button 
                  onClick={handleGenerateClick}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Wand2 size={20} />
                  Generate Document
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Tabs>

      {/* Related Templates */}
      {relatedTemplates.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTemplates.map((related) => {
                const RelatedIcon: LucideIcon = (icons[related.icon as keyof typeof icons] as LucideIcon) || FileText;
                return (
                  <div
                    key={related.id}
                    onClick={() => navigate(`/marketplaces/templates/${tab}/${related.id}`)}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                  >
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <RelatedIcon className="text-purple-600" size={48} />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{related.category}</p>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "templates",
          tab: tab || "",
          cardId: cardId || "",
          serviceName: template.title,
          action: "Generate Document"
        }}
      />
    </div>
  );
}
