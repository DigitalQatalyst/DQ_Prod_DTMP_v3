import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ChevronRight, Clock, User, Download, 
  CheckCircle, BookOpen,
  Tag, TrendingUp, Calendar, BadgeCheck
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { bestPractices } from "@/data/knowledgeCenter/bestPractices";
import { testimonials } from "@/data/knowledgeCenter/testimonials";
import { playbooks } from "@/data/knowledgeCenter/playbooks";
import { libraryItems } from "@/data/knowledgeCenter/library";

export default function KnowledgeCenterDetailPage() {
  const { tab, cardId } = useParams();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [contentTab, setContentTab] = useState("about");

  // Find the item based on tab type
  const getItem = () => {
    switch (tab) {
      case "best-practices":
        return bestPractices.find((p) => p.id === cardId);
      case "testimonials":
        return testimonials.find((t) => t.id === cardId);
      case "playbooks":
        return playbooks.find((p) => p.id === cardId);
      case "library":
        return libraryItems.find((i) => i.id === cardId);
      default:
        return null;
    }
  };

  const item = getItem();

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Item Not Found</h1>
          <Button onClick={() => navigate("/marketplaces/knowledge-center")}>
            Back to Knowledge Center
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getTitle = () => {
    if ("title" in item) return item.title;
    return "";
  };

  const getTabLabel = () => {
    switch (tab) {
      case "best-practices": return "Best Practices";
      case "testimonials": return "Testimonials";
      case "playbooks": return "Playbooks";
      case "library": return "Library";
      default: return "";
    }
  };

  const loginContext = {
    marketplace: "knowledge-center",
    tab: tab || "",
    cardId: cardId || "",
    serviceName: getTitle(),
    action: "access",
  };

  const renderBestPracticeDetail = () => {
    const practice = item as typeof bestPractices[0];
    const Icon = practice.icon;
    
    return (
      <>
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-green-50 flex items-center justify-center">
                <Icon className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium mr-2">
                  {practice.domain}
                </span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                  {practice.category}
                </span>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {practice.title}
            </h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                {practice.maturityLevel}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                {practice.complexity} Complexity
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Added {practice.dateAdded}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Tabs value={contentTab} onValueChange={setContentTab}>
                <TabsList className="bg-white border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 gap-0">
                  {["About", "Implementation", "Examples", "Resources"].map((t) => (
                    <TabsTrigger
                      key={t}
                      value={t.toLowerCase()}
                      className="px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:shadow-none"
                    >
                      {t}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
                  <p className="text-muted-foreground mb-6">{practice.summary}</p>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">Impact Areas</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {practice.impactAreas.map((area) => (
                      <span key={area} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">Industry Applicability</h3>
                  <p className="text-muted-foreground">{practice.industryApplicability}</p>
                </TabsContent>

                <TabsContent value="implementation" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Guide</h2>
                  <p className="text-muted-foreground">Detailed implementation steps will be available after accessing this resource.</p>
                </TabsContent>

                <TabsContent value="examples" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Real-World Examples</h2>
                  <p className="text-muted-foreground">Case studies and examples will be available after accessing this resource.</p>
                </TabsContent>

                <TabsContent value="resources" className="mt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Additional Resources</h2>
                  <p className="text-muted-foreground">Related resources and downloads will be available after accessing this resource.</p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Best Practice Details</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Domain</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.domain}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Complexity</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.complexity}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Maturity Level</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.maturityLevel}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Content Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{practice.contentType}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {["Implementation guide", "Templates & checklists", "Case study examples", "Expert insights"].map((i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold"
                >
                  Access Resource
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderTestimonialDetail = () => {
    const testimonial = item as typeof testimonials[0];
    
    return (
      <>
        <div className="py-8 lg:py-12 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                {testimonial.organization.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{testimonial.organization}</h2>
                <p className="text-sm text-muted-foreground">{testimonial.industry}</p>
              </div>
              {testimonial.verified && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <BadgeCheck className="w-4 h-4" />
                  Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {testimonial.title}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <blockquote className="text-xl text-muted-foreground italic mb-8 border-l-4 border-purple-500 pl-6">
                "{testimonial.quote}"
              </blockquote>

              <div className="mb-8">
                <p className="text-lg font-semibold text-foreground">{testimonial.speaker.name}</p>
                <p className="text-muted-foreground">{testimonial.speaker.role}</p>
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">Key Outcomes</h3>
              <div className="grid gap-4">
                {testimonial.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-foreground font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Testimonial Details</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Organization Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{testimonial.organizationType}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Phase</td>
                      <td className="text-sm font-medium text-foreground py-3">{testimonial.phase}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Published</td>
                      <td className="text-sm font-medium text-foreground py-3">{testimonial.date}</td>
                    </tr>
                  </tbody>
                </table>

                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold"
                >
                  View Full Case Study
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderPlaybookDetail = () => {
    const playbook = item as typeof playbooks[0];
    
    return (
      <>
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {playbook.type}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {playbook.industry}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {playbook.format}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {playbook.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{playbook.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div
                className="aspect-video rounded-xl mb-8 flex items-center justify-center"
                style={{ background: playbook.coverGradient }}
              >
                <BookOpen className="w-24 h-24 text-white/30" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">Topics Covered</h3>
              <ul className="space-y-3 mb-8">
                {playbook.topics.map((topic) => (
                  <li key={topic} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Playbook Details</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Industry</td>
                      <td className="text-sm font-medium text-foreground py-3">{playbook.industry}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Scope</td>
                      <td className="text-sm font-medium text-foreground py-3">{playbook.scope}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Format</td>
                      <td className="text-sm font-medium text-foreground py-3">{playbook.format}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Contributor</td>
                      <td className="text-sm font-medium text-foreground py-3">{playbook.contributor}</td>
                    </tr>
                  </tbody>
                </table>

                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold"
                >
                  Access Playbook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderLibraryItemDetail = () => {
    const libraryItem = item as typeof libraryItems[0];
    
    return (
      <>
        <div className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.contentType}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.format}
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {libraryItem.audience}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {libraryItem.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">{libraryItem.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {libraryItem.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {libraryItem.length}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {libraryItem.datePublished}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {libraryItem.topics.map((topic) => (
                  <span key={topic} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
              <p className="text-muted-foreground mb-8">
                This {libraryItem.contentType.toLowerCase()} provides comprehensive insights into 
                {libraryItem.topics.slice(0, 2).join(" and ")}. Access the full document to explore 
                detailed frameworks, best practices, and implementation guidance.
              </p>
            </div>

            <div className="lg:w-96">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6">Document Details</h3>
                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.contentType}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Format</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.format}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Length</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.length}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Audience</td>
                      <td className="text-sm font-medium text-foreground py-3">{libraryItem.audience}</td>
                    </tr>
                  </tbody>
                </table>

                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Resource
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/knowledge-center" className="hover:text-foreground transition-colors">
              Knowledge Center
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link 
              to={`/marketplaces/knowledge-center?tab=${tab}`} 
              className="hover:text-foreground transition-colors"
            >
              {getTabLabel()}
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {getTitle()}
            </span>
          </nav>
        </div>
      </div>

      {/* Render appropriate detail view */}
      {tab === "best-practices" && renderBestPracticeDetail()}
      {tab === "testimonials" && renderTestimonialDetail()}
      {tab === "playbooks" && renderPlaybookDetail()}
      {tab === "library" && renderLibraryItemDetail()}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        context={loginContext}
      />

      <Footer />
    </div>
  );
}
