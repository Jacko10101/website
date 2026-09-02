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
import { roles, education, knowsAbout } from "@/lib/experience";
import { profile } from "@/lib/profile";

// One description for the document, OpenGraph and Twitter cards, so the
// availability line cannot drift between them.
const description = `Platform engineer for AI systems. Production LLM infrastructure on Kubernetes: gateway, guardrails, GitOps and observability. ${profile.availability.sentence} Irish and British citizen, no sponsorship needed.`;

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
    default: "Jack Devlin · Platform & AI Infrastructure Engineer",
    template: "%s · Jack Devlin",
  },
  description,
  keywords: [
    "AI Infrastructure",
    "AI Platform Engineer",
    "MLOps Engineer",
    "Platform Engineer",
    "LLM Gateway",
    "SRE",
    "Kubernetes",
    "ArgoCD",
    "GitOps",
    "Observability",
    "Heimdall",
    "Clarity",
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
    title: "Jack Devlin · Platform & AI Infrastructure Engineer",
    description,
    url: "https://devlinops.com",
    siteName: "Jack Devlin",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jack Devlin · Platform & AI Infrastructure Engineer",
    description,
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
        "@type": "ProfilePage",
        "@id": "https://devlinops.com/#profilepage",
        "url": "https://devlinops.com",
        "name": "Jack Devlin · Platform & AI Infrastructure Engineer",
        "mainEntity": { "@id": "https://devlinops.com/#person" },
      },
      {
        "@type": "Person",
        "@id": "https://devlinops.com/#person",
        "name": "Jack Devlin",
        "jobTitle": "Platform & Site Reliability Engineer",
        "url": "https://devlinops.com",
        "email": "jack@devlinops.com",
        "image": "https://devlinops.com/jack-photo.jpg",
        "nationality": ["Irish", "British"],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "GB",
          "addressRegion": "Northern Ireland",
        },
        "worksFor": roles
          .filter((role) => role.endDate === null)
          .map((role) => ({
            "@type": "Organization",
            "name": role.company,
          })),
        "alumniOf": [...new Set(education.map((item) => item.institution))].map(
          (name) => ({ "@type": "CollegeOrUniversity", "name": name })
        ),
        "hasCredential": education.map((item) => ({
          "@type": "EducationalOccupationalCredential",
          "name": item.result ? `${item.award}, ${item.result}` : item.award,
          "credentialCategory": "degree",
          "recognizedBy": {
            "@type": "CollegeOrUniversity",
            "name": item.institution,
          },
        })),
        "sameAs": [
          "https://github.com/Jacko10101",
        ],
        "knowsAbout": knowsAbout,
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Platform & Site Reliability Engineer",
          "skills": knowsAbout.join(", "),
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
        "name": "Devlinops Ltd",
        "url": "https://devlinops.com",
        "description":
          "Devlinops Ltd is the limited company Jack Devlin contracts through. Platform and AI infrastructure engineering: Kubernetes, GitOps, CI/CD, observability and LLM gateways.",
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
