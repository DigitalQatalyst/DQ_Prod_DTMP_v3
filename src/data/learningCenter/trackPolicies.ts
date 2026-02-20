export interface TrackVersionPolicy {
  trackId: string;
  currentPathVersion: string;
  validityMonths: number;
  recertificationWindowDays: number;
  renewalPolicy: string;
  recertificationRequiredOnChange: boolean;
  changeTriggers: string[];
}

const defaultTrackPolicy: Omit<TrackVersionPolicy, "trackId"> = {
  currentPathVersion: "v1.0",
  validityMonths: 24,
  recertificationWindowDays: 60,
  renewalPolicy:
    "Path certificate remains valid for 24 months and requires recertification when major path updates are released.",
  recertificationRequiredOnChange: true,
  changeTriggers: [
    "Required course composition changes",
    "Capstone/final assessment changes",
    "Major learning objective revision",
  ],
};

export const trackVersionPolicies: TrackVersionPolicy[] = [
  {
    trackId: "transformation-leader",
    ...defaultTrackPolicy,
    currentPathVersion: "v1.2",
  },
  {
    trackId: "enterprise-architect",
    ...defaultTrackPolicy,
    currentPathVersion: "v1.1",
  },
  {
    trackId: "portfolio-manager",
    ...defaultTrackPolicy,
  },
  {
    trackId: "digital-product-owner",
    ...defaultTrackPolicy,
  },
  {
    trackId: "change-champion",
    ...defaultTrackPolicy,
  },
  {
    trackId: "technical-lead",
    ...defaultTrackPolicy,
    currentPathVersion: "v1.1",
  },
  {
    trackId: "executive-leadership",
    ...defaultTrackPolicy,
  },
  {
    trackId: "fullstack-professional",
    ...defaultTrackPolicy,
    currentPathVersion: "v2.0",
    validityMonths: 18,
    renewalPolicy:
      "Path certificate remains valid for 18 months and requires recertification after major path updates or capstone redesign.",
  },
];

export const getTrackVersionPolicy = (trackId: string): TrackVersionPolicy =>
  trackVersionPolicies.find((policy) => policy.trackId === trackId) ?? {
    trackId,
    ...defaultTrackPolicy,
  };
