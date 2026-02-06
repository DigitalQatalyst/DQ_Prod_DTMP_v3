# Portfolio Management Marketplace - Implementation Plan

## Project Overview
Implement the Portfolio Management marketplace for the Digital Business Platform (DBP), providing centralized oversight for application and project portfolios within the "Drive" phase of the 4D transformation model.

## Current Status Analysis

### ✅ Already Implemented
- Marketplace definition in `src/data/marketplaces.ts`
- Route structure in `src/App.tsx` (currently shows "Coming Soon")
- Empty component folder: `src/components/portfolio/`
- Empty data folder: `src/data/portfolio/`
- Learning content: Portfolio Manager Certification Path
- Related templates and tools in other marketplaces

### 🔄 Existing Portfolio References
- **Learning Center**: Portfolio Management Excellence course (20 hours)
- **Templates**: Investment summaries, application health checks
- **Contributors**: CEO portfolio oversight responsibilities
- **Value Props**: Enterprise-wide portfolio oversight messaging

## Implementation Scope

### Core Features (from marketplace definition)
1. **Application Portfolio Management**
2. **Project Portfolio Management**

### Target Service Count: 11 services

## Detailed Implementation Plan

### Phase 1: Data Structure & Content
**Files to Create:**
- `src/data/portfolio/index.ts` - Main exports
- `src/data/portfolio/applications.ts` - Application portfolio data
- `src/data/portfolio/projects.ts` - Project portfolio data
- `src/data/portfolio/filters.ts` - Filter categories and options
- `src/data/portfolio/dashboards.ts` - Dashboard metrics and KPIs

**Content Categories:**
1. **Application Portfolio Services (5-6 services)**
   - Application Inventory Management
   - Technology Stack Analysis
   - Application Health Dashboard
   - Cost & ROI Tracking
   - Compliance & Risk Assessment
   - Retirement & Modernization Planning

2. **Project Portfolio Services (5-6 services)**
   - Project Dashboard & Status
   - Resource Allocation Management
   - Budget & Timeline Tracking
   - Risk & Dependency Management
   - Portfolio Optimization Tools
   - Executive Reporting

### Phase 2: UI Components
**Files to Create:**
- `src/components/portfolio/PortfolioCard.tsx` - Service cards
- `src/components/portfolio/MarketplaceHeader.tsx` - Header component
- `src/components/portfolio/FilterPanel.tsx` - Filtering interface
- `src/components/portfolio/index.ts` - Component exports

**Component Features:**
- Consistent with existing marketplace patterns (Blueprints, Learning Center)
- Responsive design (mobile-first)
- Accessibility compliance (WCAG 2.1 AA)
- Touch targets 44x44px minimum
- Proper ARIA labels and semantic HTML

### Phase 3: Pages & Routing
**Files to Create:**
- `src/pages/PortfolioManagementPage.tsx` - Main marketplace page
- `src/pages/PortfolioDetailPage.tsx` - Individual service detail pages

**Page Structure:**
- Header with breadcrumbs and marketplace info
- Tab navigation (Application Portfolio | Project Portfolio)
- Filter panel (service type, complexity, target audience)
- Service cards grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Search functionality
- Service count and filtering feedback

### Phase 4: Integration & Testing
**Files to Update:**
- `src/App.tsx` - Update routes from ComingSoonPage to actual pages
- Ensure integration with existing learning content
- Link to related templates and tools

## Design Patterns to Follow

### 1. Marketplace Structure (Based on Blueprints)
```
/marketplaces/portfolio-management
├── Application Portfolio tab
├── Project Portfolio tab
├── Filter panel (left sidebar on desktop, overlay on mobile)
├── Search bar
├── Service cards grid
└── Detail pages: /marketplaces/portfolio-management/:tab/:serviceId
```

### 2. Component Architecture
- Follow existing patterns from `src/components/blueprints/`
- Reuse UI components from `src/components/ui/`
- Maintain consistency with Learning Center and Knowledge Center

### 3. Data Structure
```typescript
interface PortfolioService {
  id: string;
  category: 'application' | 'project';
  title: string;
  description: string;
  features: string[];
  complexity: 'Low' | 'Medium' | 'High';
  targetAudience: string[];
  icon: LucideIcon;
  tags: string[];
  estimatedTime: string;
  prerequisites?: string[];
}
```

## Content Strategy

### Application Portfolio Services
1. **Application Inventory** - Comprehensive catalog and metadata management
2. **Health Dashboard** - Performance, security, and technical debt metrics
3. **Cost Analytics** - TCO analysis, license optimization, ROI tracking
4. **Technology Assessment** - Stack analysis, modernization roadmaps
5. **Compliance Tracker** - Security, regulatory, and policy compliance
6. **Lifecycle Planning** - Retirement, replacement, and upgrade strategies

### Project Portfolio Services
1. **Project Dashboard** - Real-time status, milestones, and health indicators
2. **Resource Management** - Team allocation, capacity planning, skill gaps
3. **Financial Oversight** - Budget tracking, cost forecasting, variance analysis
4. **Risk Management** - Risk registers, dependency tracking, mitigation plans
5. **Performance Analytics** - Delivery metrics, success rates, lessons learned
6. **Strategic Alignment** - Priority scoring, value realization, portfolio optimization

## Technical Requirements

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Touch-friendly interactions
- Accessible navigation

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper focus management
- Color contrast compliance

### Performance
- Lazy loading for service cards
- Efficient filtering and search
- Optimized images and icons
- Fast page transitions

## Integration Points

### 1. Learning Center
- Link to Portfolio Manager Certification Path
- Reference Portfolio Management Excellence course
- Cross-promote related learning tracks

### 2. Templates Marketplace
- Link to portfolio-related templates
- Investment summaries
- Application assessment templates
- Executive reporting templates

### 3. Lifecycle Management
- Cross-reference with lifecycle tracking
- Shared data models where applicable
- Complementary service offerings

### 4. Digital Intelligence
- Link to analytics and insights
- Portfolio performance metrics
- Maturity assessments

## Success Metrics

### Implementation Success
- [ ] 11 portfolio services implemented
- [ ] Responsive design across all breakpoints
- [ ] Accessibility compliance verified
- [ ] Integration with existing marketplaces
- [ ] Consistent user experience

### User Experience
- [ ] Intuitive navigation between application and project portfolios
- [ ] Effective filtering and search functionality
- [ ] Clear service descriptions and value propositions
- [ ] Seamless integration with learning and template resources

## Timeline Estimate

### Phase 1: Data & Content (2-3 hours)
- Create data structures
- Define 11 portfolio services
- Set up filtering categories

### Phase 2: Components (3-4 hours)
- Build reusable components
- Implement responsive design
- Ensure accessibility compliance

### Phase 3: Pages & Routing (2-3 hours)
- Create main marketplace page
- Build detail pages
- Update routing

### Phase 4: Integration & Polish (1-2 hours)
- Connect with existing systems
- Final testing and refinement
- Documentation updates

**Total Estimated Time: 8-12 hours**

## Next Steps

1. **Start with Phase 1**: Create data structures and content
2. **Follow existing patterns**: Use Blueprints marketplace as primary reference
3. **Maintain consistency**: Ensure UI/UX matches other marketplaces
4. **Test thoroughly**: Verify responsive design and accessibility
5. **Document changes**: Update relevant documentation files

## Files to Create/Modify

### New Files (8-10 files)
```
src/data/portfolio/
├── index.ts
├── applications.ts
├── projects.ts
├── filters.ts
└── dashboards.ts

src/components/portfolio/
├── index.ts
├── PortfolioCard.tsx
├── MarketplaceHeader.tsx
└── FilterPanel.tsx

src/pages/
├── PortfolioManagementPage.tsx
└── PortfolioDetailPage.tsx
```

### Modified Files (1 file)
```
src/App.tsx - Update routing
```

---

*This plan provides a comprehensive roadmap for implementing the Portfolio Management marketplace while maintaining consistency with existing platform patterns and ensuring a high-quality user experience.*Portfolio Management marketplace 

 

This is **Prompt 6 of 9** in building the complete DTMP v3 platform. 

 

**Already Built:** 

- Prompt 1: Foundation (Header, Footer, Landing, Marketplaces Overview, Design System) 

- Prompt 2: Learning Center (Courses, Learning Tracks, Reviews) - Discern 

