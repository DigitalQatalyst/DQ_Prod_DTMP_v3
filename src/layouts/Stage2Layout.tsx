import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowLeft, 
  LayoutGrid, 
  Settings,
  Home,
  BarChart3,
  FileText,
  PenTool,
  Rocket,
  RefreshCw,
  Briefcase,
  Brain,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Layers,
  Zap,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Stage2Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [middleColumnCollapsed, setMiddleColumnCollapsed] = useState(false);
  
  // Determine active service based on current path
  const getActiveService = () => {
    if (location.pathname.startsWith('/stage2/specs')) return 'Solutions Specs';
    if (location.pathname.startsWith('/stage2/portfolio-management')) return 'Portfolio Management';
    if (location.pathname.startsWith('/stage2/learning-center')) return 'Learning Center';
    return 'Overview';
  };
  
  const activeService = getActiveService();
  
  // Determine active sub-item for Solutions Specs
  const getActiveSubItem = () => {
    if (location.pathname.includes('/specs/blueprints')) return 'blueprints';
    if (location.pathname.includes('/specs/templates')) return 'templates';
    if (location.pathname.includes('/specs/patterns')) return 'patterns';
    if (location.pathname.includes('/specs/my-designs')) return 'my-designs';
    if (location.pathname.includes('/specs/overview')) return 'overview';
    return null;
  };
  
  const activeSubItem = getActiveSubItem();
  
  const isActiveService = (service: string) => {
    if (service === 'Solutions Specs' && location.pathname.startsWith('/stage2/specs')) {
      return 'bg-orange-50 text-orange-700 font-medium';
    }
    return activeService === service ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700 hover:bg-gray-50';
  };
  
  const isOverviewActive = () => {
    return location.pathname === '/stage2'
      ? 'bg-orange-50 text-orange-700 font-medium' 
      : 'text-gray-700 hover:bg-gray-50';
  };

  const navigateToOrchestrator = (
    marketplace: string,
    serviceName: string,
    cardId = ""
  ) => {
    navigate('/stage2', {
      state: {
        marketplace,
        serviceName,
        cardId,
      },
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden h-screen">
      {/* Left Sidebar - Navigation */}
      <div className={`${leftSidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 flex-shrink-0 h-full`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-3 ${leftSidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              {!leftSidebarCollapsed && (
                <div>
                  <h2 className="font-semibold text-sm">DTMP Platform</h2>
                  <p className="text-xs text-gray-500">Stage 2 - Service Hub</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
              className="p-1 h-6 w-6"
            >
              {leftSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <button 
              onClick={() => navigate('/stage2')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isOverviewActive()}`}
              title="Overview"
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && 'Overview'}
            </button>
            
            {!leftSidebarCollapsed && (
              <div className="pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
                  Services
                </p>
              </div>
            )}
            
            <button 
              onClick={() => navigate('/stage2/templates/overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService('AI DocWriter')}`}
              title="AI DocWriter"
            >
              <PenTool className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && 'AI DocWriter'}
            </button>
            
            {/* Solutions Specs */}
            <button 
              onClick={() => navigate('/stage2/specs/overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService('Solutions Specs')}`}
              title="Solutions Specs"
            >
              <PenTool className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && 'Solutions Specs'}
            </button>
            
            <button 
              onClick={() =>
                navigateToOrchestrator(
                  'learning-center',
                  'Learning Center',
                  'digital-transformation-fundamentals'
                )
              }
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService('Learning Center')}`}
              title="Learning Center"
            >
              <Headphones className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && 'Learning Center'}
            </button>
            
            <button 
              onClick={() => navigate('/stage2/portfolio-management')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService('Portfolio Management')}`}
              title="Portfolio Management"
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && 'Portfolio Management'}
            </button>
            
            <button 
              onClick={() =>
                navigateToOrchestrator(
                  'digital-intelligence',
                  'Digital Intelligence'
                )
              }
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isActiveService('Digital Intelligence')}`}
              title="Digital Intelligence"
            >
              <Brain className="w-4 h-4 flex-shrink-0" />
              {!leftSidebarCollapsed && 'Digital Intelligence'}
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className={`flex items-center gap-3 mb-3 ${leftSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-orange-700 text-xs font-medium">JD</span>
            </div>
            {!leftSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-gray-500">Portfolio Manager</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Column - Solutions Specs Sub-Navigation (2nd Column) */}
      {activeService === 'Solutions Specs' && (
        <div className={`${middleColumnCollapsed ? 'w-0' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden flex-shrink-0 h-full`}>
          {!middleColumnCollapsed && (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Solutions Specs</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMiddleColumnCollapsed(true)}
                    className="p-1 h-6 w-6"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sub-Navigation */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-1">
                  <button
                    onClick={() => navigate('/stage2/specs/overview')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSubItem === 'overview' || !activeSubItem
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 flex-shrink-0" />
                    Overview
                  </button>
                  
                  <button
                    onClick={() => navigate('/stage2/specs/blueprints')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSubItem === 'blueprints'
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Layers className="w-4 h-4 flex-shrink-0" />
                    Architecture Library
                  </button>
                  
                  <button
                    onClick={() => navigate('/stage2/specs/templates')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSubItem === 'templates'
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    Design Templates
                  </button>
                  
                  <button
                    onClick={() => navigate('/stage2/specs/patterns')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSubItem === 'patterns'
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Zap className="w-4 h-4 flex-shrink-0" />
                    Design Patterns
                  </button>
                  
                  <button
                    onClick={() => navigate('/stage2/specs/my-designs')}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSubItem === 'my-designs'
                        ? 'bg-orange-50 text-orange-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4 flex-shrink-0" />
                    My Designs
                  </button>
                </div>
              </nav>
            </>
          )}
          
          {/* Collapsed Button */}
          {middleColumnCollapsed && (
            <div className="p-2 border-r border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMiddleColumnCollapsed(false)}
                className="p-1 h-8 w-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}


