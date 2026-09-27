import { activateStaticDemoUser } from "@/_core/hooks/useAuth";

export const startLogin = () => {
  activateStaticDemoUser();
  window.location.hash = "/dashboard";
};

export const COOKIE_NAME = "static-demo-session";
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
