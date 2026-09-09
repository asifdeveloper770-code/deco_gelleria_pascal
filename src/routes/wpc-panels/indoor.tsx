// src/routes/wpc-panels/indoor.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

// Replace these placeholder items with your actual product image paths
const productGalleryImages = [
  { src: indoorImage, title: "Natural Oak Finish", category: "Living Room Accent" },
  { src: indoorImage, title: "Walnut Slat Wall", category: "Bedroom Backdrop" },
  { src: indoorImage, title: "Charcoal Grey Panel", category: "Commercial Lobby" },
  { src: indoorImage, title: "Teak Texture", category: "Kitchen Island Feature" },
  { src: indoorImage, title: "Warm Ash Slats", category: "Dining Area" },
  { src: indoorImage, title: "Modern Ebony", category: "Office Feature Wall" },
];

export function WpcIndoorPage() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    category: string;
  } | null>(null);

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

      {/* Product Gallery Section */}
      <section className="section-space border-t border-border bg-secondary/30">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Product showcase</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore WPC Indoor Finishes & Installations
            </h2>
            <p className="mt-3 text-muted-foreground">
              See how our slatted indoor wall panels bring depth, warm texture, and continuous architectural rhythm to living rooms, bedrooms, and commercial spaces.
            </p>
          </div>

          <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {productGalleryImages.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                onClick={() => setSelectedImage(item)}
                className="group cursor-pointer overflow-hidden border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[4/2] overflow-hidden bg-muted">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
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
                className="max-h-[70vh] w-auto object-contain"
              />
             
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CTA />
    </>
  );
}