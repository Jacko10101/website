import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { KonamiCode } from "@/components/konami-code";
import { CliNavigation } from "@/components/cli-navigation";
import { BackToTop } from "@/components/back-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://devlinops.com"),
  title: {
    default: "Jack Devlin — Platform Engineer",
    template: "%s — Jack Devlin",
  },
  description:
    "Platform engineer. Heimdall (deployment intelligence), GitOps, observability. Open to roles for summer 2026.",
  keywords: [
    "Platform Engineer",
    "SRE",
    "DevOps",
    "Kubernetes",
    "ArgoCD",
    "GitOps",
    "Observability",
    "Heimdall",
    "Jack Devlin",
  ],
  authors: [{ name: "Jack Devlin" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title: "Jack Devlin — Platform Engineer",
    description:
      "Platform engineer. Heimdall (deployment intelligence), GitOps, observability. Open to roles for summer 2026.",
    url: "https://devlinops.com",
    siteName: "Jack Devlin",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jack Devlin — Platform Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jack Devlin — Platform Engineer",
    description:
      "Platform engineer. Heimdall (deployment intelligence), GitOps, observability. Open to roles for summer 2026.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://devlinops.com/#person",
        "name": "Jack Devlin",
        "jobTitle": "Platform Engineer",
        "url": "https://devlinops.com",
        "email": "jack@devlinops.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "GB",
        },
        "sameAs": [
          "https://github.com/Jacko10101",
          "https://linkedin.com/in/jack-devlin-5a0902148",
        ],
        "knowsAbout": [
          "Platform Engineering",
          "Site Reliability Engineering",
          "Kubernetes",
          "ArgoCD",
          "GitOps",
          "Observability",
          "Prometheus",
          "Grafana",
          "AWS",
          "CI/CD",
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Platform Engineer",
          "skills":
            "Kubernetes, AWS, ArgoCD, GitOps, CI/CD, Observability, Python",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://devlinops.com/#website",
        "url": "https://devlinops.com",
        "name": "Jack Devlin",
        "publisher": {
          "@id": "https://devlinops.com/#person",
        },
      },
    ],
  };

  return (
    <html lang="en" className="dark view-transition">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <KonamiCode />
        <CliNavigation />
        <BackToTop />
      </body>
    </html>
  );
}
