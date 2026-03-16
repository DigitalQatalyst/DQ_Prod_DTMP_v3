import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import ServiceDashboardPage from '@/pages/stage2/intelligence/ServiceDashboardPage';
import { intelligenceServices } from '@/data/digitalIntelligence/stage2';

export default function DigitalIntelligenceDashboardPage() {
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const navigate = useNavigate();

  const service = intelligenceServices.find(s => s.id === cardId);
  const serviceTitle = service?.title || 'Dashboard';

  if (!cardId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No service specified.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1600px] mx-auto px-6 py-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
              <button onClick={() => navigate('/')} className="hover:text-gray-900 transition-colors">Home</button>
              <ChevronRight size={14} className="text-gray-400" />
              <button onClick={() => navigate('/marketplaces')} className="hover:text-gray-900 transition-colors">Marketplaces</button>
              <ChevronRight size={14} className="text-gray-400" />
              <button onClick={() => navigate('/marketplaces/digital-intelligence')} className="hover:text-gray-900 transition-colors">Digital Intelligence</button>
              <ChevronRight size={14} className="text-gray-400" />
              <button onClick={() => navigate(`/marketplaces/digital-intelligence/${tab}/${cardId}`)} className="hover:text-gray-900 transition-colors">{serviceTitle}</button>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-gray-900 font-medium" aria-current="page">Dashboard</span>
            </nav>
          </div>
        </div>

        {/* Full-width dashboard */}
        <div className="max-w-[1600px] mx-auto">
          <ServiceDashboardPage serviceId={cardId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
