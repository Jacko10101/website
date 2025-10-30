import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { KonamiCode } from "@/components/konami-code";
import { CliNavigation } from "@/components/cli-navigation";

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
  return (
    <html lang="en" suppressHydrationWarning className="view-transition">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
