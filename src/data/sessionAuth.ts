const AUTH_KEY = "dtmp.session.authenticated";

const isBrowser = typeof window !== "undefined";

export const isUserAuthenticated = (): boolean => {
  if (!isBrowser) return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
};

export const setUserAuthenticated = (value: boolean): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(AUTH_KEY, value ? "true" : "false");
};
