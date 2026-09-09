import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/pages";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Deco Galleria | Wall Panels & Design Materials" },
    { name: "description", content: "WPC panels, PU stone, and UV marble sheets for Los Angeles and Orange County projects." },
    { property: "og:title", content: "Deco Galleria | Styling Your Space" },
    { property: "og:description", content: "Modern interior and exterior materials from our Sun Valley showroom." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});
