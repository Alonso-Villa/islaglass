"use client";

import Image from "next/image";
import { startTransition, useEffect, useState } from "react";

const HERO_IMAGES = [
  "/window0.png",
  "/window1.png",
  "/window2.png",
  "/window3.png",
];

const SLIDE_INTERVAL_MS = 4500;

export default function HeroBackgroundSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((currentIndex) => (currentIndex + 1) % HERO_IMAGES.length);
      });
    }, SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {HERO_IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-[1800ms] ease-out ${
            index === activeIndex ? "opacity-34" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
