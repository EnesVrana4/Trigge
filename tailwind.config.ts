import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        // Screens where the process section pins while its steps play through.
        // Keep in sync with PIN_QUERY in components/ProcessTimeline.tsx.
        pin: {
          raw: "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)",
        },
      },
      colors: {
        navy: {
          950: "#070b14",
          900: "#0b1120",
          800: "#131c30",
          700: "#1d283f",
          600: "#2a3752",
        },
        accent: {
          DEFAULT: "#7fb0f0",
          light: "#a8c9f5",
          dark: "#4c7fc4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        // Hero and intro only; the variables are set in lib/fonts.ts.
        manrope: ["var(--font-manrope)", "system-ui", "sans-serif"],
        montserrat: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        jetbrains: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1280px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.7)", opacity: "0.6" },
          "80%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        ripple: {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        sheen: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        drift: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-80px, 60px) scale(1.15)" },
          "100%": { transform: "translate(40px, -30px) scale(0.95)" },
        },
        progress: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
        typing: {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.45" },
          "30%": { transform: "translateY(-2.5px)", opacity: "1" },
        },
        draw: {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        stack: {
          from: { transform: "translateY(-6px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        sweep: {
          from: { transform: "rotate(-135deg)" },
          to: { transform: "rotate(0deg)" },
        },
        type: {
          "0%": { transform: "scaleX(0)" },
          "20%, 80%": { transform: "scaleX(1)", opacity: "1" },
          "100%": { transform: "scaleX(1)", opacity: "0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        bars: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(0.35)" },
        },
        drop: {
          "0%": { transform: "translateY(-44px)", opacity: "0" },
          "10%": { opacity: "1" },
          "32%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-4px)" },
          "48%, 85%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "0" },
        },
        pop: {
          "0%, 36%": { transform: "scale(0)" },
          "44%": { transform: "scale(1.35)" },
          "52%, 85%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        redraw: {
          "0%": { strokeDashoffset: "1" },
          "50%, 85%": { strokeDashoffset: "0", opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "0" },
        },
        nudge: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(-7px, 5px)" },
        },
        packet: {
          "0%": { transform: "translateX(0)", opacity: "0" },
          "15%, 85%": { opacity: "1" },
          "100%": { transform: "translateX(18px)", opacity: "0" },
        },
        rise: {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "15%": { opacity: "1" },
          "70%": { opacity: "0.7" },
          "100%": { transform: "translateY(-90px)", opacity: "0" },
        },
        halo: {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "70%, 100%": { transform: "scale(1.15, 1.45)", opacity: "0" },
        },
        shine: {
          "0%": { transform: "translateX(-120%)" },
          "55%, 100%": { transform: "translateX(320%)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        signal: {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(3.3)", opacity: "0" },
        },
        // The envelope's arc from the table into the mailbox door.
        letter: {
          "0%": { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: "1" },
          "45%": { transform: "translate(34px, -86px) rotate(-12deg) scale(0.72)" },
          "80%": { transform: "translate(84px, -50px) rotate(6deg) scale(0.38)", opacity: "1" },
          "100%": { transform: "translate(96px, -42px) rotate(0deg) scale(0.12)", opacity: "0" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        // A failed send: the envelope flies up to the door, the mailbox goes up
        // in flames and the letter burns to ash in front of it.
        "letter-burn": {
          "0%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          "45%": { transform: "translate(34px, -86px) rotate(-12deg) scale(0.72)" },
          "100%": { transform: "translate(80px, -40px) rotate(4deg) scale(0.5)" },
        },
        char: {
          "0%": { filter: "none", transform: "none", opacity: "1" },
          "30%": { filter: "sepia(1) saturate(4) hue-rotate(-20deg) brightness(0.9)" },
          "65%": {
            filter: "sepia(0.6) brightness(0.25)",
            transform: "scale(0.92) rotate(-3deg)",
            opacity: "1",
          },
          "100%": {
            filter: "brightness(0)",
            transform: "translateY(14px) scale(0.4) rotate(8deg)",
            opacity: "0",
          },
        },
        ignite: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        flare: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "15%, 80%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.2)", opacity: "0" },
        },
        flicker: {
          "0%, 100%": { transform: "scale(1, 1)" },
          "25%": { transform: "scale(0.94, 1.08)" },
          "50%": { transform: "scale(1.05, 0.92)" },
          "75%": { transform: "scale(0.97, 1.05)" },
        },
        smoke: {
          "0%": { transform: "translate(0, 0) scale(0.4)", opacity: "0" },
          "20%": { opacity: "0.55" },
          "100%": { transform: "translate(var(--tx), -70px) scale(1.8)", opacity: "0" },
        },
        ember: {
          "0%": { transform: "translate(0, 0)", opacity: "1" },
          "100%": { transform: "translate(var(--tx), var(--ty))", opacity: "0" },
        },
        ash: {
          "0%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translate(var(--tx), 56px) rotate(120deg)", opacity: "0" },
        },
        burst: {
          "0%": { transform: "translate(0, 0) scale(1)", opacity: "1" },
          "100%": { transform: "translate(var(--tx), var(--ty)) scale(0.2)", opacity: "0" },
        },
        appear: {
          from: { transform: "translateY(6px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        track: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
        // Hero background: a soft light band gliding across, and a warm flicker.
        heroSweep: {
          from: { transform: "translateX(-30%)" },
          to: { transform: "translateX(30%)" },
        },
        heroFlicker: {
          "0%, 100%": { opacity: "0.35" },
          "18%": { opacity: "0.5" },
          "37%": { opacity: "0.2" },
          "55%": { opacity: "0.55" },
          "74%": { opacity: "0.25" },
        },
        // Teammates' pointers wandering over the board.
        cursorA: {
          "0%, 100%": { transform: "translate(52px, 74px)" },
          "22%": { transform: "translate(150px, 128px)" },
          "46%": { transform: "translate(112px, 208px)" },
          "72%": { transform: "translate(226px, 152px)" },
        },
        cursorB: {
          "0%, 100%": { transform: "translate(250px, 196px)" },
          "26%": { transform: "translate(286px, 104px)" },
          "52%": { transform: "translate(176px, 62px)" },
          "78%": { transform: "translate(244px, 168px)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        float: "float 5s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.6s cubic-bezier(0.24, 0, 0.38, 1) infinite",
        "spin-slow": "spinSlow 20s linear infinite",
        ripple: "ripple 2.2s cubic-bezier(0.24, 0, 0.38, 1) infinite",
        sheen: "sheen 1.4s cubic-bezier(0.4, 0, 0.2, 1) both",
        drift: "drift 18s ease-in-out infinite alternate",
        progress: "progress 5s linear both",
        typing: "typing 1.2s ease-in-out infinite",
        draw: "draw 0.7s cubic-bezier(0.65, 0, 0.35, 1) both",
        stack: "stack 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        sweep: "sweep 1s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        type: "type 3s ease-out infinite both",
        blink: "blink 1s steps(1) infinite",
        bars: "bars 1.6s ease-in-out infinite",
        drop: "drop 2.6s ease-in infinite both",
        pop: "pop 2.6s ease-out infinite both",
        redraw: "redraw 3s ease-in-out infinite both",
        nudge: "nudge 3s ease-in-out infinite",
        packet: "packet 1.4s linear infinite both",
        trace: "draw 1.8s linear infinite",
        rise: "rise 7s ease-out infinite",
        halo: "halo 2.4s cubic-bezier(0.24, 0, 0.38, 1) infinite",
        shine: "shine 3.2s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        signal: "signal 5s cubic-bezier(0.22, 1, 0.36, 1) infinite",
        letter: "letter 1s cubic-bezier(0.45, 0, 0.25, 1) 0.25s both",
        bob: "bob 1.6s ease-in-out infinite",
        "letter-burn": "letter-burn 0.8s cubic-bezier(0.45, 0, 0.25, 1) 0.25s both",
        char: "char 1.5s ease-in 1.05s both",
        ignite: "ignite 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1s both",
        flare: "flare 1.6s ease-out 1s both",
        flicker: "flicker 0.6s ease-in-out infinite",
        smoke: "smoke 2.2s ease-out infinite both",
        ember: "ember 1.4s ease-out infinite both",
        ash: "ash 1.2s ease-in both",
        burst: "burst 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        appear: "appear 0.4s ease-out both",
        track: "track 1s ease-in-out infinite",
        // Alternating, so one full sweep there and back takes 28s.
        "hero-sweep": "heroSweep 14s ease-in-out infinite alternate",
        "hero-flicker": "heroFlicker 7s ease-in-out infinite",
        "cursor-a": "cursorA 11s ease-in-out infinite",
        "cursor-b": "cursorB 13s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
