"use client";

import TrackedLink from "@/components/tracked-link";
import {
  setAnalyticsUserProperties,
  trackEvent,
} from "@/lib/firebase/analytics";
import { firebaseReady, initFirestore } from "@/lib/firebase/client";
import Image from "next/image";
import { startTransition, useEffect, useState } from "react";

type GateStatus = "checking" | "active" | "inactive";
type InactiveReason =
  | "firebase_unavailable"
  | "firestore_unavailable"
  | "missing_document"
  | "flag_inactive"
  | "read_error";

const SITE_PERMISSION_COLLECTION = "permission";
const SITE_PERMISSION_DOCUMENT = "website";
const WHATSAPP_CONTACT_URL = "https://wa.me/17867100565";

function AvailabilityShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(180deg,#1c2242_0%,#25335b_48%,#eff4fb_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 current-grid opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(66,131,209,0.22)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.35),transparent_68%)]" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-14 sm:px-8">
        {children}
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <AvailabilityShell>
      <div className="flex max-w-xl flex-col items-center text-center">
        <Image
          src="/Logo_full_light.png"
          alt="Isla Glass"
          width={1903}
          height={1215}
          priority
          sizes="(max-width: 768px) 80vw, 360px"
          className="h-auto w-full max-w-xs sm:max-w-sm"
        />
        <p className="font-subtitle mt-8 text-xs uppercase tracking-[0.32em] text-white/70">
          Checking website availability
        </p>
        <div className="mt-5 h-px w-40 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-full animate-[shimmer_1.6s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)]" />
        </div>
      </div>
    </AvailabilityShell>
  );
}

function InactiveState({ reason }: { reason: InactiveReason }) {
  return (
    <AvailabilityShell>
      <div className="w-full max-w-3xl rounded-[2.25rem] border border-white/12 bg-[rgba(18,24,48,0.52)] px-7 py-10 shadow-[0_28px_90px_rgba(8,12,28,0.24)] backdrop-blur-xl sm:px-10 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-subtitle text-xs uppercase tracking-[0.32em] text-white/58">
            Website unavailable
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[0.92] tracking-[-0.03em] text-white sm:text-6xl">
            This website is currently offline.
          </h1>
          <p className="mt-6 text-base leading-8 text-white/78 sm:text-lg">
            Isla Glass is temporarily unavailable. For more information
            contact the team directly through WhatsApp.
          </p>
          <p className="mt-3 text-sm leading-7 text-white/54">
            Status source: Firestore permission/website
            {reason === "flag_inactive" ? " isActive = false." : "."}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="font-subtitle text-[0.68rem] uppercase tracking-[0.3em] text-white/60">
              For more information contact
            </p>
            <TrackedLink
              href={WHATSAPP_CONTACT_URL}
              target="_blank"
              rel="noreferrer"
              analyticsEvent="website_unavailable_contact_clicked"
              analyticsParams={{
                reason,
                method: "whatsapp",
                source_location: "website_gate",
              }}
              className="inline-flex items-center justify-center rounded-[1.7rem] bg-white px-6 py-5 shadow-[0_24px_55px_rgba(8,12,28,0.28)] transition-transform duration-300 hover:-translate-y-1"
            >
              <Image
                src="/Logo_dark.png"
                alt="Contact Isla Glass on WhatsApp"
                width={1237}
                height={224}
                sizes="(max-width: 768px) 68vw, 360px"
                className="h-auto w-full max-w-[15rem] sm:max-w-[18rem]"
              />
            </TrackedLink>
          </div>
        </div>
      </div>
    </AvailabilityShell>
  );
}

export default function SiteAvailabilityGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<GateStatus>("checking");
  const [inactiveReason, setInactiveReason] =
    useState<InactiveReason>("read_error");

  useEffect(() => {
    let cancelled = false;

    async function checkSiteAvailability() {
      if (!firebaseReady) {
        if (cancelled) {
          return;
        }

        void setAnalyticsUserProperties({
          website_gate_status: "firebase_unavailable",
        });
        void trackEvent("website_gate_blocked", {
          reason: "firebase_unavailable",
        });

        startTransition(() => {
          setInactiveReason("firebase_unavailable");
          setStatus("inactive");
        });

        return;
      }

      try {
        const firestore = await initFirestore();

        if (!firestore) {
          throw new Error("firestore_unavailable");
        }

        const { doc, getDoc } = await import("firebase/firestore/lite");
        const documentSnapshot = await getDoc(
          doc(firestore, SITE_PERMISSION_COLLECTION, SITE_PERMISSION_DOCUMENT),
        );

        if (cancelled) {
          return;
        }

        const isActive =
          documentSnapshot.exists() &&
          documentSnapshot.data().isActive === true;
        const blockReason: InactiveReason = documentSnapshot.exists()
          ? "flag_inactive"
          : "missing_document";

        void setAnalyticsUserProperties({
          website_gate_status: isActive ? "active" : blockReason,
        });
        void trackEvent("website_gate_checked", {
          is_active: String(isActive),
          document_exists: String(documentSnapshot.exists()),
          source_path: `${SITE_PERMISSION_COLLECTION}/${SITE_PERMISSION_DOCUMENT}`,
        });

        if (isActive) {
          startTransition(() => {
            setStatus("active");
          });

          return;
        }

        void trackEvent("website_gate_blocked", {
          reason: blockReason,
        });

        startTransition(() => {
          setInactiveReason(blockReason);
          setStatus("inactive");
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const reason =
          error instanceof Error && error.message === "firestore_unavailable"
            ? "firestore_unavailable"
            : "read_error";

        void setAnalyticsUserProperties({
          website_gate_status: reason,
        });
        void trackEvent("website_gate_error", {
          reason,
        });

        startTransition(() => {
          setInactiveReason(reason);
          setStatus("inactive");
        });
      }
    }

    void checkSiteAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return <LoadingState />;
  }

  if (status === "inactive") {
    return <InactiveState reason={inactiveReason} />;
  }

  return <>{children}</>;
}
