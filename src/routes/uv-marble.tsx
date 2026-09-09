import { CTA, FinishSelector, PageIntro, ProductShowcase } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import marbleImage from "@/assets/uv-marble.jpg";
import { Loader2, Package } from "lucide-react";

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
  component: UvMarblePage,
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

export function UvMarblePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch ONLY UV Marble Category Products from Supabase
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["uv_marble_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories!inner(name, slug)")
        .ilike("categories.name", "%marble%") // Matches "UV Marble", "Marble Sheets", etc.
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

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

      {/* Filtered UV Marble Product Gallery Section */}
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

          {isLoading ? (
            <div className="mt-10 flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="mt-10 p-4 text-center text-sm text-destructive">
              Failed to load UV marble products.
            </div>
          ) : products.length === 0 ? (
            <div className="mt-10 flex h-48 flex-col items-center justify-center text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No UV marble category products found in database.
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