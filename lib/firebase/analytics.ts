import type { Analytics } from "firebase/analytics";
import { firebaseReady, initFirebaseAnalytics } from "@/lib/firebase/client";

type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsParams = Record<string, AnalyticsValue>;

let analyticsPromise: Promise<Analytics | null> | null = null;

function getAnalyticsInstance() {
  if (!firebaseReady) {
    return Promise.resolve(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = initFirebaseAnalytics();
  }

  return analyticsPromise;
}

function sanitizeEventParams(params?: AnalyticsParams) {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [
        key,
        typeof value === "boolean" ? String(value) : value,
      ]),
  );
}

function sanitizeUserProperties(properties: AnalyticsParams) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)]),
  );
}

export async function trackEvent(
  eventName: string,
  eventParams?: AnalyticsParams,
) {
  const analytics = await getAnalyticsInstance();

  if (!analytics) {
    return;
  }

  const { logEvent } = await import("firebase/analytics");

  logEvent(analytics, eventName, sanitizeEventParams(eventParams));
}

export async function setAnalyticsUserProperties(properties: AnalyticsParams) {
  const analytics = await getAnalyticsInstance();

  if (!analytics) {
    return;
  }

  const { setUserProperties } = await import("firebase/analytics");

  setUserProperties(analytics, sanitizeUserProperties(properties));
}
