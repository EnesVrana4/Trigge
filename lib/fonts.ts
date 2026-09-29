import { JetBrains_Mono, Manrope, Montserrat } from "next/font/google";

// Fonts of the approved hero and intro design: Manrope for the hero copy,
// Montserrat for the wordmark, eyebrow and loader words, JetBrains Mono for the
// loader's counter. The hero applies all three; Montserrat is also set on
// <html> in app/layout.tsx, for the logo's wordmark on every page.

export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const heroFontVars = `${manrope.variable} ${montserrat.variable} ${jetbrainsMono.variable}`;