- Prompt 3: Knowledge Center (Best Practices, Testimonials, Playbooks, Library) - Discern 

- Prompt 4: Templates (6 tabs with 70+ templates, AI DocWriter 4.0) - Design 

- Prompt 5: Blueprints (Solution Specs, Solution Build, 39 blueprints) - Design + Deploy 

 

**Building in this prompt:** 

- Complete Portfolio Management marketplace page with 2 tabs 

- Tab-based navigation (Application Portfolio, Project Portfolio) 

- Left filter panel (tab-specific filters) 

- Global search bar (marketplace-scoped) 

- Service card grids (18 application portfolio services, 14 project portfolio services) 

- Detail page component (reusing structure, with Portfolio Management-specific content) 

- Portfolio dashboards, health metrics, and rationalization tools emphasis 

- Reuse login modal and Stage 2 placeholder 

 

**Key Differentiator:** 

Portfolio Management marketplace focuses on strategic oversight, governance, and optimization of both application and project portfolios in the Drive phase. 

 

--- 

 

## TECHNICAL STACK 

 

Same as previous prompts: 

- React with TypeScript 

- React Router v6 

- Tailwind CSS 

- Lucide React icons 

- Responsive mobile-first design 

 

--- 

 

## ROUTING 

 

**New routes for this prompt:** 

```javascript 

// Portfolio Management marketplace 

{ path: '/marketplaces/portfolio-management', element: <PortfolioManagementPage /> } 

 

// Detail pages (dynamic route) 

{ path: '/marketplaces/portfolio-management/:tab/:cardId', element: <DetailPage /> } 

``` 

 

**Example detail page URLs:** 

- `/marketplaces/portfolio-management/application-portfolio/application-rationalization` 

- `/marketplaces/portfolio-management/application-portfolio/tco-optimization` 

- `/marketplaces/portfolio-management/project-portfolio/portfolio-dashboard` 

- `/marketplaces/portfolio-management/project-portfolio/resource-capacity-planning` 

 

--- 

 

## PORTFOLIO MANAGEMENT MARKETPLACE PAGE 

 

**Route:** `/marketplaces/portfolio-management` 

 

### Page Structure 

 

Same structure as previous marketplaces: 

``` 

┌────────────────────────────────────────────────────────────┐ 

│ HEADER (from Prompt 1)                                     │ 

├────────────────────────────────────────────────────────────┤ 

│ MARKETPLACE HEADER                                         │ 

│ - Breadcrumb: Home > Marketplaces > Portfolio Mgmt       │ 

│ - Phase badge: Drive                                      │ 

│ - Title: DTMP Portfolio Management                       │ 

│ - Description                                             │ 

├────────────────────────────────────────────────────────────┤ 

│ FEATURE TABS (2 tabs)                                     │ 

│ [Application Portfolio] [Project Portfolio]              │ 

├─────────────┬──────────────────────────────────────────────┤ 

│             │ GLOBAL SEARCH BAR                            │ 

│  FILTER     ├──────────────────────────────────────────────┤ 

│  PANEL      │ RESULT COUNT                                 │ 

│             ├──────────────────────────────────────────────┤ 

│  (Changes   │ SERVICE CARDS GRID (current tab)            │ 

│   per tab)  │                                             │ 

└─────────────┴──────────────────────────────────────────────┘ 

│ FOOTER (from Prompt 1)                                     │ 

└────────────────────────────────────────────────────────────┘ 

``` 

 

--- 

 

### MARKETPLACE HEADER 

```html 

<section className="marketplace-header"> 

  <nav className="breadcrumb"> 

    <a href="/">Home</a> 

    <span className="separator">/</span> 

    <a href="/marketplaces">Marketplaces</a> 

    <span className="separator">/</span> 

    <span className="current">Portfolio Management</span> 

  </nav> 

   

  <div className="header-content"> 

    <span className="phase-badge drive">Drive</span> 

    <h1 className="marketplace-title">DTMP Portfolio Management</h1> 

    <p className="marketplace-description"> 

      Strategic oversight and optimization of application and project portfolios.  

      Gain visibility into portfolio health, rationalize applications, optimize  

      TCO, track project delivery, and make data-driven investment decisions.  

      Centralized governance and portfolio intelligence for continuous improvement. 

    </p> 

    <div className="marketplace-stats"> 

      <span className="stat"> 

        <Icon name="Briefcase" size={18} /> 

        32 Portfolio Services 

      </span> 

      <span className="stat"> 

        <Icon name="TrendingUp" size={18} /> 

        Real-time Analytics 

      </span> 

      <span className="stat"> 

        <Icon name="Target" size={18} /> 

        Strategic Oversight 

      </span> 

    </div> 

  </div> 

</section> 

``` 

 

**Drive Phase Badge Styling:** 

- Background: bg-orange-100 text-orange-700 

- Same styling as previous phase badges 

 

--- 

 

### FEATURE TABS 

 

**Tab Navigation:** 

```html 

<nav className="feature-tabs"> 

  <button className={`tab ${activeTab === 'application-portfolio' ? 'active' : ''}`}> 

    <Icon name="AppWindow" size={20} /> 

    <span>Application Portfolio</span> 

    <span className="tab-count">18</span> 

  </button> 

   

  <button className={`tab ${activeTab === 'project-portfolio' ? 'active' : ''}`}> 

    <Icon name="FolderKanban" size={20} /> 

    <span>Project Portfolio</span> 

    <span className="tab-count">14</span> 

  </button> 

</nav> 

``` 

 

**Mobile Tab Labels (if needed):** 

- Application Portfolio → "Applications" 

- Project Portfolio → "Projects" 

 

--- 

 

### GLOBAL SEARCH BAR 

 

Same structure as previous marketplaces, with placeholder text changing per tab: 

- Application Portfolio: "Search application services or categories..." 

- Project Portfolio: "Search project services or types..." 

 

--- 

 

### FILTER GROUPS BY TAB 

 

#### **APPLICATION PORTFOLIO TAB FILTERS:** 

```javascript 

const applicationPortfolioFilters = { 

  serviceCategory: ["Portfolio Analytics", "Application Rationalization", "TCO Management", "Lifecycle Management", "Health Monitoring", "Risk Assessment"], 

  portfolioScope: ["Enterprise", "Business Unit", "Domain", "Application"], 

  analysisType: ["Strategic", "Operational", "Financial", "Technical", "Risk"], 

  deliveryModel: ["Dashboard", "Report", "Workshop", "Assessment", "Consulting"], 

  updateFrequency: ["Real-time", "Daily", "Weekly", "Monthly", "On-demand"], 

  integrationLevel: ["Standalone", "CMDB Integrated", "APM Integrated", "Full Integration"], 

  complexity: ["Low", "Medium", "High"] 

} 

``` 

 

#### **PROJECT PORTFOLIO TAB FILTERS:** 

```javascript 

const projectPortfolioFilters = { 

  serviceCategory: ["Portfolio Dashboard", "Project Health Tracking", "Resource Management", "Budget & Finance", "Risk Management", "Delivery Analytics"], 

  portfolioType: ["Transformation Projects", "IT Projects", "Business Projects", "Innovation Projects", "All Projects"], 

  projectPhase: ["Initiation", "Planning", "Execution", "Monitoring", "Closure", "All Phases"], 

  deliveryModel: ["Dashboard", "Report", "Tool", "Consulting", "Assessment"], 

  updateFrequency: ["Real-time", "Daily", "Weekly", "Monthly"], 

  reportingLevel: ["Executive", "Portfolio Manager", "Project Manager", "Team"], 

  complexity: ["Low", "Medium", "High"] 

} 

``` 

 

--- 

 

### PORTFOLIO SERVICE CARD COMPONENT (Universal for both tabs) 

