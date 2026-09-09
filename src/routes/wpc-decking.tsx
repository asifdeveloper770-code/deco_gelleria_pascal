import { CTA, FinishSelector, PageIntro, ProductShowcase } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import deckingImage from "@/assets/deco-galleria-logo.png";

export const Route = createFileRoute("/wpc-decking")({
  head: () => ({
    meta: [
      {
        title: "WPC Composite Decking Los Angeles | Deco Galleria",
      },
      {
        name: "description",
        content: "Durable, slip-resistant WPC composite decking boards built for patios, poolsides, and outdoor living spaces. Rot, splinter, and stain resistant.",
      },
      { property: "og:title", content: "WPC Outdoor Decking | Deco Galleria" },
      { property: "og:description", content: "Low-maintenance, weather-resistant composite decking engineered for long-lasting outdoor performance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WpcDeckingPage,
});

const galleryImages = [
  { src: deckingImage, title: "Teak Outdoor Patio Deck", category: "Residential Backyard" },
  { src: deckingImage, title: "Charcoal Poolside Decking", category: "Pool & Spa Enclosure" },
  { src: deckingImage, title: "Warm Walnut Terrace", category: "Rooftop Lounge" },
  { src: deckingImage, title: "Slate Grey Commercial Walkway", category: "Hospitality & Dining" },
  { src: deckingImage, title: "Natural Oak Balcony Deck", category: "Multi-Family Residence" },
  { src: deckingImage, title: "Weathered Ash Garden Pathway", category: "Outdoor Landscape" },
];

export function WpcDeckingPage() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    category: string;
  } | null>(null);

  return (
    <>
      <PageIntro
        eyebrow="Outdoor Flooring Solutions"
        title="WPC Outdoor Decking"
        text="Transform patios, terraces, and pool areas with high-performance Wood-Plastic Composite decking boards that deliver authentic timber character without splinters, warping, or seasonal staining."
      />

      <ProductShowcase
        eyebrow="Built for the Elements"
        title="Superior strength, slip-resistance, and zero maintenance"
        description="Crafted from a blend of recycled wood fibers and high-density polymers, our WPC decking boards resist harsh UV rays, heavy foot traffic, and water damage. Features co-extruded protective capping for maximum stain and scratch resistance."
        image={deckingImage}
        alt="Modern WPC composite deck installed on an outdoor patio"
        specs={[
          "25+ Year residential performance lifespan",
          "Slip-resistant textured surface",
          "Splinter-free & barefoot friendly",
          "Waterproof & mold/rot resistant",
          "Hidden fastener clip system compatible",
          "No painting, staining, or sealing required",
        ]}
      />

      <FinishSelector title="Explore decking colors & woodgrain finishes" />

      {/* Product Gallery Section */}
      <section className="section-space border-t border-border bg-secondary/30">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Product showcase</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore WPC Decking Installations
            </h2>
            <p className="mt-3 text-muted-foreground">
              See how our composite decking elevates outdoor living rooms, poolside retreats, and commercial hospitality spaces across California.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                onClick={() => setSelectedImage(item)}
                className="group cursor-pointer overflow-hidden border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {item.category}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-card-foreground">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {selectedImage && (
            <div>
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
              <div className="p-4 bg-background border-t border-border">
                <DialogTitle className="text-lg font-bold">
                  {selectedImage.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {selectedImage.category}
                </DialogDescription>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CTA />
    </>
  );
}