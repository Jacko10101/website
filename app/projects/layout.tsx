import { MotionProvider } from "@/components/motion-provider";

/**
 * Every framer-motion exhibit on the site lives under /projects (the
 * demos, tracers and typed terminals). This is where the reduced-motion
 * config wraps them, so the library is not on routes that never animate.
 * No metadata here: a title set in this layout would replace the root
 * template for the whole subtree, which is how the case studies once lost
 * their "· Jack Devlin" suffix.
 */
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
