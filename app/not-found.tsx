import type { Metadata } from "next";
import { NotFoundClient } from "@/components/not-found-client";
import { MotionProvider } from "@/components/motion-provider";

// The crashed-pod page needs the client for its restart counter, and a
// client component cannot carry metadata. This shell exists so the tab
// says "Not found" instead of the homepage title.
export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

export default function NotFound() {
  // The typed terminal on this page uses framer; the provider keeps it
  // honouring reduced motion now that the root layout no longer wraps it.
  return (
    <MotionProvider>
      <NotFoundClient />
    </MotionProvider>
  );
}
