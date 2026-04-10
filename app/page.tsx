import HeroBackgroundSlideshow from "@/components/hero-background-slideshow";
import IntroVideoOverlay from "@/components/intro-video-overlay";
import PlayIntroButton from "@/components/play-intro-button";
import SiteAvailabilityGate from "@/components/site-availability-gate";
import TrackedLink from "@/components/tracked-link";
import Image from "next/image";

const tickerItems = [
  "Enhanced Security",
  "Residential and Commercial",
  "Gulf Coast lifestyle design",
  "Superior Impact Resistance",
  "Energy-Efficient Capacities",
  "Custom Styles and Colors",
  "Noise Reduction Technology",
];

export default function Home() {
  return (
    <SiteAvailabilityGate>
      <main className="relative isolate overflow-hidden">
        <IntroVideoOverlay />
        <div className="pointer-events-none absolute inset-0 current-grid opacity-70" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] bg-[radial-gradient(circle_at_top,rgba(66,131,209,0.24),transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 top-24 size-80 rounded-full bg-[rgba(66,131,209,0.16)] blur-3xl animate-drift" />
        <div
          className="pointer-events-none absolute -right-16 top-40 size-96 rounded-full bg-[rgba(176,186,163,0.2)] blur-3xl animate-drift"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 wave-ribbon opacity-90" />

        <section id="site-hero" className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <HeroBackgroundSlideshow />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,24,48,0.22)_0%,rgba(24,30,58,0.12)_28%,rgba(255,255,255,0.28)_72%,rgba(255,255,255,0.58)_100%)]" />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[1] hero-signal-overlay">
            <div className="absolute inset-0 hero-signal-panel" />
            <div className="absolute inset-0 shimmer-sweep opacity-72" />
          </div>
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
            <header className="flex justify-end">
              <PlayIntroButton />
            </header>

            <div className="grid flex-1 items-center justify-items-center gap-12 py-12 lg:py-18">
              <div className="animate-rise text-center">
                <div className="relative inline-flex">
                  <Image
                    src="/Logo_full_light.png"
                    alt="Isla Glass Logo"
                    width={1903}
                    height={1215}
                    priority
                    sizes="(max-width: 768px) 90vw, 560px"
                    className="relative isolate h-auto w-full max-w-md mix-blend-normal brightness-110 contrast-125 saturate-150 drop-shadow-[0_24px_42px_rgba(28,34,66,0.22)] sm:max-w-lg lg:max-w-152"
                  />
                </div>

                <h1 className="hero-title hero-title-enter mx-auto mt-6 max-w-4xl font-display text-7xl leading-[0.88] tracking-[-0.03em] text-(--deep-sea) lg:text-8xl">
                  coming soon
                </h1>

                <p className="hero-copy hero-copy-enter mx-auto mt-6 max-w-2xl text-lg leading-8 text-white sm:text-xl">
                  Coastal living inspired design and quality. Delivering
                  impact-rated protection, quality certifications &amp; modern
                  design. For residential &amp; commercial coverage.
                </p>

                <div className="mx-auto mt-10 flex flex-col items-center gap-3">
                  <p className="font-subtitle text-[0.68rem] uppercase tracking-[0.32em] text-white">
                    Contact info
                  </p>
                  <TrackedLink
                    href="#site-footer"
                    aria-label="Scroll to footer"
                    analyticsEvent="contact_info_scroll_clicked"
                    analyticsParams={{
                      source_location: "hero",
                    }}
                    className="scroll-arrow-button inline-flex size-16 items-center justify-center rounded-full border border-white/36 bg-white/12 text-white shadow-[0_18px_42px_rgba(28,34,66,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="scroll-arrow-icon size-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v13" />
                      <path d="m6.5 12.5 5.5 5.5 5.5-5.5" />
                    </svg>
                    <span className="sr-only">Scroll to footer</span>
                  </TrackedLink>
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-7xl overflow-hidden rounded-full border border-transparent bg-white/80 py-3 shadow-[0_18px_40px_rgba(28,34,66,0.08)] backdrop-blur-xs">
              <div className="flex w-max animate-marquee gap-4 pr-4">
                {[...tickerItems, ...tickerItems].map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="font-subtitle flex items-center gap-4 whitespace-nowrap px-2 text-xs uppercase tracking-[0.3em] text-[rgba(28,34,66,0.68)]"
                  >
                    <span className="size-1.5 rounded-full bg-[var(--sea)]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <footer
          id="site-footer"
          className="relative px-6 py-8 sm:px-8 lg:px-10 lg:py-12"
        >
          <div className="mx-auto max-w-7xl border-t border-[rgba(28,34,66,0.08)] pt-10">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Image
                  src="/Logo_full_dark.png"
                  alt="Isla Glass"
                  width={1903}
                  height={1215}
                  sizes="(max-width: 768px) 70vw, 280px"
                  className="h-auto w-full max-w-[15rem]"
                />
                <p className="mt-6 max-w-xl text-base leading-8 text-[rgba(28,34,66,0.74)]">
                  Coastal living inspired design and quality for impact-rated
                  protection, modern aesthetics, and residential and commercial
                  coverage across the Gulf Coast.
                </p>
                <p className="mt-6 text-sm leading-7 text-[rgba(28,34,66,0.66)]">
                  Impact-rated systems for residential and commercial coverage.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="font-subtitle text-2xl uppercase tracking-[0.24em] text-[rgba(28,34,66,0.5)]">
                    Contact
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <TrackedLink
                      href="mailto:eli@islaglass.com"
                      analyticsEvent="contact_action_clicked"
                      analyticsParams={{
                        method: "email",
                        source_location: "footer",
                      }}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--deep-sea)] px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      eli@islaglass.com
                    </TrackedLink>
                    <TrackedLink
                      href="https://wa.me/17023582880?text=Hi%20%F0%9F%91%8B%F0%9F%8F%BB%2C%20I%E2%80%99m%20contacting%20you%20from%20your%20Isla%20glass%20website%20%F0%9F%92%BB%F0%9F%93%B1"
                      target="_blank"
                      rel="noreferrer"
                      analyticsEvent="contact_action_clicked"
                      analyticsParams={{
                        method: "whatsapp",
                        source_location: "footer",
                      }}
                      className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[rgba(28,34,66,0.12)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--deep-sea)] transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <Image
                        src="/whatsapp.png"
                        alt=""
                        aria-hidden="true"
                        width={24}
                        height={24}
                        sizes="24px"
                        className="h-5 w-5 object-contain"
                      />
                      702-358-2880
                    </TrackedLink>
                  </div>
                </div>

                <div>
                  <p className="font-subtitle text-2xl uppercase tracking-[0.24em] text-[rgba(28,34,66,0.5)]">
                    Location
                  </p>
                  <p className="mt-4 text-lg leading-7 text-[var(--deep-sea)]">
                    Cape Coral, FL.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[rgba(28,34,66,0.72)]">
                    Designed around coastal living and built for projects that
                    demand certified impact protection.
                  </p>
                </div>

                <div className="border-t border-[rgba(28,34,66,0.08)] pt-6 sm:col-span-2 sm:flex sm:items-end sm:justify-between sm:gap-8">
                  <div>
                    <p className="font-subtitle text-2xl uppercase tracking-[0.24em] text-[rgba(28,34,66,0.5)]">
                      Copyright
                    </p>
                    <p className="mt-4 text-lg leading-7 text-[var(--deep-sea)]">
                      © 2026 Isla Glass. All rights reserved.
                    </p>
                  </div>
                  <p className="mt-3 max-w-md text-sm leading-7 text-[rgba(28,34,66,0.72)] sm:mt-0 sm:text-right">
                    Website launch in progress. Brand visuals, messaging, and
                    contact access will continue expanding here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </SiteAvailabilityGate>
  );
}
