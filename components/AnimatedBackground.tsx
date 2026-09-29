"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Connection = { saveData?: boolean; effectiveType?: string };

/**
 * Data Saver and 2G keep the still image. Not 3G: Chrome's estimate flips
 * between "3g" and "4g" on ordinary broadband, which left the animation off
 * for no reason, and it only loads after the page anyway.
 */
function wantsLightPage() {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  if (!connection) return false;
  return Boolean(connection.saveData) || /2g/.test(connection.effectiveType ?? "");
}

/**
 * A hero background in two steps: a small still (~30 kB) paints immediately,
 * then the animation (a few MB) is fetched once the page has finished loading
 * and fades in over it. Pages therefore open at once instead of waiting on it.
 * Visitors on reduced motion or a slow connection just keep the still.
 */
export default function AnimatedBackground({
  src,
  priority = false,
}: {
  /** The animated file; its still is the same name with `-poster`. */
  src: string;
  priority?: boolean;
}) {
  const poster = src.replace(/\.(webp|gif)$/, "-poster.webp");
  const [wanted, setWanted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (wantsLightPage()) return;

    let handle = 0;
    const schedule = () => {
      handle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(() => setWanted(true), { timeout: 2500 })
          : window.setTimeout(() => setWanted(true), 400);
    };

    // Let the page finish its own work before pulling in the animation.
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (!handle) return;
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    <>
      <Image
        src={poster}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        aria-hidden
        className="object-cover"
      />
      {wanted && (
        <Image
          src={src}
          alt=""
          fill
          // Next's optimizer would flatten the animation to a single frame.
          unoptimized
          aria-hidden
          // Next calls onLoad once the image has decoded. Blend in slowly, so
          // the still seems to come alive rather than get swapped out.
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-opacity duration-[1600ms] ease-in-out ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}
