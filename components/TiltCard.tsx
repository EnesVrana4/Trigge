"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

/**
 * A card that tilts toward the cursor and exposes the pointer position as
 * --mx / --my, for glows that follow it (see .spotlight and .glare in
 * globals.css). Mouse only; touch and reduced-motion users get a still card.
 */
export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const canTilt = useRef(false);

  useEffect(() => {
    canTilt.current = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    if (canTilt.current) {
      card.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
      card.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    }
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`[transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${className}`}
    >
      {children}
    </div>
  );
}
