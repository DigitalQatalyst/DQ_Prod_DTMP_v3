import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MarketplacesPage from "./pages/MarketplacesPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import LearningCenterPage from "./pages/LearningCenterPage";
import LearningCenterDetailPage from "./pages/LearningCenterDetailPage";
import KnowledgeCenterPage from "./pages/KnowledgeCenterPage";
import KnowledgeCenterDetailPage from "./pages/KnowledgeCenterDetailPage";
import TransactAppPage from "./pages/TransactAppPage";
import Stage2AppPage from "./pages/Stage2AppPage";
import TemplatesPage from "./pages/TemplatesPage";
import TemplatesDetailPage from "./pages/TemplatesDetailPage";
import { SolutionSpecsPage } from "./pages/SolutionSpecsPage";
import { SolutionSpecDetailPage } from "./pages/SolutionSpecDetailPage";
import { SolutionBuildPage } from "./pages/SolutionBuildPage";
import { SolutionBuildDetailPage } from "./pages/SolutionBuildDetailPage";
import SupportServicesPage from "./pages/SupportServicesPage";
import SupportServicesDetailPage from "./pages/SupportServicesDetailPage";
import SupportServicesOverview from "./pages/stage2/support/SupportServicesOverview";
import MyTicketsPage from "./pages/stage2/support/MyTicketsPage";
import TicketDetailPage from "./pages/stage2/support/TicketDetailPage";
import ServiceRequestsPage from "./pages/stage2/support/ServiceRequestsPage";
import RequestDetailPage from "./pages/stage2/support/RequestDetailPage";
import KnowledgeBasePage from "./pages/stage2/support/KnowledgeBasePage";
import ArticleDetailPage from "./pages/stage2/support/ArticleDetailPage";
import PortfolioManagementPage from "./pages/PortfolioManagementPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import NotFound from "./pages/NotFound";
import DigitalIntelligencePage from "./pages/DigitalIntelligencePage";
import DigitalIntelligenceDetailPage from "./pages/DigitalIntelligenceDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplaces" element={<MarketplacesPage />} />
          
          {/* Learning Center marketplace */}
          <Route path="/marketplaces/learning-center" element={<LearningCenterPage />} />
          <Route path="/marketplaces/learning-center/:tab/:cardId" element={<LearningCenterDetailPage />} />

          {/* Stage 2 - Transact App */}
          <Route path="/transact-app" element={<TransactAppPage />} />
          <Route path="/stage2" element={<Stage2AppPage />} />
          <Route path="/stage2/support/overview" element={<SupportServicesOverview />} />
          <Route path="/stage2/support/tickets" element={<MyTicketsPage />} />
          <Route path="/stage2/support/tickets/:ticketId" element={<TicketDetailPage />} />
          <Route path="/stage2/support/requests" element={<ServiceRequestsPage />} />
          <Route path="/stage2/support/requests/:requestId" element={<RequestDetailPage />} />
          <Route path="/stage2/support/knowledge" element={<KnowledgeBasePage />} />
          <Route path="/stage2/support/knowledge/:articleId" element={<ArticleDetailPage />} />
          
          {/* Main platform routes */}
          <Route path="/dbp" element={<ComingSoonPage pageName="DBP" />} />
          <Route path="/4d-model" element={<ComingSoonPage pageName="4D Model" />} />
          <Route path="/execution-streams" element={<ComingSoonPage pageName="Execution Streams" />} />
          <Route path="/transformation-office" element={<ComingSoonPage pageName="Transformation Office" />} />
          <Route path="/assets" element={<ComingSoonPage pageName="Assets" />} />
          <Route path="/user-groups" element={<ComingSoonPage pageName="User Groups" />} />
          <Route path="/visualization" element={<ComingSoonPage pageName="Visualization Dashboard" />} />
          
          {/* Knowledge Center marketplace */}
          <Route path="/marketplaces/knowledge-center" element={<KnowledgeCenterPage />} />
          <Route path="/marketplaces/knowledge-center/:tab/:cardId" element={<KnowledgeCenterDetailPage />} />

          {/* Templates marketplace */}
          <Route path="/marketplaces/templates" element={<TemplatesPage />} />
          <Route path="/marketplaces/templates/:tab/:cardId" element={<TemplatesDetailPage />} />

          {/* Blueprints marketplace - Legacy route with redirect */}
          <Route path="/marketplaces/blueprints" element={<Navigate to="/marketplaces/solution-specs" replace />} />
          <Route path="/marketplaces/blueprints/:tab/:blueprintId" element={<Navigate to="/marketplaces/solution-specs" replace />} />
          
          {/* Solution Specs marketplace */}
          <Route path="/marketplaces/solution-specs" element={<SolutionSpecsPage />} />
          <Route path="/marketplaces/solution-specs/:id" element={<SolutionSpecDetailPage />} />
          
          {/* Solution Build marketplace */}
          <Route path="/marketplaces/solution-build" element={<SolutionBuildPage />} />
          <Route path="/marketplaces/solution-build/:id" element={<SolutionBuildDetailPage />} />
          
          {/* Support Services marketplace */}
          <Route path="/marketplaces/support-services" element={<SupportServicesPage />} />
          <Route path="/marketplaces/support-services/:tab/:cardId" element={<SupportServicesDetailPage />} />
          
          {/* Digital Intelligence marketplace */}
          <Route path="/marketplaces/digital-intelligence" element={<DigitalIntelligencePage />} />
          <Route path="/marketplaces/digital-intelligence/:tab/:cardId" element={<DigitalIntelligenceDetailPage />} />
          
          {/* Portfolio Management marketplace */}
          <Route path="/marketplaces/portfolio-management" element={<PortfolioManagementPage />} />
          <Route path="/marketplaces/portfolio-management/:tab/:cardId" element={<PortfolioDetailPage />} />
          
          {/* Other marketplace routes */}
          <Route path="/marketplaces/lifecycle-management" element={<ComingSoonPage pageName="Lifecycle Management" />} />
          
          {/* Resource routes */}
          <Route path="/best-practices" element={<ComingSoonPage pageName="Best Practices" />} />
          <Route path="/standards" element={<ComingSoonPage pageName="Architecture Standards" />} />
          <Route path="/support" element={<ComingSoonPage pageName="Support Center" />} />
          <Route path="/docs" element={<ComingSoonPage pageName="Documentation" />} />
          <Route path="/compliance" element={<ComingSoonPage pageName="Compliance Tracking" />} />
          <Route path="/faq" element={<ComingSoonPage pageName="FAQ" />} />
          <Route path="/contact" element={<ComingSoonPage pageName="Contact Us" />} />
          <Route path="/privacy" element={<ComingSoonPage pageName="Privacy Policy" />} />
          <Route path="/terms" element={<ComingSoonPage pageName="Terms of Service" />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
