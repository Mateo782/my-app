"use client";

import { useEffect, useState } from "react";

function SunIcon(): React.JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

type MoonProps = { active: boolean | null; animate: boolean };

function MoonIcon({ active, animate }: MoonProps): React.JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
      {/* Full circle — always rendered */}
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      {/*
        Overlay circle filled with the page background color.
        When scale(0): invisible → full moon shows.
        When scale(1): bites out a crescent from the moon circle.
        transform-origin is the center of this circle (cx=16, cy=9).
      */}
      <circle
        cx="16"
        cy="9"
        r="8"
        style={{
          fill: "var(--background)",
          transformOrigin: "16px 9px",
          transform: active ? "scale(1)" : "scale(0)",
          transition: animate ? "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
        }}
      />
    </svg>
  );
}

export default function DarkModeToggle(): React.JSX.Element {
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [sunSpinKey, setSunSpinKey] = useState(0);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle(dark: boolean): void {
    if (dark === isDark) return;
    if (!dark) setSunSpinKey((k) => k + 1);
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  const sunActive = isDark === false;
  const moonActive = isDark === true;

  return (
    <div className="flex items-center gap-1.5">
      {/* Sun */}
      <button
        type="button"
        aria-label="Light mode"
        onClick={() => toggle(false)}
        className="focus-visible:outline-none"
      >
        <span
          key={sunSpinKey}
          className={[
            "inline-flex transition-opacity duration-300",
            sunActive ? "text-zinc-900 opacity-100" : "text-zinc-400 opacity-40",
            sunSpinKey > 0 ? "motion-safe:animate-spin-once" : "",
          ].join(" ")}
        >
          <SunIcon />
        </span>
      </button>

      {/* Pill toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={isDark ?? false}
        aria-label="Toggle dark mode"
        onClick={() => toggle(!isDark)}
        className="relative h-5 w-9 overflow-hidden rounded-full bg-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
      >
        <span
          className={`absolute left-0 top-0.5 h-4 w-4 rounded-full bg-zinc-900 shadow-sm transition-transform duration-300 ${isDark ? "translate-x-[18px]" : "translate-x-[2px]"}`}
        />
      </button>

      {/* Moon */}
      <button
        type="button"
        aria-label="Dark mode"
        onClick={() => toggle(true)}
        className="focus-visible:outline-none"
      >
        <span
          className={[
            "inline-flex transition-opacity duration-300",
            moonActive ? "text-zinc-900 opacity-100" : "text-zinc-400 opacity-40",
          ].join(" ")}
        >
          <MoonIcon active={moonActive} animate={isDark !== null} />
        </span>
      </button>
    </div>
  );
}