```html 

<div className="portfolio-card" onClick={() => navigate(`/marketplaces/portfolio-management/${tab}/${service.id}`)}> 

  <div className="card-header"> 

    <div className="service-icon-wrapper"> 

      <Icon name={service.icon} className="service-icon" size={32} /> 

    </div> 

    <div className="service-badges"> 

      <span className="category-badge">{service.category}</span> 

      {service.realtime && ( 

        <span className="realtime-badge"> 

          <Icon name="Zap" size={12} /> 

          Real-time 

        </span> 

      )} 

    </div> 

  </div> 

   

  <div className="card-content"> 

    <h3 className="card-title">{service.title}</h3> 

    <p className="card-description">{service.description}</p> 

     

    <div className="service-features"> 

      <div className="feature-item"> 

        <Icon name="BarChart3" size={14} /> 

        <span>{service.analysisType}</span> 

      </div> 

      <div className="feature-item"> 

        <Icon name="Layout" size={14} /> 

        <span>{service.deliveryModel}</span> 

      </div> 

      <div className="feature-item"> 

        <Icon name="RefreshCw" size={14} /> 

        <span>{service.updateFrequency}</span> 

      </div> 

    </div> 

     

    {service.keyMetrics && ( 

      <div className="key-metrics"> 

        <p className="metrics-label">Key Metrics:</p> 

        <div className="metrics-list"> 

          {service.keyMetrics.slice(0, 3).map(metric => ( 

            <span className="metric-tag">{metric}</span> 

          ))} 

        </div> 

      </div> 

    )} 

     

    <div className="card-footer"> 

      <span className="scope-indicator"> 

        <Icon name="Target" size={14} /> 

        {service.scope} 

      </span> 

      <button className="access-btn"> 

        <Icon name="ExternalLink" size={16} /> 

        Access Service 

      </button> 

    </div> 

  </div> 

</div> 

``` 

 

**Portfolio Card Styling:** 

- Background: bg-white 

- Border: border-2 border-gray-200 

- Rounded: rounded-xl 

- Padding: p-6 

- Hover: hover:border-orange-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 

- Cursor: cursor-pointer 

 

**Card Header:** 

- Flex: flex justify-between items-start mb-4 

 

**Service Icon Wrapper:** 

- Size: w-16 h-16 

- Background: bg-gradient-to-br from-orange-100 to-pink-100 

- Rounded: rounded-xl 

- Flex: flex items-center justify-center 

 

**Service Icon:** 

- Color: text-orange-600 

 

**Service Badges:** 

- Flex: flex items-center gap-2 

 

**Category Badge:** 

- Background: bg-blue-100 text-blue-700 

- Padding: px-3 py-1 

- Rounded: rounded-full 

- Font: text-xs font-semibold uppercase 

 

**Realtime Badge:** 

- Background: bg-green-100 text-green-700 

- Padding: px-2 py-1 

- Rounded: rounded-full 

- Font: text-xs font-semibold 

- Flex: flex items-center gap-1 

 

**Service Features:** 

- Background: bg-gray-50 

- Border: border border-gray-200 

- Rounded: rounded-lg 

- Padding: p-3 

- Space: space-y-2 

- Margin: mb-4 

 

**Feature Item:** 

- Flex: flex items-center gap-2 

- Font: text-sm text-gray-700 

 

**Key Metrics:** 

- Border top: border-t border-gray-200 pt-3 mb-4 

 

**Metrics Label:** 

- Font: text-xs font-semibold text-gray-700 uppercase mb-2 

 

**Metrics List:** 

- Flex: flex flex-wrap gap-2 

 

**Metric Tag:** 

- Background: bg-purple-50 text-purple-700 

- Border: border border-purple-200 

- Padding: px-2 py-1 

- Rounded: rounded 

- Font: text-xs font-medium 

 

**Card Footer:** 

- Flex: flex justify-between items-center 

- Border top: border-t border-gray-200 pt-4 

 

**Scope Indicator:** 

- Font: text-sm text-gray-600 

- Flex: flex items-center gap-1 

 

**Access Button:** 

- Background: bg-orange-600 text-white hover:bg-orange-700 

- Padding: px-4 py-2 

- Rounded: rounded-lg 

- Font: text-sm font-semibold 

- Flex: flex items-center gap-2 

 

--- 

 

### APPLICATION PORTFOLIO DATA (18 cards) 

