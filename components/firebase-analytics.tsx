"use client";

import { useEffect } from "react";
import { firebaseReady, initFirebaseAnalytics } from "@/lib/firebase/client";
import {
  setAnalyticsUserProperties,
  trackEvent,
} from "@/lib/firebase/analytics";

function getDeviceType(width: number) {
  if (width < 768) {
    return "mobile";
  }

  if (width < 1024) {
    return "tablet";
  }

  return "desktop";
}

function getViewportBucket(width: number) {
  if (width < 640) {
    return "xs";
  }

  if (width < 768) {
    return "sm";
  }

  if (width < 1024) {
    return "md";
  }

  if (width < 1280) {
    return "lg";
  }

  return "xl";
}

function getReferrerHost(referrer: string) {
  if (!referrer) {
    return "direct";
  }

  try {
    return new URL(referrer).host;
  } catch {
    return "unknown";
  }
}

export default function FirebaseAnalytics() {
  useEffect(() => {
    if (!firebaseReady) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Firebase env vars are missing. Analytics was not started.");
      }

      return;
    }

    void initFirebaseAnalytics();

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const deviceType = getDeviceType(screenWidth);
    const viewportBucket = getViewportBucket(screenWidth);
    const touchCapable = navigator.maxTouchPoints > 0 ? "yes" : "no";
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    void setAnalyticsUserProperties({
      site_stage: "coming_soon",
      device_type: deviceType,
      viewport_bucket: viewportBucket,
      touch_capable: touchCapable,
      color_scheme: colorScheme,
    });

    void trackEvent("landing_page_viewed", {
      page_path: window.location.pathname,
      page_host: window.location.host,
      device_type: deviceType,
      viewport_bucket: viewportBucket,
      screen_width: screenWidth,
      screen_height: screenHeight,
      touch_capable: touchCapable,
      browser_language: navigator.language,
      referrer_host: getReferrerHost(document.referrer),
      site_stage: "coming_soon",
    });
  }, []);

  return null;
}
