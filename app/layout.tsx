import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { KonamiCode } from "@/components/konami-code";
import { CliNavigation } from "@/components/cli-navigation";
import { BackToTop } from "@/components/back-to-top";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevlinOps | Expert DevOps & Platform Engineering Consulting",
  description: "Enterprise-grade Kubernetes, observability, GitOps, and CI/CD solutions. Scale your infrastructure with confidence.",
  keywords: ["DevOps", "Kubernetes", "AWS", "EKS", "Platform Engineering", "GitOps", "ArgoCD", "Observability"],
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
    title: "DevlinOps | Expert DevOps & Platform Engineering Consulting",
    description: "Enterprise-grade Kubernetes, observability, GitOps, and CI/CD solutions.",
    url: "https://devlinops.com",
    siteName: "DevlinOps",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevlinOps - Platform Engineering Excellence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevlinOps | Expert DevOps & Platform Engineering Consulting",
    description: "Enterprise-grade Kubernetes, observability, GitOps, and CI/CD solutions.",
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
        "jobTitle": "Platform Engineer & Kubernetes Specialist",
        "url": "https://devlinops.com",
        "knowsAbout": [
          "Kubernetes",
          "Platform Engineering",
          "AWS",
          "ArgoCD",
          "DevOps",
          "GitOps",
          "Observability",
          "Prometheus",
          "Grafana",
          "Terraform",
          "CI/CD"
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Platform Engineer",
          "skills": "Kubernetes, AWS EKS, ArgoCD, Terraform, CI/CD, Observability, GitOps"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://devlinops.com/#organization",
        "name": "DevlinOps",
        "url": "https://devlinops.com",
        "logo": "https://devlinops.com/logo.png",
        "description": "Expert DevOps and Platform Engineering consulting specialising in Kubernetes, observability, GitOps, and CI/CD solutions.",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "GB"
        },
        "founder": {
          "@id": "https://devlinops.com/#person"
        },
        "areaServed": "Worldwide",
        "serviceType": [
          "Platform Engineering",
          "Kubernetes Consulting",
          "DevOps Consulting",
          "Cloud Infrastructure",
          "Observability Stack Implementation",
          "GitOps & CI/CD Pipeline Modernisation"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://devlinops.com/#website",
        "url": "https://devlinops.com",
        "name": "DevlinOps",
        "publisher": {
          "@id": "https://devlinops.com/#organization"
        }
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className="view-transition">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <KonamiCode />
          <CliNavigation />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