```javascript 

const applicationPortfolio = [ 

  { 

    id: "application-rationalization", 

    title: "Application Rationalization Assessment", 

    description: "Comprehensive analysis to identify redundant, outdated, or overlapping applications for consolidation or retirement", 

    icon: "GitCompare", 

    category: "Application Rationalization", 

    scope: "Enterprise", 

    analysisType: "Strategic", 

    deliveryModel: "Assessment", 

    updateFrequency: "On-demand", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Redundancy Score", "Business Value", "Technical Health", "TCO Impact"], 

    integrationLevel: "CMDB Integrated" 

  }, 

  { 

    id: "portfolio-health-dashboard", 

    title: "Application Portfolio Health Dashboard", 

    description: "Real-time dashboard showing portfolio-wide health metrics, risks, and trends", 

    icon: "Activity", 

    category: "Health Monitoring", 

    scope: "Enterprise", 

    analysisType: "Operational", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "Medium", 

    realtime: true, 

    keyMetrics: ["Health Score", "Risk Index", "Availability", "Performance"], 

    integrationLevel: "APM Integrated" 

  }, 

  { 

    id: "tco-optimization", 

    title: "Total Cost of Ownership (TCO) Optimization", 

    description: "Detailed TCO analysis with cost optimization recommendations across the application portfolio", 

    icon: "DollarSign", 

    category: "TCO Management", 

    scope: "Enterprise", 

    analysisType: "Financial", 

    deliveryModel: "Report", 

    updateFrequency: "Monthly", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Total TCO", "Cost per User", "License Optimization", "Infrastructure Savings"], 

    integrationLevel: "Full Integration" 

  }, 

  { 

    id: "application-lifecycle-tracking", 

    title: "Application Lifecycle Management", 

    description: "Track applications through their complete lifecycle from inception to retirement", 

    icon: "RefreshCw", 

    category: "Lifecycle Management", 

    scope: "Enterprise", 

    analysisType: "Operational", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "Medium", 

    realtime: true, 

    keyMetrics: ["Lifecycle Stage", "Age", "End-of-Life Date", "Replacement Status"], 

    integrationLevel: "CMDB Integrated" 

  }, 

  { 

    id: "technical-debt-assessment", 

    title: "Technical Debt Assessment", 

    description: "Quantify and prioritize technical debt across the application portfolio", 

    icon: "AlertTriangle", 

    category: "Risk Assessment", 

    scope: "Enterprise", 

    analysisType: "Technical", 

    deliveryModel: "Assessment", 

    updateFrequency: "Quarterly", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Debt Score", "Remediation Cost", "Business Impact", "Priority"], 

    integrationLevel: "CMDB Integrated" 

  }, 

  { 

    id: "capability-coverage-analysis", 

    title: "Capability Coverage Analysis", 

    description: "Map applications to business capabilities to identify gaps and overlaps", 

    icon: "Grid3x3", 

    category: "Portfolio Analytics", 

    scope: "Enterprise", 

    analysisType: "Strategic", 

    deliveryModel: "Workshop", 

    updateFrequency: "On-demand", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Coverage Score", "Capability Gaps", "Redundancy", "Investment Alignment"], 

    integrationLevel: "Standalone" 

  }, 

  { 

    id: "vendor-risk-analysis", 

    title: "Vendor & Technology Risk Analysis", 

    description: "Assess risks related to application vendors, technologies, and dependencies", 

    icon: "ShieldAlert", 

    category: "Risk Assessment", 

    scope: "Enterprise", 

    analysisType: "Risk", 

    deliveryModel: "Report", 

    updateFrequency: "Quarterly", 

    complexity: "Medium", 

    realtime: false, 

    keyMetrics: ["Vendor Risk", "EOL Risk", "Concentration Risk", "Mitigation Status"], 

    integrationLevel: "CMDB Integrated" 

  }, 

  { 

    id: "cloud-readiness-assessment", 

    title: "Cloud Migration Readiness Assessment", 

    description: "Evaluate application readiness for cloud migration with effort estimates", 

    icon: "Cloud", 

    category: "Portfolio Analytics", 

    scope: "Application", 

    analysisType: "Technical", 

    deliveryModel: "Assessment", 

    updateFrequency: "On-demand", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Readiness Score", "Migration Effort", "Cloud Fit", "Priority"], 

    integrationLevel: "CMDB Integrated" 

  }, 

  { 

    id: "license-compliance-tracking", 

    title: "License Compliance & Optimization", 

    description: "Monitor software license usage, compliance, and optimization opportunities", 

    icon: "FileKey", 

    category: "TCO Management", 

    scope: "Enterprise", 

    analysisType: "Financial", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "Medium", 

    realtime: true, 

    keyMetrics: ["Compliance Rate", "License Utilization", "Cost Savings", "Risk Exposure"], 

    integrationLevel: "Full Integration" 

  }, 

  { 

    id: "application-dependency-mapping", 

    title: "Application Dependency Mapping", 

    description: "Visualize and analyze application dependencies and integration complexity", 

    icon: "Network", 

    category: "Portfolio Analytics", 

    scope: "Enterprise", 

    analysisType: "Technical", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "High", 

    realtime: true, 

    keyMetrics: ["Dependency Count", "Integration Complexity", "Risk Score", "Critical Path"], 

    integrationLevel: "Full Integration" 

  }, 

  { 

    id: "business-value-scoring", 

    title: "Business Value Scoring Framework", 

    description: "Quantitative framework to assess and score business value of each application", 

    icon: "Star", 

    category: "Portfolio Analytics", 

    scope: "Enterprise", 

    analysisType: "Strategic", 

    deliveryModel: "Workshop", 

    updateFrequency: "Quarterly", 

    complexity: "Medium", 

    realtime: false, 

    keyMetrics: ["Business Value Score", "Strategic Alignment", "User Satisfaction", "ROI"], 

    integrationLevel: "Standalone" 

  }, 

  { 

    id: "security-posture-monitoring", 

    title: "Application Security Posture Monitoring", 

    description: "Continuous monitoring of security vulnerabilities and compliance across portfolio", 

    icon: "Shield", 

    category: "Health Monitoring", 

    scope: "Enterprise", 

    analysisType: "Risk", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "High", 

    realtime: true, 

    keyMetrics: ["Security Score", "Vulnerabilities", "Compliance Rate", "Remediation SLA"], 

    integrationLevel: "APM Integrated" 

  }, 

  { 

    id: "modernization-roadmap", 

    title: "Application Modernization Roadmap", 

    description: "Strategic roadmap for modernizing legacy applications with prioritization", 

    icon: "Map", 

    category: "Application Rationalization", 

    scope: "Enterprise", 

    analysisType: "Strategic", 

    deliveryModel: "Consulting", 

    updateFrequency: "On-demand", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Modernization Priority", "Effort Estimate", "Business Impact", "Timeline"], 

    integrationLevel: "CMDB Integrated" 

  }, 

  { 

    id: "user-adoption-analytics", 

    title: "Application User Adoption Analytics", 

    description: "Track user adoption, usage patterns, and satisfaction across applications", 

    icon: "Users", 

    category: "Health Monitoring", 

    scope: "Enterprise", 

    analysisType: "Operational", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Daily", 

    complexity: "Medium", 

    realtime: false, 

    keyMetrics: ["Adoption Rate", "Active Users", "Feature Usage", "Satisfaction Score"], 

    integrationLevel: "Full Integration" 

  }, 

  { 

    id: "integration-health-monitoring", 

    title: "Integration Health Monitoring", 

    description: "Monitor health and performance of application integrations and APIs", 

    icon: "Link", 

    category: "Health Monitoring", 

    scope: "Enterprise", 

    analysisType: "Operational", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "Medium", 

    realtime: true, 

    keyMetrics: ["Integration Uptime", "API Performance", "Error Rate", "SLA Compliance"], 

    integrationLevel: "APM Integrated" 

  }, 

  { 

    id: "disaster-recovery-readiness", 

    title: "Disaster Recovery Readiness Assessment", 

    description: "Evaluate DR/BC readiness of critical applications with gap analysis", 

    icon: "HardDrive", 

    category: "Risk Assessment", 

    scope: "Enterprise", 

    analysisType: "Risk", 

    deliveryModel: "Assessment", 

    updateFrequency: "Quarterly", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["DR Readiness", "RTO/RPO Gaps", "Testing Status", "Criticality"], 

    integrationLevel: "CMDB Integrated" 

  }, 

  { 

    id: "portfolio-benchmarking", 

    title: "Industry Portfolio Benchmarking", 

    description: "Compare your application portfolio against industry peers and best practices", 

    icon: "TrendingUp", 

    category: "Portfolio Analytics", 

    scope: "Enterprise", 

    analysisType: "Strategic", 

    deliveryModel: "Report", 

    updateFrequency: "Annually", 

    complexity: "Medium", 

    realtime: false, 

    keyMetrics: ["Benchmark Score", "Industry Position", "Best Practice Gap", "Improvement Areas"], 

    integrationLevel: "Standalone" 

  }, 

  { 

    id: "decommission-planning", 

    title: "Application Decommissioning Planning", 

    description: "Structured approach to safely decommission applications with minimal disruption", 

    icon: "Trash2", 

    category: "Lifecycle Management", 

    scope: "Application", 

    analysisType: "Operational", 

    deliveryModel: "Consulting", 

    updateFrequency: "On-demand", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Decom Readiness", "Impact Analysis", "Cost Savings", "Risk Mitigation"], 

    integrationLevel: "CMDB Integrated" 

  } 

] 

``` 

 

--- 

 

### PROJECT PORTFOLIO DATA (14 cards) 

