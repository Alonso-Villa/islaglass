"use client";

import {
  setAnalyticsUserProperties,
  trackEvent,
} from "@/lib/firebase/analytics";
import Image from "next/image";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

type IntroOrientation = "desktop" | "mobile";
type IntroPhase = "visible" | "exiting" | "hidden";
type IntroStartSource =
  | "autoplay"
  | "replay_button"
  | "prompt_sound"
  | "prompt_silent";

const PLAY_INTRO_EVENT = "isla:play-intro";
const HERO_SECTION_ID = "site-hero";

const INTRO_SOURCES: Record<
  IntroOrientation,
  { mp4: string; webm: string }
> = {
  desktop: {
    webm: "/videos/Intro_horizontal.webm",
    mp4: "/videos/Intro_horizontal.mp4",
  },
  mobile: {
    webm: "/videos/Intro_vertical.webm",
    mp4: "/videos/Intro_vertical.mp4",
  },
};

export default function IntroVideoOverlay() {
  const [phase, setPhase] = useState<IntroPhase>("visible");
  const [soundOn, setSoundOn] = useState(true);
  const [awaitingInteraction, setAwaitingInteraction] = useState(false);
  const dismissTimeoutRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasLoggedIntroStartRef = useRef(false);
  const hasLoggedPromptRef = useRef(false);
  const introStartSourceRef = useRef<IntroStartSource>("autoplay");

  const orientation = useSyncExternalStore<IntroOrientation | null>(
    subscribeToViewport,
    getViewportOrientation,
    () => null,
  );

  function resetIntroCycle(startSource: IntroStartSource) {
    hasLoggedPromptRef.current = false;
    hasLoggedIntroStartRef.current = false;
    introStartSourceRef.current = startSource;
  }

  useEffect(() => {
    return () => {
      if (dismissTimeoutRef.current) {
        window.clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!awaitingInteraction || hasLoggedPromptRef.current) {
      return;
    }

    hasLoggedPromptRef.current = true;

    void trackEvent("intro_prompt_shown", {
      orientation: orientation ?? "unknown",
    });
  }, [awaitingInteraction, orientation]);

  useEffect(() => {
    async function handlePlayIntro() {
      resetIntroCycle("replay_button");
      scrollToHeroSection();

      if (dismissTimeoutRef.current) {
        window.clearTimeout(dismissTimeoutRef.current);
        dismissTimeoutRef.current = null;
      }

      const video = videoRef.current;

      startTransition(() => {
        setPhase("visible");
        setSoundOn(true);
        setAwaitingInteraction(false);
      });

      if (!video) {
        return;
      }

      video.currentTime = 0;
      video.muted = false;

      try {
        await video.play();
      } catch {
        setAwaitingInteraction(true);
      }
    }

    window.addEventListener(PLAY_INTRO_EVENT, handlePlayIntro);

    return () => {
      window.removeEventListener(PLAY_INTRO_EVENT, handlePlayIntro);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    let cancelled = false;

    async function syncPlayback() {
      if (!video || !orientation || phase !== "visible" || awaitingInteraction) {
        return;
      }

      video.muted = !soundOn;

      try {
        await video.play();
      } catch {
        if (!soundOn || cancelled) {
          return;
        }

        video.pause();
        setAwaitingInteraction(true);
      }
    }

    void syncPlayback();

    return () => {
      cancelled = true;
    };
  }, [awaitingInteraction, orientation, phase, soundOn]);

  useEffect(() => {
    if (phase === "hidden") {
      videoRef.current?.pause();
    }
  }, [phase]);

  function dismissIntro() {
    if (phase !== "visible") {
      return;
    }

    scrollToHeroSection();

    startTransition(() => {
      setPhase("exiting");
    });

    dismissTimeoutRef.current = window.setTimeout(() => {
      scrollToHeroSection();

      startTransition(() => {
        setPhase("hidden");
      });
    }, 950);
  }

  async function toggleSound() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextSoundOn = !soundOn;
    video.muted = !nextSoundOn;

    if (awaitingInteraction && !nextSoundOn) {
      try {
        resetIntroCycle("prompt_silent");
        await video.play();
        setAwaitingInteraction(false);
        setSoundOn(false);
        hasLoggedPromptRef.current = false;
        void setAnalyticsUserProperties({
          intro_audio_preference: "silent",
        });
        void trackEvent("intro_audio_toggled", {
          sound_on: "false",
          context: "intro_prompt",
        });
      } catch {
        setSoundOn(false);
      }

      return;
    }

    try {
      await video.play();
      setSoundOn(nextSoundOn);
      setAwaitingInteraction(false);
      void setAnalyticsUserProperties({
        intro_audio_preference: nextSoundOn ? "sound_on" : "silent",
      });
      void trackEvent("intro_audio_toggled", {
        sound_on: String(nextSoundOn),
        context: awaitingInteraction ? "intro_prompt" : "intro_overlay",
      });
    } catch {
      if (nextSoundOn) {
        video.pause();
        setSoundOn(true);
        setAwaitingInteraction(true);
        void trackEvent("intro_audio_toggle_blocked", {
          attempted_state: "sound_on",
        });
        return;
      }

      video.muted = true;
      setSoundOn(false);
    }
  }

  async function startWithSound() {
    const video = videoRef.current;

    resetIntroCycle("prompt_sound");
    scrollToHeroSection();

    if (!video) {
      return;
    }

    video.muted = false;

    try {
      await video.play();
      setSoundOn(true);
      setAwaitingInteraction(false);
      hasLoggedPromptRef.current = false;
      void setAnalyticsUserProperties({
        intro_audio_preference: "sound_on",
      });
    } catch {
      setAwaitingInteraction(true);
    }
  }

  async function startSilent() {
    const video = videoRef.current;

    resetIntroCycle("prompt_silent");
    scrollToHeroSection();

    if (!video) {
      return;
    }

    video.muted = true;

    try {
      await video.play();
      setSoundOn(false);
      setAwaitingInteraction(false);
      hasLoggedPromptRef.current = false;
      void setAnalyticsUserProperties({
        intro_audio_preference: "silent",
      });
    } catch {
      setSoundOn(false);
      setAwaitingInteraction(true);
    }
  }

  function handleIntroPlay() {
    const video = videoRef.current;

    if (!video || hasLoggedIntroStartRef.current) {
      return;
    }

    hasLoggedIntroStartRef.current = true;

    void trackEvent("intro_started", {
      orientation: orientation ?? "unknown",
      start_source: introStartSourceRef.current,
      sound_on: String(!video.muted),
      duration_seconds: Math.round(video.duration || 9),
    });
  }

  function handleIntroFinished(status: "completed" | "error") {
    const video = videoRef.current;

    void trackEvent(
      status === "completed" ? "intro_completed" : "intro_error",
      {
        orientation: orientation ?? "unknown",
        sound_on: video ? String(!video.muted) : "unknown",
        playback_seconds:
          video && Number.isFinite(video.duration)
            ? Math.round(video.duration)
            : 9,
      },
    );

    dismissIntro();
  }

  const source = orientation ? INTRO_SOURCES[orientation] : null;

  return (
    <div
      className={`intro-overlay fixed inset-0 z-[120] overflow-hidden bg-[var(--deep-sea)] ${
        phase === "hidden" ? "pointer-events-none opacity-0" : ""
      } ${phase === "exiting" ? "intro-overlay-exit" : ""}`}
      aria-hidden={phase === "hidden"}
    >
      <button
        type="button"
        onClick={() => {
          void toggleSound();
        }}
        className="absolute right-5 top-5 z-[2] inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-[rgba(28,34,66,0.34)] text-white shadow-[0_20px_40px_rgba(0,0,0,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5"
        aria-label={soundOn ? "Mute intro video" : "Unmute intro video"}
        aria-pressed={soundOn}
      >
        {soundOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(66,131,209,0.24),transparent_42%),linear-gradient(180deg,rgba(28,34,66,0.16),rgba(28,34,66,0.34))]" />

      {source ? (
        <video
          key={orientation}
          ref={videoRef}
          className={`h-full w-full object-cover ${
            phase === "exiting" ? "intro-video-exit" : ""
          }`}
          autoPlay
          muted={!soundOn}
          playsInline
          preload="auto"
          poster="/cover.png"
          onPlay={handleIntroPlay}
          onEnded={() => {
            handleIntroFinished("completed");
          }}
          onError={() => {
            handleIntroFinished("error");
          }}
        >
          <source src={source.webm} type="video/webm" />
          <source src={source.mp4} type="video/mp4" />
        </video>
      ) : (
        <div className="h-full w-full animate-soft-pulse bg-[linear-gradient(135deg,#1c2242_0%,#314e8c_58%,#4283d1_100%)]" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(28,34,66,0.08)_0%,rgba(28,34,66,0.02)_40%,rgba(28,34,66,0.2)_100%)]" />

      {awaitingInteraction ? (
        <div className="absolute inset-0 z-[3] flex items-center justify-center bg-[rgba(28,34,66,0.28)] px-6 backdrop-blur-sm">
          <div className="max-w-md rounded-[2rem] border border-white/12 bg-[rgba(28,34,66,0.58)] p-8 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden">
              <Image
                src="/Icon.png"
                alt="Isla Glass icon"
                width={1414}
                height={1424}
                sizes="64px"
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="mt-6 font-display text-3xl leading-none text-white">
              Welcome
            </h2>
            <p className="mt-4 text-sm leading-7 text-[rgba(255,255,255,0.76)]">
              You can choose to start it with or without sound
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => {
                  void startWithSound();
                }}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--deep-sea)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <SpeakerOnIcon className="size-4" />
                Start
              </button>
              <button
                type="button"
                onClick={() => {
                  void startSilent();
                }}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/16 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
              >
                <SpeakerOffIcon className="size-4" />
                Start without sound
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function subscribeToViewport(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(min-width: 768px)");

  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getViewportOrientation(): IntroOrientation {
  return window.matchMedia("(min-width: 768px)").matches ? "desktop" : "mobile";
}

function scrollToHeroSection() {
  const heroSection = document.getElementById(HERO_SECTION_ID);

  if (heroSection) {
    heroSection.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

function SpeakerOnIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} fill-none stroke-current`}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14h4l5 4V6L8 10H4z" />
      <path d="M17 9a5 5 0 0 1 0 6" />
      <path d="M19.8 6.5a8.5 8.5 0 0 1 0 11" />
    </svg>
  );
}

function SpeakerOffIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${className} fill-none stroke-current`}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14h4l5 4V6L8 10H4z" />
      <path d="M17 9a5 5 0 0 1 0 6" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
