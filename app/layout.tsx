import { getSiteUrl } from "@/lib/site-url";
import FirebaseAnalytics from "@/components/firebase-analytics";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const poppins = localFont({
  src: "../public/fonts/Poppins.ttf",
  variable: "--font-poppins",
  weight: "400",
  style: "normal",
  display: "swap",
});

const coolvetica = localFont({
  src: "../public/fonts/coolvetica.ttf",
  variable: "--font-coolvetica",
  weight: "400",
  style: "normal",
  display: "swap",
});

const cyrene = localFont({
  src: "../public/fonts/cyrene.otf",
  variable: "--font-cyrene",
  weight: "400",
  style: "normal",
  display: "swap",
});

const siteUrl = getSiteUrl();
const siteName = "Isla Glass";
const siteTitle = "Isla Glass | Coming Soon";
const siteDescription =
  "Isla Glass is preparing a refined digital platform for residential and commercial impact windows and doors inspired by the Gulf Coast.";
const socialPreviewVersion = "20260410";
const socialPreviewUrl = `${siteUrl}/og-image.png?v=${socialPreviewVersion}`;
const socialPreview = {
  url: socialPreviewUrl,
  secureUrl: socialPreviewUrl,
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "Isla Glass preview card for impact windows and doors on the Gulf Coast.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
    images: [socialPreview],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialPreviewUrl],
  },
  keywords: [
    "Isla Glass",
    "impact windows",
    "impact doors",
    "residential glazing",
    "commercial glazing",
    "Gulf Coast",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${coolvetica.variable} ${cyrene.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans text-[var(--foreground)]">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
