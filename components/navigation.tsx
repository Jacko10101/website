"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-24 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-4">
          <Image
            src="/logo.png"
            alt="DevlinOps Logo"
            width={56}
            height={56}
            className="rounded-xl"
            priority
          />
          <span className="text-2xl font-bold text-white tracking-tight">
            DevlinOps
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                  pathname === item.href
                    ? "text-green-400 bg-green-500/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-gray-700 flex items-center justify-center text-gray-400"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-gray-800">
          <div className="container px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-150",
                  pathname === item.href
                    ? "text-green-400 bg-green-500/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
