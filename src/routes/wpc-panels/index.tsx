import { createFileRoute } from "@tanstack/react-router";
import {
  CTA,
  FinishSelector,
  PageIntro,
  ProductShowcase,
} from "@/components/content-blocks";
import bedroomImage from "@/assets/wpc-bedroom.jpg";
import kitchenImage from "@/assets/wpc-kitchen.jpg";

export const Route = createFileRoute("/wpc-panels/")({
  head: () => ({
    meta: [
      { title: "WPC Panels Los Angeles | Deco Galleria" },
      {
        name: "description",
        content:
          "Explore indoor and outdoor WPC wall panels in modern natural wood finishes.",
      },
      { property: "og:title", content: "WPC Panels | Deco Galleria" },
      {
        property: "og:description",
        content: "Warm architectural panels with dependable performance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WpcPage,
});

export function WpcPage() {
  return (
    <>
      <PageIntro
        eyebrow="Indoor & outdoor"
        title="WPC panels that bring dimension to every surface."
        text="Wood-plastic composite panels pair the warmth of timber with dependable performance and a clean architectural rhythm."
      />
      <ProductShowcase
        eyebrow="Signature application"
        title="Natural texture, modern performance"
        description="Create calm bedroom backdrops, dramatic living room walls, tailored kitchen islands, and durable exterior details with easy-care slatted surfaces."
        image={bedroomImage}
        alt="Pale ash WPC panels in a bright bedroom"
        specs={[
          "Interior & exterior options",
          "Water and mold resistant",
          "Low maintenance",
          "Multiple wood finishes",
        ]}
      />
      <ProductShowcase
        eyebrow="Design flexibility"
        title="From quiet backdrop to focal point"
        description="Vertical profiles add height and rhythm while natural finishes coordinate easily with stone, plaster, glass, and greenery."
        image={kitchenImage}
        alt="Oak WPC panel kitchen island"
        specs={[
          "Residential & commercial",
          "Lightweight profiles",
          "Scratch-resistant options",
          "Easy to coordinate",
        ]}
        reverse
      />
      <FinishSelector />
      <CTA />
    </>
  );
}