const ROLE_KEY = "dtmp.session.role";

const isBrowser = typeof window !== "undefined";

export type SessionRole = "to-ops" | "to-admin" | "business-user";

const allowedRoles: SessionRole[] = ["to-ops", "to-admin", "business-user"];

export const getSessionRole = (): SessionRole | null => {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(ROLE_KEY);
  if (!raw) return null;
  return allowedRoles.includes(raw as SessionRole) ? (raw as SessionRole) : null;
};

export const setSessionRole = (role: SessionRole): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(ROLE_KEY, role);
};

export const isTOStage3Role = (role: SessionRole | null): boolean =>
  role === "to-ops" || role === "to-admin";

