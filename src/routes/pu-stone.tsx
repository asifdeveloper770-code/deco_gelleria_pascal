import { CTA, FinishSelector, PageIntro, ProductShowcase } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import fenceImage from "@/assets/deco-hero.jpg";
import { Loader2, Package } from "lucide-react";

export const Route = createFileRoute("/pu-stone")({
  head: () => ({
    meta: [
      {
        title: "PU Stone Panels & Cladding | Deco Galleria",
      },
      {
        name: "description",
        content: "Durable, eco-friendly polyurethane stone panels designed to mimic natural stone without the weight or high installation cost.",
      },
      { property: "og:title", content: "PU Stone Panels | Deco Galleria" },
      { property: "og:description", content: "Ultra-realistic lightweight PU stone veneer panels for indoor and outdoor accent walls." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PuStonePage,
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

export function PuStonePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch ONLY PU Stone Category Products from Supabase
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["pu_stone_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories!inner(name, slug)")
        .ilike("categories.name", "%Fencing%") // Matches "PU Stone", "Stone", etc.
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  return (
    <>
      <PageIntro
        eyebrow="Exterior & Interior Stone Accent"
        title="PU Stone Panels"
        text="An ultra-lightweight polyurethane wall panel replicating authentic natural stone surfaces—delivering high-end architectural depth with effortless installation."
      />

      <ProductShowcase
        eyebrow="Key Facts & Benefits"
        title="Low-maintenance stone veneer built for any surface"
        description="California experiences high heat, dry spells, and coastal moisture. While heavy natural stone requires structural reinforcement, PU Stone panels are lightweight, completely waterproof, and resistant to UV fading."
        image={fenceImage}
        alt="Modern PU stone wall panel installation in natural finish"
        specs={[
          "15–20+ year expected lifespan",
          "Ultra-lightweight & high density PU foam",
          "Weather proof (resists rot, moisture, mold & termites)",
          "Eco-friendly & non-toxic materials",
          "UV resistant & waterproof construction",
          "Easy cleanup with just soap & water",
        ]}
      />

      <FinishSelector title="Explore stone tones & textures" />

      {/* Filtered PU Stone Product Gallery Section */}
      <section className="section-space border-t border-border bg-secondary/30">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Product showcase</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore PU Stone Panel Installations
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover how composite PU stone adds texture, clean architectural lines, and weather resistance to feature walls, fireplaces, and exterior facades.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-10 flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="mt-10 p-4 text-center text-sm text-destructive">
              Failed to load PU stone products.
            </div>
          ) : products.length === 0 ? (
            <div className="mt-10 flex h-48 flex-col items-center justify-center text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No PU stone category products found in database.
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
                  <div className="p-4">
                    {product.categories?.name && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {product.categories.name}
                      </p>
                    )}
                    <h3 className="mt-1 text-sm font-bold text-card-foreground">{product.name}</h3>
                    <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
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
              <div className="border-t border-border bg-background p-4">
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CTA />
    </>
  );
}