// src/routes/wpc-panels/outdoor.tsx
import { createFileRoute } from "@tanstack/react-router";
import { CTA, PageIntro, ProductShowcase } from "@/components/content-blocks";
import outdoorImage from "@/assets/pu-stone.jpg";
import { GalleryPage } from "@/components/pages";

export const Route = createFileRoute("/wpc-panels/outdoor")({
  head: () => ({
    meta: [
      { title: "WPC Outdoor Panels Los Angeles | Deco Galleria" },
      {
        name: "description",
        content:
          "Weather-resistant WPC outdoor panels for exterior cladding, siding, fencing, and garden features.",
      },
      { property: "og:title", content: "WPC Outdoor Panels | Deco Galleria" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: WpcOutdoorPage,
});

export function WpcOutdoorPage() {
  return (
    <>
      <PageIntro
        eyebrow="Exterior Collection"
        title="WPC Outdoor Panels"
        text="Popular for various exterior applications due to their durability, low maintenance, and resistance to weather elements. Commonly used for cladding, fencing, siding, and protective barriers."
      />

      <ProductShowcase
        eyebrow="Weatherproof Performance"
        title="Built for the elements"
        description="Resistant to moisture, rot, corrosion, UV rays, rain, and snow. Designed to maintain its vibrant finish without ever needing painting or staining."
        image={outdoorImage}
        alt="Exterior WPC panel cladding on modern building"
        specs={[
          "Size: 8.5″ W × 114″ L × 1″ H",
          "UV & moisture resistant",
          "Thermal insulation benefits",
          "Eco-friendly recycled materials",
          "Ideal for cladding, fencing & siding",
        ]}
      />
      <GalleryPage/>

      {/* <CTA /> */}
    </>
  );
}