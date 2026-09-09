// src/routes/wpc-panels/acoustic.tsx
import { createFileRoute } from "@tanstack/react-router";
import { CTA, PageIntro, ProductShowcase } from "@/components/content-blocks";
import acousticImage from "@/assets/deco-hero.jpg";
import { GalleryPage } from "@/components/pages";

export const Route = createFileRoute("/wpc-panels/acoustic")({
  head: () => ({
    meta: [
      { title: "MDF Acoustic Panels Los Angeles | Deco Galleria" },
      {
        name: "description",
        content:
          "Sound-absorbing MDF acoustic panels designed to reduce echoes and reverberation in recording studios, home theaters, and offices.",
      },
      { property: "og:title", content: "MDF Acoustic Panels | Deco Galleria" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AcousticPage,
});

export function AcousticPage() {
  return (
    <>
      <PageIntro
        eyebrow="Acoustic Collection"
        title="MDF Acoustic Panels"
        text="Engineered sound-absorbing panels made from Medium-Density Fiberboard (MDF). Specifically designed to reduce echoes and reverberation in any room by trapping sound waves."
      />

      <ProductShowcase
        eyebrow="Sound Control & Elegance"
        title="Superior sound absorption by design"
        description="Crafted by compressing wood fibers with resin and wax, featuring engineered grooves and patterns that prevent sound waves from reflecting back into the room."
        image={acousticImage}
        alt="Slatted MDF acoustic panels installed on a feature wall"
        specs={[
          "Size: 23.62″ W × 94.49″ H × 0.82″ D",
          "Dense engineered MDF core",
          "Traps sound waves & dampens echo",
          "Ideal for studios, theaters & offices",
          "Sleek architectural slatted aesthetic",
        ]}
      />
      <GalleryPage/>

      {/* <CTA /> */}
    </>
  );
}