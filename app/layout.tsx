import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevlinOps | Expert DevOps & Platform Engineering Consulting",
  description: "Enterprise-grade Kubernetes, observability, GitOps, and CI/CD solutions. Scale your infrastructure with confidence.",
  keywords: ["DevOps", "Kubernetes", "AWS", "EKS", "Platform Engineering", "GitOps", "ArgoCD", "Observability"],
  authors: [{ name: "Jack Devlin" }],
  openGraph: {
    title: "DevlinOps | Expert DevOps & Platform Engineering Consulting",
    description: "Enterprise-grade Kubernetes, observability, GitOps, and CI/CD solutions.",
    url: "https://devlinops.com",
    siteName: "DevlinOps",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
