import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";
import { montserrat } from "@/lib/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  title: {
    default: "Trigge Solutions | Website & Web App Development",
    template: "%s | Trigge Solutions",
  },
  description:
    "Custom websites, web applications and e-commerce platforms for businesses across the United States. Free consultation and a fixed written quote.",
  authors: [{ name: "Trigge Solutions", url: SITE_URL }],
  creator: "Trigge Solutions",
  publisher: "Trigge Solutions",
  category: "Software development",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Trigge Solutions",
    title: "Trigge Solutions | Website & Web App Development",
    description:
      "Custom websites, web applications and e-commerce platforms for businesses across the United States.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Trigge Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trigge Solutions | Website & Web App Development",
    description:
      "Custom websites, web applications and e-commerce platforms for businesses across the United States.",
    images: [OG_IMAGE],
  },
};

// The favicon comes from app/icon.png and app/apple-icon.png, which Next picks
// up by filename and links automatically — no `icons` entry needed here.
// Both are generated from public/images/favicon.png; resize from that master if
// the artwork changes, rather than dropping the full-size file in directly.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The hero's inline script sets data-intro on <html> before hydration.
    // data-scroll-behavior lets Next turn off the smooth scrolling from
    // globals.css during route changes, so new pages open at the top instantly.
    <html
      lang="en"
      // Montserrat is site-wide for the logo's wordmark (components/Logo.tsx).
      className={`${inter.variable} ${montserrat.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <PageTransition />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
