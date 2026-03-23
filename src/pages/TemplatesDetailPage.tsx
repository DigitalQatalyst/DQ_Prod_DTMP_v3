import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  ClipboardCheck,
  CheckCircle,
  Download,
  Layers,
  LayoutGrid,
  Sparkles,
  Upload,
  X,
  icons,
  LucideIcon,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginModal } from "@/components/learningCenter/LoginModal";
import { isUserAuthenticated } from "@/data/sessionAuth";
import {
  createDocumentStudioRequest,
  documentStudioTabMeta,
  getDocumentStudioCard,
  type DbpStream,
  type DivisionName,
  type DocumentStudioTab,
} from "@/data/documentStudio";

const divisions: DivisionName[] = [
  "Generation",
  "Transmission",
  "Distribution",
  "Water Services",
  "Customer Services",
  "Digital DEWA & Moro Hub",
];

const dbpStreams: DbpStream[] = ["DXP", "DWS", "DIA", "SDO"];

const validTabs: DocumentStudioTab[] = [
  "assessments",
  "application-profiles",
  "design-reports",
];

const tabIcons: Record<DocumentStudioTab, LucideIcon> = {
  assessments: ClipboardCheck,
  "application-profiles": LayoutGrid,
  "design-reports": Layers,
};

export default function DocumentStudioDetailPage() {
  const navigate = useNavigate();
  const { tab, cardId } = useParams<{ tab: string; cardId: string }>();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "process" | "outputs">("about");
  const [formState, setFormState] = useState({
    organisationBusinessUnit: "",
    assessmentScope: "Organisation-wide",
    focusArea: "",
    frameworkPreference: "Custom",
    targetAudience: "Executive",
    desiredOutputFormats: ["PDF"] as string[],
    additionalNotes: "",
    applicationName: "",
    applicationType: "CRM",
    dbpDomain: "Customer Experience",
    deploymentModel: "Cloud",
    primaryUsers: "",
    includeIntegrationMap: true,
    includeTcd: true,
    divisionBusinessUnit: "Transmission" as DivisionName,
    dbpStreams: ["DWS"] as DbpStream[],
    programmeInitiativeName: "",
    organisationContext: "",
    strategicObjectives: "",
    currentTechnologyLandscape: "",
    keyRequirements: "",
    architectureConstraints: "",
    referenceDocuments: "",
    preferredOutputFormat: "PDF",
  });

  const normalizedTab = validTabs.includes(tab as DocumentStudioTab)
    ? (tab as DocumentStudioTab)
    : null;
  const card = useMemo(
    () => (normalizedTab && cardId ? getDocumentStudioCard(normalizedTab, cardId) : undefined),
    [normalizedTab, cardId]
  );

  if (!card || !normalizedTab) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Document Not Found</h1>
          <Button onClick={() => navigate("/marketplaces/document-studio")}>
            Back to Document Studio
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const HeroIcon =
    (icons[card.icon as keyof typeof icons] as LucideIcon) ?? tabIcons[normalizedTab];

  const handleRequest = () => {
    setShowRequestModal(true);
  };

  const toggleFormat = (format: string) => {
    setFormState((prev) => ({
      ...prev,
      desiredOutputFormats: prev.desiredOutputFormats.includes(format)
        ? prev.desiredOutputFormats.filter((entry) => entry !== format)
        : [...prev.desiredOutputFormats, format],
    }));
  };

  const toggleStream = (stream: DbpStream) => {
    setFormState((prev) => ({
      ...prev,
      dbpStreams: prev.dbpStreams.includes(stream)
        ? prev.dbpStreams.filter((entry) => entry !== stream)
        : [...prev.dbpStreams, stream],
    }));
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const request = createDocumentStudioRequest({
      tab: normalizedTab,
      cardId: card.id,
      documentTypeName: card.title,
      title:
        normalizedTab === "design-reports"
          ? `${card.title} - DEWA ${formState.divisionBusinessUnit} - ${formState.dbpStreams[0] ?? "DWS"}`
          : normalizedTab === "application-profiles"
            ? `${card.title} - ${formState.applicationName || "New Request"}`
            : `${card.title} - ${formState.organisationBusinessUnit || "New Request"}`,
      formData: {
        selectedDocumentType: card.title,
        organisationBusinessUnit: formState.organisationBusinessUnit,
        assessmentScope: formState.assessmentScope as
          | "Organisation-wide"
          | "Domain-specific"
          | "Project-level"
          | "Application-level",
        focusArea: formState.focusArea,
        frameworkPreference: formState.frameworkPreference,
        targetAudience: formState.targetAudience,
        desiredOutputFormats: formState.desiredOutputFormats,
        additionalNotes: formState.additionalNotes,
        applicationName: formState.applicationName,
        applicationType: formState.applicationType,
        dbpDomain: formState.dbpDomain,
        deploymentModel: formState.deploymentModel,
        primaryUsers: formState.primaryUsers,
        includeIntegrationMap: formState.includeIntegrationMap,
        includeTcd: formState.includeTcd,
        divisionBusinessUnit: formState.divisionBusinessUnit,
        dbpStreams: formState.dbpStreams,
        programmeInitiativeName: formState.programmeInitiativeName,
        organisationContext: formState.organisationContext,
        strategicObjectives: formState.strategicObjectives,
        currentTechnologyLandscape: formState.currentTechnologyLandscape,
        keyRequirements: formState.keyRequirements,
        architectureConstraints: formState.architectureConstraints,
        referenceDocuments: formState.referenceDocuments
          ? formState.referenceDocuments.split(",").map((entry) => entry.trim()).filter(Boolean)
          : [],
        preferredOutputFormat: formState.preferredOutputFormat as "PDF" | "DOCX" | "Both",
      },
    });

    if (isUserAuthenticated()) {
      navigate("/stage2/document-studio/my-requests", {
        state: { createdRequestId: request.id },
      });
      return;
    }

    setPendingRequestId(request.id);
    setShowRequestModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">
              Marketplaces
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              to="/marketplaces/document-studio"
              className="hover:text-foreground transition-colors"
            >
              Document Studio
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">
              {documentStudioTabMeta[normalizedTab].label}
            </span>
          </nav>
        </div>
      </div>

      <section className="bg-gradient-to-b from-blue-50 to-white py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary-navy mb-4">
              {card.title}
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-4xl mb-5">
              {card.detailSummary}
            </p>

            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {card.categoryBadge}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {documentStudioTabMeta[normalizedTab].label}
                </span>
                <span className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-xs font-semibold text-purple-700">
                  <Sparkles size={12} />
                  {card.aiBadge}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <span>{card.pageRange}</span>
              <span>{card.outputFormats.join(", ")}</span>
              <span>{card.usageCount} uses</span>
            </div>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "about" | "process" | "outputs")} className="w-full">
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-7xl mx-auto">
            <TabsList className="h-auto bg-transparent p-0 gap-1 overflow-x-auto flex justify-start px-4 lg:px-8">
              <TabsTrigger
                value="about"
                className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="process"
                className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                Process
              </TabsTrigger>
              <TabsTrigger
                value="outputs"
                className="px-6 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors relative rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:text-primary-navy data-[state=active]:shadow-none bg-transparent"
              >
                Outputs
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <TabsContent value="about" className="mt-0 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Document Overview</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </section>

                {card.detailSections.map((section) => (
                  <section key={section.title}>
                    <h3 className="text-xl font-semibold text-foreground mb-4">{section.title}</h3>
                    <div className="border border-gray-200 rounded-xl p-6 bg-white">
                      <p className="text-muted-foreground leading-relaxed">{section.body}</p>
                    </div>
                  </section>
                ))}
              </TabsContent>

              <TabsContent value="process" className="mt-0 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Request and Delivery Process</h2>
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <ol className="space-y-3 text-sm text-muted-foreground">
                      <li>1. Submit contextual request inputs.</li>
                      <li>2. Track progress in your User Dashboard.</li>
                      <li>3. Receive generated document from the Transformation Office.</li>
                      {normalizedTab === "design-reports" && (
                        <>
                          <li>4. Review and approve the delivered design artefact.</li>
                          <li>5. TO may publish the approved document to Knowledge Centre.</li>
                        </>
                      )}
                    </ol>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-4">What Happens Next</h3>
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <p className="text-muted-foreground leading-relaxed">
                      Once your request is submitted, the Transformation Office uses the
                      provided context to generate a tailored document. You then review the
                      delivered output in your User Dashboard, and for Design Reports the workflow can
                      continue into approval and Knowledge Centre publication.
                    </p>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="outputs" className="mt-0 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Output Details</h2>
                  <div className="border border-gray-200 rounded-xl p-6 bg-white">
                    <div className="space-y-3 text-sm">
                      <p>
                        <span className="text-muted-foreground">Type:</span>{" "}
                        <span className="font-medium text-foreground">{card.title}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Formats:</span>{" "}
                        <span className="font-medium text-foreground">
                          {card.outputFormats.join(", ")}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Length:</span>{" "}
                        <span className="font-medium text-foreground">{card.pageRange}</span>
                      </p>
                      {card.specialFeature && (
                        <p>
                          <span className="text-muted-foreground">Special Feature:</span>{" "}
                          <span className="font-medium text-foreground">{card.specialFeature}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Document Delivery</h3>
                  <div className="border border-blue-100 rounded-xl p-6 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Output Ready</p>
                        <p className="text-sm text-blue-800">
                          Generated outputs are delivered back to the requester in your User Dashboard
                          with preview and download actions.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>
            </div>

            <aside className="lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                  <HeroIcon className="text-blue-600" size={40} />
                </div>

                <h3 className="text-lg font-bold text-foreground mb-6">Document Details</h3>

                <table className="w-full mb-6">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Type</td>
                      <td className="text-sm font-medium text-foreground py-3">{card.title}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Formats</td>
                      <td className="text-sm font-medium text-foreground py-3">
                        {card.outputFormats.join(", ")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="text-sm text-muted-foreground py-3 pr-4">Length</td>
                      <td className="text-sm font-medium text-foreground py-3">{card.pageRange}</td>
                    </tr>
                    <tr>
                      <td className="text-sm text-muted-foreground py-3 pr-4">Category</td>
                      <td className="text-sm font-medium text-foreground py-3">
                        {card.categoryBadge}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="text-base font-semibold text-foreground mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Tailored content using submitted context
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Transformation Office review and delivery
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      User Dashboard preview and download access
                    </li>
                    {card.specialFeature && (
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        {card.specialFeature}
                      </li>
                    )}
                  </ul>
                </div>

                <Button
                  onClick={handleRequest}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 text-lg font-semibold"
                >
                  Request Document
                </Button>
              </div>
            </aside>
          </div>
        </main>
      </Tabs>

      {showRequestModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowRequestModal(false); }}
        >
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-start justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-primary-navy">Request Document</h2>
                <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form id="request-form" onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-900">Selected Document Type</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                    {card.title}
                  </div>
                </div>

                {normalizedTab === "assessments" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField label="Organisation / Business Unit">
                        <Input value={formState.organisationBusinessUnit} onChange={(e) => setFormState((p) => ({ ...p, organisationBusinessUnit: e.target.value }))} required />
                      </FormField>
                      <FormField label="Assessment Scope">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.assessmentScope} onChange={(e) => setFormState((p) => ({ ...p, assessmentScope: e.target.value }))}>
                          {["Organisation-wide", "Domain-specific", "Project-level", "Application-level"].map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField label="Specific Focus Area">
                        <Input value={formState.focusArea} onChange={(e) => setFormState((p) => ({ ...p, focusArea: e.target.value }))} required />
                      </FormField>
                      <FormField label="Framework Preference">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.frameworkPreference} onChange={(e) => setFormState((p) => ({ ...p, frameworkPreference: e.target.value }))}>
                          {["COBIT", "ISO 27001", "NIST", "No Preference", "Other"].map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField label="Target Audience">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.targetAudience} onChange={(e) => setFormState((p) => ({ ...p, targetAudience: e.target.value }))}>
                          {["Executive", "Senior Management", "Technical Team", "Compliance", "Cross-functional"].map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                      <FormField label="Desired Output Format">
                        <div className="flex gap-3 pt-2">
                          {["PDF", "DOCX", "PPTX"].map((f) => (
                            <label key={f} className="inline-flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={formState.desiredOutputFormats.includes(f)} onChange={() => toggleFormat(f)} />
                              {f}
                            </label>
                          ))}
                        </div>
                      </FormField>
                    </div>
                    <FormField label="Attach Relevant Documents">
                      <div className="rounded-lg border border-dashed border-gray-300 p-4 bg-gray-50 text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Upload className="w-4 h-4" />
                          Prototype input
                        </div>
                        <Input value={formState.referenceDocuments} onChange={(e) => setFormState((p) => ({ ...p, referenceDocuments: e.target.value }))} placeholder="Enter file names separated by commas" />
                      </div>
                    </FormField>
                    <FormField label="Additional Context / Notes">
                      <Textarea value={formState.additionalNotes} onChange={(e) => setFormState((p) => ({ ...p, additionalNotes: e.target.value }))} rows={4} />
                    </FormField>
                  </>
                )}

                {normalizedTab === "application-profiles" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField label="Application Name">
                        <Input value={formState.applicationName} onChange={(e) => setFormState((p) => ({ ...p, applicationName: e.target.value }))} required />
                      </FormField>
                      <FormField label="Application Type">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.applicationType} onChange={(e) => setFormState((p) => ({ ...p, applicationType: e.target.value }))}>
                          {["CRM", "ERP", "Analytics", "HR System", "Financial", "Security", "Integration", "Other"].map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField label="DBP Domain">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.dbpDomain} onChange={(e) => setFormState((p) => ({ ...p, dbpDomain: e.target.value }))}>
                          {["Customer Experience", "Operations", "Data & Analytics", "Digital Workplace", "Other"].map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                      <FormField label="Deployment Model">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.deploymentModel} onChange={(e) => setFormState((p) => ({ ...p, deploymentModel: e.target.value }))}>
                          {["Cloud", "On-Premise", "Hybrid", "SaaS"].map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                    </div>
                    <FormField label="Primary Users / Audience">
                      <Input value={formState.primaryUsers} onChange={(e) => setFormState((p) => ({ ...p, primaryUsers: e.target.value }))} required />
                    </FormField>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ToggleFormField label="Include Integration Map" checked={formState.includeIntegrationMap} onChange={(v) => setFormState((p) => ({ ...p, includeIntegrationMap: v }))} />
                      <ToggleFormField label="Include TCD (Total Cost of Deployment)" checked={formState.includeTcd} onChange={(v) => setFormState((p) => ({ ...p, includeTcd: v }))} />
                    </div>
                    <FormField label="Desired Output Format">
                      <div className="flex gap-3 pt-2">
                        {["PDF", "DOCX"].map((f) => (
                          <label key={f} className="inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={formState.desiredOutputFormats.includes(f)} onChange={() => toggleFormat(f)} />
                            {f}
                          </label>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Attach Relevant Documents">
                      <div className="rounded-lg border border-dashed border-gray-300 p-4 bg-gray-50 text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Upload className="w-4 h-4" />
                          Prototype input
                        </div>
                        <Input value={formState.referenceDocuments} onChange={(e) => setFormState((p) => ({ ...p, referenceDocuments: e.target.value }))} placeholder="Enter file names separated by commas" />
                      </div>
                    </FormField>
                    <FormField label="Additional Context / Notes">
                      <Textarea value={formState.additionalNotes} onChange={(e) => setFormState((p) => ({ ...p, additionalNotes: e.target.value }))} rows={4} />
                    </FormField>
                  </>
                )}

                {normalizedTab === "design-reports" && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField label="Division / Business Unit">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.divisionBusinessUnit} onChange={(e) => setFormState((p) => ({ ...p, divisionBusinessUnit: e.target.value as DivisionName }))}>
                          {divisions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                      <FormField label="Preferred Output Format">
                        <select className="w-full rounded-lg border border-gray-300 px-3 py-2" value={formState.preferredOutputFormat} onChange={(e) => setFormState((p) => ({ ...p, preferredOutputFormat: e.target.value }))}>
                          {["PDF", "DOCX", "Both"].map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </FormField>
                    </div>
                    <FormField label="DBP Stream">
                      <div className="flex flex-wrap gap-3 pt-2">
                        {dbpStreams.map((s) => (
                          <label key={s} className="inline-flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={formState.dbpStreams.includes(s)} onChange={() => toggleStream(s)} />
                            {s}
                          </label>
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Programme / Initiative Name">
                      <Input value={formState.programmeInitiativeName} onChange={(e) => setFormState((p) => ({ ...p, programmeInitiativeName: e.target.value }))} required />
                    </FormField>
                    <FormField label="Organisation Context">
                      <Textarea value={formState.organisationContext} onChange={(e) => setFormState((p) => ({ ...p, organisationContext: e.target.value }))} rows={4} required />
                    </FormField>
                    <FormField label="Strategic Objectives">
                      <Textarea value={formState.strategicObjectives} onChange={(e) => setFormState((p) => ({ ...p, strategicObjectives: e.target.value }))} rows={3} required />
                    </FormField>
                    <FormField label="Current Technology Landscape">
                      <Textarea value={formState.currentTechnologyLandscape} onChange={(e) => setFormState((p) => ({ ...p, currentTechnologyLandscape: e.target.value }))} rows={3} required />
                    </FormField>
                    <FormField label="Key Requirements">
                      <Textarea value={formState.keyRequirements} onChange={(e) => setFormState((p) => ({ ...p, keyRequirements: e.target.value }))} rows={3} required />
                    </FormField>
                    <FormField label="Architecture Constraints">
                      <Textarea value={formState.architectureConstraints} onChange={(e) => setFormState((p) => ({ ...p, architectureConstraints: e.target.value }))} rows={3} />
                    </FormField>
                    <FormField label="Attach Relevant Documents">
                      <div className="rounded-lg border border-dashed border-gray-300 p-4 bg-gray-50 text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Upload className="w-4 h-4" />
                          Prototype input
                        </div>
                        <Input value={formState.referenceDocuments} onChange={(e) => setFormState((p) => ({ ...p, referenceDocuments: e.target.value }))} placeholder="Enter file names separated by commas" />
                      </div>
                    </FormField>
                    <FormField label="Additional Notes">
                      <Textarea value={formState.additionalNotes} onChange={(e) => setFormState((p) => ({ ...p, additionalNotes: e.target.value }))} rows={3} />
                    </FormField>
                  </>
                )}
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <Button type="button" variant="outline" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
              <Button type="submit" form="request-form" className="bg-orange-600 hover:bg-orange-700">
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        context={{
          marketplace: "document-studio",
          tab: normalizedTab,
          cardId: card.id,
          serviceName: card.title,
          action: "request-document",
        }}
        onLoginSuccess={() => {
          if (pendingRequestId) {
            navigate("/stage2/document-studio/my-requests", {
              state: { createdRequestId: pendingRequestId },
            });
            setPendingRequestId(null);
          }
        }}
      />

      <Footer />
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-gray-900">{label}</label>
      {children}
    </div>
  );
}

function ToggleFormField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 px-4 py-3">
      <label className="inline-flex items-center gap-3 text-sm text-gray-800">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    </div>
  );
}
