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
    // @ts-expect-error - View Transitions API is not yet in TypeScript DOM types
    if (!document.startViewTransition) {
      return; // Let Next.js handle it normally
    }

    // Prevent default navigation
    e.preventDefault();

    // Start view transition
    // @ts-expect-error - View Transitions API is not yet in TypeScript DOM types
    document.startViewTransition(() => {
      router.push(href.toString());
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
