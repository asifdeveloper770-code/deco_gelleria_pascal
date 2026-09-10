import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CTA, PageIntro, ProductShowcase } from "@/components/content-blocks";
import outdoorImage from "@/assets/outdoor.png";
import { Loader2, Package } from "lucide-react";

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
  } | null;
}

export function WpcOutdoorPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from Supabase database
 // Fetch ONLY Outdoor Products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["outdoor_wpc_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories!inner(name, slug)")
        .ilike("categories.name", "%outdoor%") // Matches "Outdoor", "WPC Outdoor", etc.
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

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

      {/* Dynamic Product Gallery Section */}
      <section className="section-space border-t border-border bg-secondary/30">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Product showcase</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore WPC Outdoor Finishes & Cladding
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover weather-engineered outdoor wall solutions designed for maximum durability, architectural distinction, and zero maintenance.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-10 flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="mt-10 p-4 text-center text-sm text-destructive">
              Failed to load product catalog.
            </div>
          ) : products.length === 0 ? (
            <div className="mt-10 flex h-48 flex-col items-center justify-center text-center">
              <Package className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No outdoor products found in database.</p>
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
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {product.categories.name}
                      </p>
                    )}
                    <h3 className="mt-1 text-sm font-bold text-foreground">{product.name}</h3>
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
          {/* <DialogTitle className="sr-only">
            {selectedProduct?.name || "Product Image Preview"}
          </DialogTitle> */}
          {selectedProduct?.image && (
            <div className="flex flex-col items-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="max-h-[70vh] w-auto object-contain"
              />
              {/* <div className="w-full border-t border-border bg-card p-4">
                <h4 className="text-base font-bold text-foreground">{selectedProduct.name}</h4>
                {selectedProduct.description && (
                  <p className="mt-1 text-xs text-muted-foreground">{selectedProduct.description}</p>
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