```javascript 

const projectPortfolio = [ 

  { 

    id: "portfolio-dashboard", 

    title: "Executive Portfolio Dashboard", 

    description: "Comprehensive real-time view of all transformation and IT projects with health indicators", 

    icon: "LayoutDashboard", 

    category: "Portfolio Dashboard", 

    portfolioType: "All Projects", 

    projectPhase: "All Phases", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "Medium", 

    realtime: true, 

    keyMetrics: ["Portfolio Health", "On-time Delivery %", "Budget Variance", "Resource Utilization"], 

    reportingLevel: "Executive" 

  }, 

  { 

    id: "project-health-tracking", 

    title: "Project Health Tracking System", 

    description: "Monitor project health across multiple dimensions with predictive alerts", 

    icon: "Activity", 

    category: "Project Health Tracking", 

    portfolioType: "All Projects", 

    projectPhase: "Execution", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Daily", 

    complexity: "Medium", 

    realtime: false, 

    keyMetrics: ["Health Score", "Risk Level", "Schedule Status", "Quality Metrics"], 

    reportingLevel: "Project Manager" 

  }, 

  { 

    id: "resource-capacity-planning", 

    title: "Resource Capacity Planning Tool", 

    description: "Optimize resource allocation across the project portfolio with demand forecasting", 

    icon: "Users", 

    category: "Resource Management", 

    portfolioType: "All Projects", 

    projectPhase: "Planning", 

    deliveryModel: "Tool", 

    updateFrequency: "Weekly", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Capacity Utilization", "Demand Forecast", "Skill Gaps", "Allocation Efficiency"], 

    reportingLevel: "Portfolio Manager" 

  }, 

  { 

    id: "budget-variance-analysis", 

    title: "Budget & Cost Variance Analysis", 

    description: "Track budget performance and forecast cost variances across all projects", 

    icon: "DollarSign", 

    category: "Budget & Finance", 

    portfolioType: "All Projects", 

    projectPhase: "All Phases", 

    deliveryModel: "Report", 

    updateFrequency: "Monthly", 

    complexity: "Medium", 

    realtime: false, 

    keyMetrics: ["Budget Variance", "EAC", "Burn Rate", "Forecast Accuracy"], 

    reportingLevel: "Executive" 

  }, 

  { 

    id: "portfolio-risk-register", 

    title: "Portfolio Risk Register & Mitigation", 

    description: "Centralized risk management across all projects with mitigation tracking", 

    icon: "ShieldAlert", 

    category: "Risk Management", 

    portfolioType: "All Projects", 

    projectPhase: "All Phases", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Weekly", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Risk Count", "Exposure Value", "Mitigation Status", "Top Risks"], 

    reportingLevel: "Portfolio Manager" 

  }, 

  { 

    id: "dependency-management", 

    title: "Cross-Project Dependency Management", 

    description: "Identify and manage dependencies between projects to reduce conflicts", 

    icon: "GitBranch", 

    category: "Delivery Analytics", 

    portfolioType: "Transformation Projects", 

    projectPhase: "Planning", 

    deliveryModel: "Tool", 

    updateFrequency: "Real-time", 

    complexity: "High", 

    realtime: true, 

    keyMetrics: ["Dependency Count", "Critical Path", "Bottlenecks", "Conflict Risk"], 

    reportingLevel: "Portfolio Manager" 

  }, 

  { 

    id: "benefits-realization-tracking", 

    title: "Benefits Realization Tracking", 

    description: "Track and measure actual benefits realized against projected benefits", 

    icon: "TrendingUp", 

    category: "Delivery Analytics", 

    portfolioType: "Transformation Projects", 

    projectPhase: "Closure", 

    deliveryModel: "Report", 

    updateFrequency: "Quarterly", 

    complexity: "Medium", 

    realtime: false, 

    keyMetrics: ["Benefits Achieved", "ROI Realized", "Value Gap", "Time to Value"], 

    reportingLevel: "Executive" 

  }, 

  { 

    id: "agile-portfolio-metrics", 

    title: "Agile Portfolio Metrics Dashboard", 

    description: "Track agile metrics across multiple teams and projects", 

    icon: "Gauge", 

    category: "Delivery Analytics", 

    portfolioType: "IT Projects", 

    projectPhase: "Execution", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "Medium", 

    realtime: true, 

    keyMetrics: ["Velocity", "Sprint Health", "Cycle Time", "Throughput"], 

    reportingLevel: "Team" 

  }, 

  { 

    id: "portfolio-prioritization", 

    title: "Portfolio Prioritization Framework", 

    description: "Data-driven framework for prioritizing projects based on value, risk, and strategic alignment", 

    icon: "Target", 

    category: "Portfolio Dashboard", 

    portfolioType: "All Projects", 

    projectPhase: "Initiation", 

    deliveryModel: "Assessment", 

    updateFrequency: "Quarterly", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Strategic Alignment", "Value Score", "Risk Score", "Priority Rank"], 

    reportingLevel: "Executive" 

  }, 

  { 

    id: "project-intake-pipeline", 

    title: "Project Intake & Approval Pipeline", 

    description: "Streamline project requests with automated intake, scoring, and approval workflows", 

    icon: "Inbox", 

    category: "Portfolio Dashboard", 

    portfolioType: "All Projects", 

    projectPhase: "Initiation", 

    deliveryModel: "Tool", 

    updateFrequency: "Real-time", 

    complexity: "Medium", 

    realtime: true, 

    keyMetrics: ["Pending Requests", "Approval Rate", "Time to Decision", "Queue Length"], 

    reportingLevel: "Portfolio Manager" 

  }, 

  { 

    id: "stakeholder-engagement-tracking", 

    title: "Stakeholder Engagement Tracking", 

    description: "Monitor stakeholder engagement levels and satisfaction across projects", 

    icon: "Users", 

    category: "Delivery Analytics", 

    portfolioType: "Transformation Projects", 

    projectPhase: "All Phases", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Weekly", 

    complexity: "Low", 

    realtime: false, 

    keyMetrics: ["Engagement Score", "Satisfaction", "Communication Frequency", "Issue Resolution"], 

    reportingLevel: "Project Manager" 

  }, 

  { 

    id: "portfolio-scenario-planning", 

    title: "Portfolio Scenario Planning Tool", 

    description: "Model different portfolio scenarios to optimize resource allocation and outcomes", 

    icon: "GitCompare", 

    category: "Portfolio Dashboard", 

    portfolioType: "All Projects", 

    projectPhase: "Planning", 

    deliveryModel: "Tool", 

    updateFrequency: "On-demand", 

    complexity: "High", 

    realtime: false, 

    keyMetrics: ["Scenario Count", "Optimization Score", "Resource Impact", "Value Projection"], 

    reportingLevel: "Executive" 

  }, 

  { 

    id: "milestone-delivery-tracking", 

    title: "Milestone & Deliverable Tracking", 

    description: "Track key milestones and deliverables across the entire project portfolio", 

    icon: "CheckCircle", 

    category: "Project Health Tracking", 

    portfolioType: "All Projects", 

    projectPhase: "Execution", 

    deliveryModel: "Dashboard", 

    updateFrequency: "Real-time", 

    complexity: "Low", 

    realtime: true, 

    keyMetrics: ["Milestones Completed", "On-time Delivery", "Deliverable Quality", "Dependencies"], 

    reportingLevel: "Project Manager" 

  }, 

  { 

    id: "lessons-learned-repository", 

    title: "Lessons Learned Repository", 

    description: "Capture and share lessons learned across projects to improve future delivery", 

    icon: "BookOpen", 

    category: "Delivery Analytics", 

    portfolioType: "All Projects", 

    projectPhase: "Closure", 

    deliveryModel: "Tool", 

    updateFrequency: "On-demand", 

    complexity: "Low", 

    realtime: false, 

    keyMetrics: ["Lessons Captured", "Reuse Rate", "Improvement Impact", " Knowledge Sharing"], reportingLevel: "Portfolio Manager" } ] 

 

DETAIL PAGE CONTENT 

Reuse detail page structure with Portfolio Management-specific content. 

Content Tabs for Portfolio Management: 

About - Service overview, objectives, value proposition 

Methodology - Analysis approach, frameworks used, data sources 

Deliverables - What's included, output formats, dashboards/reports 

Getting Started - Prerequisites, setup steps, access instructions 

Support - Documentation, training, help resources 

Shape 

SAMPLE DETAIL DATA: Application Rationalization Assessment 

const applicationRationalizationDetail = { 

  id: "application-rationalization", 

  title: "Application Rationalization Assessment", 

  category: "Application Rationalization", 

  scope: "Enterprise", 

  analysisType: "Strategic", 

  deliveryModel: "Assessment", 

   

  // About Tab 

  overview: "The Application Rationalization Assessment is a comprehensive analysis service that evaluates your entire application portfolio to identify opportunities for consolidation, retirement, and optimization. This strategic assessment helps reduce portfolio complexity, eliminate redundancy, and optimize total cost of ownership while maintaining or improving business capability coverage.", 

   

  objectives: [ 

    "Identify redundant, outdated, or overlapping applications", 

    "Quantify potential cost savings from rationalization", 

    "Create prioritized roadmap for application consolidation or retirement", 

    "Improve portfolio alignment with business strategy", 

    "Reduce technical debt and operational complexity" 

  ], 

   

  valueProposition: "Organizations typically achieve 15-25% reduction in application portfolio size and 20-30% reduction in portfolio TCO within 18-24 months following a comprehensive rationalization initiative. Beyond cost savings, rationalization reduces operational complexity, improves security posture, and frees up resources for innovation.", 

   

  whoShouldUse: [ 

    "Enterprise Architects planning portfolio optimization", 

    "CIOs seeking cost reduction opportunities", 

    "Transformation Office leaders driving simplification", 

    "IT Portfolio Managers responsible for portfolio health", 

    "Business leaders dealing with fragmented application landscape" 

  ], 

   

  // Methodology Tab 

  assessmentFramework: "The assessment uses a proven multi-dimensional framework evaluating applications across Business Value, Technical Health, Cost, and Strategic Fit dimensions. Each application receives a comprehensive score leading to one of five rationalization recommendations: Retain, Invest, Migrate, Consolidate, or Retire.", 

   

  analysisApproach: [ 

    { 

      phase: "Data Collection", 

      duration: "2-3 weeks", 

      activities: [ 

        "Extract application inventory from CMDB", 

        "Gather financial data (licenses, infrastructure, support costs)", 

        "Collect technical metadata (architecture, dependencies, age)", 

        "Survey application stakeholders and users", 

        "Analyze usage and performance metrics" 

      ] 

    }, 

    { 

      phase: "Assessment & Scoring", 

      duration: "2-3 weeks", 

      activities: [ 

        "Score each application across 4 dimensions", 

        "Calculate business value based on criticality and user satisfaction", 

        "Assess technical health (architecture, security, performance)", 

        "Evaluate total cost of ownership", 

        "Measure strategic alignment with enterprise direction" 

      ] 

    }, 

    { 

      phase: "Analysis & Recommendations", 

      duration: "2 weeks", 

      activities: [ 

        "Identify rationalization candidates by category", 

        "Map application dependencies and consolidation opportunities", 

        "Quantify potential cost savings and risk", 

        "Prioritize recommendations by impact and effort", 

        "Create detailed rationalization roadmap" 

      ] 

    }, 

    { 

      phase: "Stakeholder Review & Validation", 

      duration: "1-2 weeks", 

      activities: [ 

        "Present findings to business and IT leadership", 

        "Validate recommendations with application owners", 

        "Refine roadmap based on feedback", 

        "Finalize business case for rationalization", 

        "Obtain executive approval for initiatives" 

      ] 

    } 

  ], 

   

  scoringDimensions: [ 

    { 

      dimension: "Business Value", 

      weight: "30%", 

      criteria: [ 

        "Business criticality (1-5 scale)", 

        "User satisfaction (survey-based)", 

        "Unique capability contribution", 

        "Revenue/cost avoidance impact", 

        "Regulatory/compliance necessity" 

      ] 

    }, 

    { 

      dimension: "Technical Health", 

      weight: "25%", 

      criteria: [ 

        "Architecture quality and maintainability", 

        "Security posture and vulnerabilities", 

        "Performance and reliability metrics", 

        "Technology currency and supportability", 

        "Integration complexity" 

      ] 

    }, 

    { 

      dimension: "Total Cost", 

      weight: "25%", 

      criteria: [ 

        "Annual license and subscription costs", 

        "Infrastructure and hosting costs", 

        "Support and maintenance costs", 

        "Hidden costs (customization, integration)", 

        "Cost relative to peers/benchmarks" 

      ] 

    }, 

    { 

      dimension: "Strategic Fit", 

      weight: "20%", 

      criteria: [ 

        "Alignment with technology strategy", 

        "Cloud readiness and modernization potential", 

        "Vendor viability and roadmap", 

        "Fit with target architecture", 

        "Innovation enablement" 

      ] 

    } 

  ], 

   

  rationalizationCategories: [ 

    { 

      category: "Retain", 

      criteria: "High business value, good technical health, strategic fit", 

      action: "Maintain current state with minimal changes", 

      exampleCount: "Typically 30-40% of portfolio" 

    }, 

    { 

      category: "Invest", 

      criteria: "High business value but technical debt or gaps", 

      action: "Modernize, enhance, or migrate to improve health", 

      exampleCount: "Typically 15-20% of portfolio" 

    }, 

    { 

      category: "Migrate", 

      criteria: "Good business value but poor technical fit", 

      action: "Replace with better-fit solution (cloud, SaaS, etc.)", 

      exampleCount: "Typically 10-15% of portfolio" 

    }, 

    { 

      category: "Consolidate", 

      criteria: "Overlapping functionality with other applications", 

      action: "Merge into single application or platform", 

      exampleCount: "Typically 15-25% of portfolio" 

    }, 

    { 

      category: "Retire", 

      criteria: "Low business value, high cost, or obsolete", 

      action: "Decommission with data archival as needed", 

      exampleCount: "Typically 10-20% of portfolio" 

    } 

  ], 

   

  dataSources: [ 

    "CMDB (Configuration Management Database)", 

    "Financial systems (license, cost data)", 

    "APM tools (performance metrics)", 

    "Security scanning tools (vulnerability data)", 

    "Survey tools (stakeholder input)", 

    "Architecture repository (technical metadata)" 

  ], 

   

  // Deliverables Tab 

  assessmentDeliverables: [ 

    { 

      deliverable: "Executive Summary Report", 

      format: "PDF/PPTX", 

      pages: "15-20 pages", 

      description: "High-level findings, recommendations, and business case for rationalization", 

      audience: "Executive leadership" 

    }, 

    { 

      deliverable: "Detailed Application Scorecard", 

      format: "Excel", 

      description: "Complete scoring for every application across all dimensions with raw data", 

      audience: "Portfolio managers, architects" 

    }, 

    { 

      deliverable: "Rationalization Roadmap", 

      format: "PPTX/Visio", 

      description: "Phased implementation plan with timelines, dependencies, and resource needs", 

      audience: "Transformation office, PMO" 

    }, 

    { 

      deliverable: "Portfolio Visualization Dashboard", 

      format: "Power BI/Tableau", 

      description: "Interactive dashboard showing portfolio health, rationalization opportunities, and KPIs", 

      audience: "All stakeholders" 

    }, 

    { 

      deliverable: "Business Case & Financial Model", 

      format: "Excel", 

      description: "Detailed cost-benefit analysis with ROI projections and sensitivity analysis", 

      audience: "Finance, executive leadership" 

    }, 

    { 

      deliverable: "Application Dependency Map", 

      format: "Visio/Lucidchart", 

      description: "Visual representation of application dependencies and integration points", 

      audience: "Architects, project managers" 

    } 

  ], 

   

  keyOutputMetrics: [ 

    "Total portfolio applications assessed", 

    "Rationalization candidates identified (by category)", 

    "Estimated annual cost savings potential", 

    "Estimated one-time rationalization cost", 

    "ROI and payback period", 

    "Risk-adjusted implementation timeline" 

  ], 

   

  // Getting Started Tab 

  prerequisites: [ 

    "Access to application inventory (CMDB or equivalent)", 

    "Financial data for application costs (licenses, infrastructure, support)", 

    "Stakeholder availability for surveys and interviews", 

    "Technical metadata (architecture diagrams, technology stack)", 

    "Executive sponsorship and commitment to act on findings" 

  ], 

   

  setupSteps: [ 

    { 

      step: 1, 

      title: "Initial Planning Meeting", 

      duration: "1-2 hours", 

      description: "Align on scope, objectives, timeline, and key stakeholders. Define success criteria and communication plan." 

    }, 

    { 

      step: 2, 

      title: "Data Preparation", 

      duration: "1 week", 

      description: "Extract and validate application inventory, cost data, and technical metadata. Identify data gaps and plan data collection." 

    }, 

    { 

      step: 3, 

      title: "Stakeholder Survey Launch", 

      duration: "2 weeks", 

      description: "Distribute surveys to application owners and key users. Conduct targeted interviews for critical applications." 

    }, 

    { 

      step: 4, 

      title: "Assessment Execution", 

      duration: "3-4 weeks", 

      description: "Analyst team performs detailed assessment, scoring, and analysis. Regular check-ins to address questions." 

    }, 

    { 

      step: 5, 

      title: "Findings Review", 

      duration: "1-2 weeks", 

      description: "Review draft findings with portfolio team. Validate recommendations and refine based on feedback." 

    }, 

    { 

      step: 6, 

      title: "Final Presentation & Next Steps", 

      duration: "1 day", 

      description: "Present final assessment to leadership. Agree on rationalization roadmap and initiate prioritized projects." 

    } 

  ], 

   

  estimatedTimeline: "Total duration: 8-12 weeks from kickoff to final presentation", 

   

  resourceRequirements: [ 

    "Portfolio Manager: 20-30 hours (stakeholder coordination)", 

    "Enterprise Architect: 15-20 hours (technical validation)", 

    "Financial Analyst: 10-15 hours (cost data preparation)", 

    "Application Owners: 2-4 hours each (surveys, interviews)", 

    "Assessment Team: Full engagement (external consultants typically)" 

  ], 

   

  // Support Tab 

  documentation: [ 

    { 

      title: "Assessment Methodology Guide", 

      type: "PDF", 

      description: "Detailed explanation of scoring framework, criteria, and analysis approach" 

    }, 

    { 

      title: "Stakeholder Survey Template", 

      type: "Survey Tool", 

      description: "Customizable survey for gathering stakeholder input on application value" 

    }, 

    { 

      title: "Data Collection Checklist", 

      type: "Excel", 

      description: "Complete list of required data elements with collection instructions" 

    }, 

    { 

      title: "Rationalization Playbook", 

      type: "PDF", 

      description: "Best practices for executing rationalization initiatives post-assessment" 

    } 

  ], 

   

  trainingAvailable: [ 

    "Assessment Methodology Workshop (4 hours)", 

    "Dashboard & Reporting Training (2 hours)", 

    "Rationalization Roadmap Planning (4 hours)" 

  ], 

   

  supportChannels: [ 

    "Dedicated assessment team email", 

    "Bi-weekly checkpoint meetings", 

    "Ad-hoc consultation as needed", 

    "Post-assessment support (30 days)" 

  ], 

   

  successStories: [ 

    { 

      organization: "GlobalBank Corporation", 

      portfolio: "450 applications", 

      outcome: "Identified 85 applications for retirement, projected $8M annual savings" 

    }, 

    { 

      organization: "RetailCo", 

      portfolio: "280 applications", 

      outcome: "Consolidated 40 applications into 12 platforms, 22% TCO reduction" 

    } 

  ] 

} 

Shape 

SAMPLE DETAIL DATA: Portfolio Dashboard 

const portfolioDashboardDetail = { 

  id: "portfolio-dashboard", 

  title: "Executive Portfolio Dashboard", 

  category: "Portfolio Dashboard", 

  portfolioType: "All Projects", 

  deliveryModel: "Dashboard", 

  updateFrequency: "Real-time", 

   

  // About Tab 

  overview: "The Executive Portfolio Dashboard provides a comprehensive, real-time view of all transformation and IT projects across the enterprise. Designed for executive and portfolio leadership, this dashboard surfaces critical health indicators, risks, resource utilization, and financial performance in an intuitive, actionable format.", 

   

  objectives: [ 

    "Provide single-pane-of-glass visibility into entire project portfolio", 

    "Enable data-driven decision making on project prioritization and resource allocation", 

    "Identify at-risk projects early with predictive analytics", 

    "Track portfolio-level KPIs and trends over time", 

    "Facilitate executive communication with digestible metrics and visualizations" 

  ], 

   

  keyFeatures: [ 

    "Real-time project health indicators (RAG status)", 

    "Budget vs. actual tracking across all projects", 

    "Resource capacity and utilization heatmaps", 

    "Risk exposure summary with top portfolio risks", 

    "Milestone achievement tracking", 

    "Drill-down capability to individual project details", 

    "Trend analysis and forecasting", 

    "Customizable views by portfolio, program, or domain" 

  ], 

   

  targetAudience: [ 

    "CIO and IT leadership", 

    "Chief Transformation Officer", 

    "PMO Directors and Portfolio Managers", 

    "Executive Steering Committee members", 

    "Business Unit leaders sponsoring initiatives" 

  ], 

   

  // Methodology Tab 

  dataIntegration: "The dashboard integrates data from multiple sources including project management tools (Jira, MS Project), financial systems, resource management platforms, and risk registers. Data is refreshed in real-time or near-real-time (depending on source system capabilities) to ensure current, accurate information.", 

   

  healthScoringModel: { 

    description: "Project health is calculated using a weighted scoring model across five dimensions", 

    dimensions: [ 

      { 

        name: "Schedule Performance", 

        weight: "25%", 

        metrics: ["Schedule variance", "Milestone completion rate", "Critical path status"] 

      }, 

      { 

        name: "Budget Performance", 

        weight: "25%", 

        metrics: ["Cost variance", "Burn rate", "Forecast at completion (EAC)"] 

      }, 

      { 

        name: "Scope Management", 

        weight: "15%", 

        metrics: ["Scope changes", "Requirements stability", "Deliverable completion"] 

      }, 

      { 

        name: "Risk & Issues", 

        weight: "20%", 

        metrics: ["Open critical risks", "Issue aging", "Risk exposure value"] 

      }, 

      { 

        name: "Quality & Stakeholder Satisfaction", 

        weight: "15%", 

        metrics: ["Defect density", "Stakeholder NPS", "Quality gate pass rate"] 

      } 

    ], 

    scoring: [ 

      "Green: Health score 80-100 (on track)", 

      "Yellow: Health score 60-79 (at risk, attention needed)", 

      "Red: Health score 0-59 (critical issues, intervention required)" 

    ] 

  }, 

   

  // Deliverables Tab 

  dashboardViews: [ 

    { 

      view: "Portfolio Overview", 

      description: "High-level summary of portfolio health, active projects, budget, and resources", 

      widgets: [ 

        "Portfolio health gauge (% green/yellow/red)", 

        "Active projects count by phase", 

        "Total portfolio budget and actuals", 

        "Resource utilization %", 

        "Top 5 at-risk projects", 

        "Upcoming major milestones" 

      ] 

    }, 

    { 

      view: "Financial Performance", 

      description: "Budget tracking, cost variance, and financial forecasting", 

      widgets: [ 

        "Budget vs. actual by project/program", 

        "Burn rate trends", 

        "Forecast at completion (EAC) variance", 

        "Cost breakdown by category", 

        "Month-over-month spend analysis" 

      ] 

    }, 

    { 

      view: "Resource Management", 

      description: "Resource capacity, allocation, and utilization across portfolio", 

      widgets: [ 

        "Resource capacity heatmap", 

        "Allocation by project/skill", 

        "Over/under-allocation alerts", 

        "Demand forecast vs. supply", 

        "Contractor vs. FTE ratio" 

      ] 

    }, 

    { 

      view: "Risk & Issue Tracking", 

      description: "Portfolio-wide risk exposure and critical issue monitoring", 

      widgets: [ 

        "Top 10 portfolio risks by exposure", 

        "Risk heatmap (likelihood x impact)", 

        "Issue aging analysis", 

        "Mitigation status tracking", 

        "Risk trend over time" 

      ] 

    }, 

    { 

      view: "Delivery Analytics", 

      description: "Project delivery metrics, velocity, and predictive analytics", 

      widgets: [ 

        "On-time delivery rate", 

        "Average project duration", 

        "Milestone completion trends", 

        "Predictive delay alerts", 

        "Benefits realization tracking" 

      ] 

    } 

  ], 

   

  exportCapabilities: [ 

    "PDF reports (snapshot of any view)", 

    "PowerPoint export for executive presentations", 

    "Excel export of underlying data", 

    "Scheduled email delivery (daily/weekly)", 

    "API access for custom integrations" 

  ], 

   

  // Getting Started Tab 

  accessRequirements: [ 

    "Portfolio Manager or Executive role assignment", 

    "SSO authentication configured", 

    "Browser: Chrome, Firefox, or Edge (latest versions)", 

    "Minimum screen resolution: 1366x768 (1920x1080 recommended)" 

  ], 

   

  setupSteps: [ 

    { 

      step: 1, 

      title: "Request Access", 

      description: "Submit access request through IT service desk or portfolio office. Approval typically within 1 business day." 

    }, 

    { 

      step: 2, 

      title: "Initial Login & Orientation", 

      description: "Complete 15-minute dashboard orientation video. Review user guide for navigation and features." 

    }, 

    { 

      step: 3, 

      title: "Customize Views", 

      description: "Configure default views, filters, and alert preferences based on your portfolio scope." 

    }, 

    { 

      step: 4, 

      title: "Set Up Notifications", 

      description: "Configure email/mobile notifications for critical health changes and milestone alerts." 

    }, 

    { 

      step: 5, 

      title: "Schedule Reports", 

      description: "Set up automated weekly/monthly report delivery to your inbox and key stakeholders." 

    } 

  ], 

   

  quickStartGuide: [ 

    "Dashboard loads to Portfolio Overview by default", 

    "Use top navigation to switch between views", 

    "Click any metric or chart to drill down to details", 

    "Use filters to focus on specific portfolios, programs, or time periods", 

    "Hover over visualizations for contextual information", 

    "Click project name to navigate to detailed project page", 

    "Use export button (top right) to generate reports" 

  ], 

   

  // Support Tab 

  userGuide: { 

    title: "Executive Portfolio Dashboard User Guide", 

    format: "Interactive PDF", 

    pages: "25 pages", 

    sections: [ 

      "Dashboard Navigation", 

      "Understanding Health Metrics", 

      "Customizing Views", 

      "Interpreting Visualizations", 

      "Exporting and Sharing", 

      "Mobile Access", 

      "Troubleshooting" 

    ] 

  }, 

   

  trainingResources: [ 

    "Dashboard Overview Video (15 min)", 

    "Advanced Features Tutorial (30 min)", 

    "Monthly Power User Office Hours (1 hour)", 

    "Quarterly Executive Briefing on New Features" 

  ], 

   

  helpDesk: { 

    email: "portfolio-dashboard-support@company.com", 

    phone: "ext. 5555", 

    hours: "8am-6pm ET, Mon-Fri", 

    sla: "Response within 4 business hours" 

  }, 

   

  faq: [ 

    { 

      question: "How often is data refreshed?", 

      answer: "Most data refreshes every 15 minutes. Financial data refreshes nightly. Manual refresh button available for real-time updates." 

    }, 

    { 

      question: "Can I export data to Excel?", 

      answer: "Yes, any view can be exported to Excel. Click the export icon and select 'Excel' format." 

    }, 

    { 

      question: "What if I see a discrepancy in the data?", 

      answer: "Contact the portfolio office immediately. Data quality issues are prioritized for resolution within 24 hours." 

    }, 

    { 

      question: "Can I customize the dashboard for my specific needs?", 

      answer: "Standard views are fixed, but you can create custom filters and saved views. Contact portfolio office for advanced customization requests." 

    } 

  ] 

} 

Shape 

UNIQUE PORTFOLIO MANAGEMENT FEATURES 

Portfolio Health Scorecard Display 

Show portfolio metrics in detail page Deliverables tab: 

<div className="health-scorecard"> 

  <h3 className="scorecard-title">Portfolio Health Scorecard</h3> 

   

  <div className="scorecard-grid"> 

    <div className="scorecard-metric"> 

      <div className="metric-header"> 

        <Icon name="Activity" size={24} className="text-green-600" /> 

        <span className="metric-label">Overall Health</span> 

      </div> 

      <div className="metric-value green">85%</div> 

      <div className="metric-breakdown"> 

        <span className="breakdown-item green">● 65% Green</span> 

        <span className="breakdown-item yellow">● 25% Yellow</span> 

        <span className="breakdown-item red">● 10% Red</span> 

      </div> 

    </div> 

     

    <div className="scorecard-metric"> 

      <div className="metric-header"> 

        <Icon name="DollarSign" size={24} className="text-blue-600" /> 

        <span className="metric-label">Budget Performance</span> 

      </div> 

      <div className="metric-value blue">+2.5%</div> 

      <div className="metric-detail">Under budget</div> 

    </div> 

     

    <div className="scorecard-metric"> 

      <div className="metric-header"> 

        <Icon name="Clock" size={24} className="text-orange-600" /> 

        <span className="metric-label">On-time Delivery</span> 

      </div> 

      <div className="metric-value orange">78%</div> 

      <div className="metric-detail">12 of 15 on track</div> 

    </div> 

     

    <div className="scorecard-metric"> 

      <div className="metric-header"> 

        <Icon name="Users" size={24} className="text-purple-600" /> 

        <span className="metric-label">Resource Utilization</span> 

      </div> 

      <div className="metric-value purple">82%</div> 

      <div className="metric-detail">Optimal range</div> 

    </div> 

  </div> 

</div> 

Health Scorecard Styling: 

Container: bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-8 

Scorecard title: text-2xl font-bold text-gray-900 mb-6 

Scorecard grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 

Scorecard metric: bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow 

Metric header: flex items-center gap-3 mb-4 

Metric label: text-sm font-semibold text-gray-700 uppercase 

Metric value: text-4xl font-bold mb-2  

Green: text-green-600 

Blue: text-blue-600 

Orange: text-orange-600 

Purple: text-purple-600 

Metric breakdown: flex flex-col gap-1 text-sm 

Breakdown item: flex items-center gap-1  

Green: text-green-600 

Yellow: text-yellow-600 

Red: text-red-600 

Metric detail: text-sm text-gray-600 

Shape 

Methodology Framework Visualization 

Display scoring dimensions in Methodology tab: 

<div className="methodology-framework"> 

  <h3 className="framework-title">Multi-Dimensional Scoring Framework</h3> 

  <p className="framework-description"> 

    Each application/project is evaluated across multiple dimensions with weighted scoring 

  </p> 

   

  <div className="dimensions-grid"> 

    {scoringDimensions.map((dimension, index) => ( 

      <div className="dimension-card"> 

        <div className="dimension-header"> 

          <div className="dimension-number">{index + 1}</div> 

          <div> 

            <h4 className="dimension-name">{dimension.dimension}</h4> 

            <span className="dimension-weight">Weight: {dimension.weight}</span> 

          </div> 

        </div> 

         

        <ul className="criteria-list"> 

          {dimension.criteria.map(criterion => ( 

            <li className="criterion-item"> 

              <Icon name="Check" size={14} className="text-green-600" /> 

              <span>{criterion}</span> 

            </li> 

          ))} 

        </ul> 

      </div> 

    ))} 

  </div> 

</div> 

Methodology Framework Styling: 

Framework title: text-2xl font-bold text-gray-900 mb-2 

Framework description: text-gray-600 mb-8 

Dimensions grid: grid grid-cols-1 md:grid-cols-2 gap-6 

Dimension card: bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-400 transition-colors 

Dimension header: flex items-start gap-4 mb-4 

Dimension number: w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold text-lg flex items-center justify-center flex-shrink-0 

Dimension name: text-lg font-semibold text-gray-900 

Dimension weight: text-sm text-orange-600 font-medium 

Criteria list: space-y-2 

Criterion item: flex items-start gap-2 text-sm text-gray-700 

Shape 

RESPONSIVE & ACCESSIBILITY 

Same requirements as previous marketplaces: 

Mobile-first responsive design 

Filter panel: drawer on mobile, sidebar on desktop 

Tab navigation: horizontal scroll on mobile (2 tabs) 

Card grids: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) 

All WCAG AA accessibility standards 

Mobile-Specific Adjustments: 

Health scorecard: single column on mobile 

Methodology framework: single column on mobile 

Metric values: slightly smaller font size on mobile 

Dashboard preview images: full-width on mobile 

Shape 

DEVELOPMENT NOTES 

Reuse from Previous Prompts: 

DetailPage component structure 

LoginModal component 

TransactAppPlaceholder component 

Filter panel component logic 

Search bar component 

Tab navigation pattern 

New for Portfolio Management: 

Portfolio service card with metrics emphasis 

Health scorecard component 

Methodology framework visualization 

Real-time badge indicator 

Scope indicator display 

File Organization: 

src/ 

├── components/ 

│   ├── cards/ 

│   │   └── PortfolioServiceCard.tsx (new) 

│   ├── portfolio/ 

│   │   ├── HealthScorecard.tsx (new) 

│   │   └── MethodologyFramework.tsx (new) 

│   └── ... (reuse from previous prompts) 

├── pages/ 

│   ├── PortfolioManagementPage.tsx (new) 

│   └── ... (reuse DetailPage, etc.) 

├── data/ 

│   ├── applicationPortfolio.ts (new) 

│   ├── projectPortfolio.ts (new) 

│   └── detailsPortfolio.ts (new) 

└── ... (reuse from previous prompts) 

Shape 

TESTING CHECKLIST 

✅ Navigation from Marketplaces page to Portfolio Management ✅ Drive phase badge displays correctly ✅ Breadcrumbs display correctly ✅ Both tabs switch correctly ✅ Filters change appropriately per tab ✅ All 18 application portfolio cards display ✅ All 14 project portfolio cards display ✅ Total: 32 portfolio services across 2 tabs ✅ Real-time badges show on appropriate cards ✅ Key metrics display properly on cards ✅ Card click navigates to detail page ✅ Detail pages load with portfolio-specific content ✅ Methodology tab shows framework/dimensions ✅ Deliverables tab shows scorecard or dashboard info ✅ Getting Started tab shows access/setup steps ✅ "Access Service" buttons trigger login modal ✅ Login redirects to Stage 2 placeholder with context ✅ Stage 2 shows correct Portfolio Management context ✅ Mobile responsive at all breakpoints ✅ Health scorecard displays correctly on mobile ✅ No console errors 

Shape 

BUILD SEQUENCE 

Create Portfolio Management marketplace page 

Build 2 tab navigation 

Build tab-specific filter panels 

Build portfolio service card component 

Populate Application Portfolio tab (18 cards) 

Populate Project Portfolio tab (14 cards) 

Build health scorecard component 

Build methodology framework component 

Create detail data for sample services 

Test detail page rendering with portfolio content 

Test login flow with "Access Service" action 

Verify Stage 2 placeholder context 

Test full responsive behavior 

Test scorecard and framework components on mobile 

Success Criteria: 

Complete Portfolio Management marketplace with 32 services 

Both tabs functional with appropriate filters 

Drive phase branding clear throughout 

Detail pages show governance/oversight content 

Health metrics and scorecards display correctly 

Methodology frameworks clearly explained 

"Access Service" action triggers login correctly 

Pattern remains consistent with previous marketplaces 

Mobile experience excellent for data-heavy content 

Shape 

Build the Portfolio Management marketplace emphasizing strategic oversight, governance, real-time analytics, and data-driven decision making for application and project portfolios in the Drive phase. 

 