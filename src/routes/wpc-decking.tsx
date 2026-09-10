import { CTA, FinishSelector, PageIntro, ProductShowcase } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import deckingImage from "@/assets/decking.jpg";
import { Loader2, Package } from "lucide-react";

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

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category_id?: string | null;
  categories?: {
    name: string;
    slug: string;
  } | null;
}

export function WpcDeckingPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch ONLY Decking Category Products from Supabase
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["wpc_decking_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories!inner(name, slug)")
        .ilike("categories.name", "%decking%") // Matches "Decking", "WPC Decking", etc.
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

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

      {/* Filtered Decking Product Gallery Section */}
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

          {isLoading ? (
            <div className="mt-10 flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="mt-10 p-4 text-center text-sm text-destructive">
              Failed to load WPC decking products.
            </div>
          ) : products.length === 0 ? (
            <div className="mt-10 flex h-48 flex-col items-center justify-center text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No WPC decking category products found in database.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => product.image && setSelectedProduct(product)}
                  className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  {/* <div className="p-4">
                    {product.categories?.name && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {product.categories.name}
                      </p>
                    )}
                    <h3 className="mt-1 text-sm font-bold text-card-foreground">{product.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {selectedProduct && (
            <div>
              <img
                src={selectedProduct.image || ""}
                alt={selectedProduct.name}
                className="mx-auto max-h-[70vh] w-auto object-contain"
              />
              {/* <div className="border-t border-border bg-background p-4">
                <DialogTitle className="text-lg font-bold">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs text-muted-foreground">
                  {selectedProduct.categories?.name} • ${Number(selectedProduct.price).toFixed(2)}
                </DialogDescription>
                {selectedProduct.description && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {selectedProduct.description}
                  </p>
                )}
              </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CTA />
    </>
  );
}