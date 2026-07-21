import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { KonamiCode } from "@/components/konami-code";
import { ChaosMode } from "@/components/chaos-mode";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CliNavigation } from "@/components/cli-navigation";
import { BackToTop } from "@/components/back-to-top";
import { MotionProvider } from "@/components/motion-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devlinops.com"),
  title: {
    default: "Jack Devlin — Platform Engineer",
    template: "%s — Jack Devlin",
  },
  description:
    "Platform engineer. Kubernetes, GitOps, CI/CD and observability infrastructure, increasingly for AI workloads. Available from September 2026 — contract or full-time, remote-first, open to relocation.",
  keywords: [
    "Platform Engineer",
    "MLOps Engineer",
    "AI Infrastructure",
    "SRE",
    "Kubernetes",
    "GPU Scheduling",
    "PyTorch",
    "ArgoCD",
    "GitOps",
    "Observability",
    "Heimdall",
    "B2B Contractor",
    "Outside IR35",
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
      "Platform engineer. Kubernetes, GitOps and observability infrastructure, increasingly for AI workloads. Available from September 2026 — contract or full-time, remote-first, open to relocation.",
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
      "Platform engineer. Kubernetes, GitOps and observability infrastructure, increasingly for AI workloads. Available from September 2026 — contract or full-time, remote-first, open to relocation.",
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
          "MLOps",
          "AI Infrastructure",
          "Site Reliability Engineering",
          "Kubernetes",
          "GPU Scheduling on Kubernetes",
          "ArgoCD",
          "GitOps",
          "Observability",
          "Prometheus",
          "Grafana",
          "AWS",
          "PyTorch",
          "Python",
          "CI/CD",
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Platform Engineer",
          "skills":
            "Kubernetes, MLOps, GPU scheduling, AWS, ArgoCD, GitOps, CI/CD, Observability, Python, PyTorch",
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
      {
        "@type": "ProfessionalService",
        "@id": "https://devlinops.com/#service",
        "name": "DevlinOps",
        "url": "https://devlinops.com",
        "description":
          "Independent platform & MLOps engineering for teams running AI workloads and distributed systems — Kubernetes, GPU scheduling, GitOps, CI/CD and observability.",
        "provider": {
          "@id": "https://devlinops.com/#person",
        },
        "areaServed": {
          "@type": "Place",
          "name": "Remote · worldwide",
        },
        "availableLanguage": "en",
        "serviceType": [
          "Platform Engineering",
          "MLOps",
          "AI Infrastructure",
          "Site Reliability Engineering",
          "GitOps & CI/CD",
          "Observability",
        ],
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
        <Script
          defer
          data-domain="devlinops.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:font-semibold"
        >
          Skip to content
        </a>
        <MotionProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer />
          </div>
          <SmoothScroll />
          <KonamiCode />
          <ChaosMode />
          <CliNavigation />
          <BackToTop />
        </MotionProvider>
      </body>
    </html>
  );
}
