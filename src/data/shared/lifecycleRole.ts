// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle Insights Role Store
// Pattern: matches sessionRole.ts — localStorage-backed, pure functions
// Separate from platform sessionRole to allow Lifecycle-specific depth gating
// without touching the TO/business-user platform roles.
// src/data/shared/lifecycleRole.ts
// ─────────────────────────────────────────────────────────────────────────────

const ROLE_KEY = "dtmp.lifecycle.insightsRole";
const isBrowser = typeof window !== "undefined";

/**
 * Initiative Owner / PM   — full operational cockpit
 * Senior Stakeholder      — executive summary only
 * General Staff           — lightweight public summary
 */
export type LifecycleInsightsRole =
  | "initiative-owner"
  | "senior-stakeholder"
  | "general-staff";

export const LIFECYCLE_ROLE_LABELS: Record<LifecycleInsightsRole, string> = {
  "initiative-owner": "Initiative Owner / PM",
  "senior-stakeholder": "Senior Stakeholder / Division Head",
  "general-staff": "General DEWA Staff",
};

export const LIFECYCLE_ROLE_DESCRIPTIONS: Record<LifecycleInsightsRole, string> = {
  "initiative-owner":
    "Full operational cockpit — milestones, budget, blockers, risk register, team, activity feed. Can update status and RAG.",
  "senior-stakeholder":
    "Executive summary — overall RAG, headline milestones, budget at a glance, top risks, projects list.",
  "general-staff":
    "Lightweight summary — initiative name, status, completion %, start and target end date.",
};

const DEMO_ACCOUNTS: Record<
  LifecycleInsightsRole,
  { name: string; title: string; division: string }
> = {
  "initiative-owner": {
    name: "Eng. Khalid Al Rashidi",
    title: "Programme Manager",
    division: "Transmission",
  },
  "senior-stakeholder": {
    name: "Eng. Mohammed Al Marzouqi",
    title: "EVP, Transmission & Distribution",
    division: "Transmission",
  },
  "general-staff": {
    name: "Fatima Al Hashimi",
    title: "Business Analyst",
    division: "Corporate & Strategy",
  },
};

export const getDemoAccount = (role: LifecycleInsightsRole) => DEMO_ACCOUNTS[role];

const allowedRoles: LifecycleInsightsRole[] = [
  "initiative-owner",
  "senior-stakeholder",
  "general-staff",
];

export const getLifecycleRole = (): LifecycleInsightsRole | null => {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(ROLE_KEY);
  if (!raw) return null;
  return allowedRoles.includes(raw as LifecycleInsightsRole)
    ? (raw as LifecycleInsightsRole)
    : null;
};

export const setLifecycleRole = (role: LifecycleInsightsRole): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(ROLE_KEY, role);
};

export const clearLifecycleRole = (): void => {
  if (!isBrowser) return;
  window.localStorage.removeItem(ROLE_KEY);
};

export const isInitiativeOwner = (role: LifecycleInsightsRole | null): boolean =>
  role === "initiative-owner";

export const isSeniorStakeholder = (role: LifecycleInsightsRole | null): boolean =>
  role === "senior-stakeholder";
