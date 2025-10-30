"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, MouseEvent } from "react";

export function TransitionLink({
  href,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Check if browser supports View Transitions
    if (!(document as any).startViewTransition) {
      return; // Let Next.js handle it normally
    }

    // Prevent default navigation
    e.preventDefault();

    // Start view transition
    (document as any).startViewTransition(() => {
      router.push(href.toString());
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
