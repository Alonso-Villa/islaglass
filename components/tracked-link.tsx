"use client";

import { trackEvent, type AnalyticsParams } from "@/lib/firebase/analytics";
import type { MouseEvent } from "react";

const TRACKING_NAVIGATION_DELAY_MS = 140;

type TrackedLinkProps = React.ComponentPropsWithoutRef<"a"> & {
  analyticsEvent: string;
  analyticsParams?: AnalyticsParams;
};

export default function TrackedLink({
  analyticsEvent,
  analyticsParams,
  href,
  onClick,
  target,
  rel,
  ...props
}: TrackedLinkProps) {
  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (event.defaultPrevented || !href) {
      return;
    }

    const isPrimaryClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;

    if (!isPrimaryClick) {
      void trackEvent(analyticsEvent, analyticsParams);
      return;
    }

    event.preventDefault();

    await Promise.race([
      trackEvent(analyticsEvent, analyticsParams),
      new Promise((resolve) =>
        window.setTimeout(resolve, TRACKING_NAVIGATION_DELAY_MS),
      ),
    ]);

    if (href.startsWith("#")) {
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        window.history.replaceState(null, "", href);
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      return;
    }

    if (target === "_blank") {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }

    window.location.assign(href);
  }

  return (
    <a
      {...props}
      href={href}
      target={target}
      rel={rel}
      onClick={(event) => {
        void handleClick(event);
      }}
    />
  );
}
