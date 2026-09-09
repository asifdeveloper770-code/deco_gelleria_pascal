// src/routes/wpc-panels/indoor.tsx
import { createFileRoute } from "@tanstack/react-router";
import { CTA, PageIntro, ProductShowcase } from "@/components/content-blocks";
import indoorImage from "@/assets/deco-galleria-logo.png";

export const Route = createFileRoute("/wpc-panels/indoor")({
  head: () => ({
    meta: [
      { title: "WPC Indoor Panels Los Angeles | Deco Galleria" },
      {
        name: "description",
        content:
          "Explore over 19 colors of durable, low-maintenance indoor WPC wall panels for residential and commercial spaces.",
      },
      { property: "og:title", content: "WPC Indoor Panels | Deco Galleria" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: WpcIndoorPage,
});

export function WpcIndoorPage() {
  return (
    <>
      <PageIntro
        eyebrow="Interior Collection"
        title="WPC Indoor Panels"
        text="WPC is a great choice for residential or commercial use. We have over 19 different colors to select from. If you are looking for durability, low maintenance, and an amazing look, this is your product! Easy to install with glue and mounting clips."
      />

      <ProductShowcase
        eyebrow="Interior Applications"
        title="Durable, stylish, and easy to install"
        description="Made from wood fibers and thermoplastic polymers, these panels offer an incredible natural timber look with modern high-performance engineering."
        image={indoorImage}
        alt="Interior WPC wall panels featured in a modern space"
        specs={[
          "Size: 6.5″ × 114″ panels",
          "Termite & mold proof",
          "Environmentally friendly",
          "Easy to cut to size",
          "Glue & mounting clips (sold separately)",
          "Low maintenance care",
        ]}
      />

      <CTA />
    </>
  );
}