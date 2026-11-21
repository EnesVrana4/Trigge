import localFont from "next/font/local";

// Self-hosted Google Fonts (Manrope, Montserrat, JetBrains Mono) via next/font/local
// so builds never fail due to Google Fonts API URL format changes on Vercel.

export const manrope = localFont({
  src: "../app/fonts/manrope-latin.woff2",
  weight: "500 700",
  variable: "--font-manrope",
  display: "swap",
});

export const montserrat = localFont({
  src: "../app/fonts/montserrat-latin.woff2",
  weight: "600 700",
  variable: "--font-montserrat",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "../app/fonts/jetbrains-mono-latin.woff2",
  weight: "400",
  variable: "--font-jetbrains",
  display: "swap",
});

export const heroFontVars = `${manrope.variable} ${montserrat.variable} ${jetbrainsMono.variable}`;
