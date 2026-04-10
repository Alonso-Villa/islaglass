"use client";

import { trackEvent } from "@/lib/firebase/analytics";

const PLAY_INTRO_EVENT = "isla:play-intro";

export default function PlayIntroButton() {
  return (
    <button
      type="button"
      onClick={() => {
        void trackEvent("intro_replay_clicked", {
          source_location: "hero_header",
        });
        window.dispatchEvent(new CustomEvent(PLAY_INTRO_EVENT));
      }}
      className="inline-flex items-center gap-3 rounded-full border border-white/26 bg-white/12 px-5 py-3 font-subtitle text-[0.7rem] uppercase tracking-[0.28em] text-white shadow-[0_18px_42px_rgba(28,34,66,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5"
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full border border-white/16 bg-white/10">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-3.5 fill-current"
        >
          <path d="M8 6.5v11l9-5.5z" />
        </svg>
      </span>
      Play intro
    </button>
  );
}
