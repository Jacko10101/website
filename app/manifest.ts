import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jack Devlin · devlinops",
    short_name: "devlinops",
    description: "Platform engineering, projects, and experiments by Jack Devlin.",
    start_url: "/",
    display: "browser",
    background_color: "#0c141b",
    theme_color: "#0c141b",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
