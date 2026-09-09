import { CTA, FinishSelector, PageIntro, ProductShowcase } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import marbleImage from "@/assets/uv-marble.jpg";

export const Route = createFileRoute("/uv-marble")({
  head: () => ({
    meta: [
      {
        title: "UV Marble Sheets | Deco Galleria",
      },
      {
        name: "description",
        content: "Durable, cost-effective UV marble sheets for modern interior walls and surfaces.",
      },
      { property: "og:title", content: "UV Marble Sheets | Deco Galleria" },
      { property: "og:description", content: "Seamless slab visuals with easy-clean, water-resistant UV protection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Fence,
});

const productGalleryImages = [
  { src: marbleImage, title: "Calacatta Gold", category: "Living Room Feature Wall" },
  { src: marbleImage, title: "Statuario Venato", category: "Bathroom Surround" },
  { src: marbleImage, title: "Nero Marquina", category: "Commercial Reception" },
  { src: marbleImage, title: "Carrara White", category: "Kitchen Splashback" },
  { src: marbleImage, title: "Pietra Grey", category: "Dining Area Feature" },
  { src: marbleImage, title: "Emperador Light", category: "Executive Office Wall" },
];

export function Fence() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    category: string;
  } | null>(null);

  return (
    <>
      <PageIntro
        eyebrow="Seamless surfaces"
        title="UV Marble Sheets"
        text="A decorative panel made from PVC or acrylic, designed to mimic the appearance of real marble with a special UV-protective coating. A durable, cost-effective alternative to natural marble for feature walls, countertops, and interior surfaces."
      />

      <ProductShowcase
        eyebrow="Refined simplicity"
        title="A polished slab look, beautifully resolved"
        description="Resistant to scratches, moisture, and discoloration, UV marble sheets provide the luxurious visual flow of large-format stone with easier installation and minimal maintenance for homes and businesses."
        image={marbleImage}
        alt="Bright interior feature wall clad in UV marble sheets"
        specs={[
          "Standard size: 4′ × 8′ panels",
          "100% environmentally friendly",
          "UV resistant & color stability",
          "Water resistant & termite proof",
          "Easy to cut to size & install",
          "Durable, long-lasting & easy to clean",
          "Many designs available",
        ]}
      />

      <FinishSelector title="Compare marble looks" />

      {/* Product Gallery Section */}
      <section className="section-space border-t border-border bg-secondary/30">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Product showcase</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore UV Marble Finishes & Installations
            </h2>
            <p className="mt-3 text-muted-foreground">
              See how our UV marble sheets deliver continuous, large-format stone elegance across luxury residential and high-traffic commercial spaces.
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