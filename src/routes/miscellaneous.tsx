import { CTA, PageIntro } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, ShieldCheck, Truck, Ruler, Layers, Sparkles } from "lucide-react";
import accessoryImage from "@/assets/deco-galleria-logo.png";
import brushes from "@/assets/Brushed Metal Trim Profiles.jpg"
import corner from "@/assets/Corner Finishing Accents.jpg"
import custom from "@/assets/Custom Curved Trim Joints.jpg"
import hidden from "@/assets/Hidden Stainless Clip Assembly.jpg"
import panel from "@/assets/Panel Adhesive Application.jpg"
import surface from "@/assets/Surface Care Kit (1).jpg"
import { finished } from "stream";

export const Route = createFileRoute("/miscellaneous")({
  head: () => ({
    meta: [
      {
        title: "Installation Accessories & Specialty Products | Deco Galleria",
      },
      {
        name: "description",
        content: "Explore essential installation accessories, trim profiles, heavy-duty adhesives, and architectural trim hardware for WPC, Stone, and Marble installations.",
      },
      { property: "og:title", content: "Accessories & Specialty Products | Deco Galleria" },
      { property: "og:description", content: "Everything you need for a complete, professional wall panel or fencing installation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MiscellaneousPage,
});

// Category items list
const accessoriesList = [
  {
    title: "Heavy-Duty Construction Adhesives",
    category: "Mounting & Bonding",
    description: "High-tack, fast-curing polyurethane and silicone adhesives formulated specifically for bonding UV marble, WPC panels, and lightweight PU stone to drywall, concrete, or masonry.",
    specs: ["Fast green strength", "Non-sag formula", "Low VOC & low odor", "Indoor & outdoor rated"],
  },
  {
    title: "Aluminum & PVC Edge Trim Profiles",
    category: "Finishing Touches",
    description: "Sleek L-trim, J-channel, inner/outer corner joints, and division bars designed to hide panel cut edges and create crisp, modern architectural transitions.",
    specs: ["Matte Black, Brushed Gold, & Silver finishes", "8′ & 10′ length options", "Corrosion resistant"],
  },
  {
    title: "Hidden Stainless Steel Mounting Clips",
    category: "WPC & Panel Hardware",
    description: "Engineered clip-and-screw systems for slatted WPC indoor wall panels and outdoor fencing. Ensures uniform expansion gaps and a completely fastener-free visual surface.",
    specs: ["304 Stainless steel construction", "Includes self-tapping screws", "Packaged in 100-count boxes"],
  },
  {
    title: "UV Surface Cleaners & Protectants",
    category: "Care & Maintenance",
    description: "Specialized neutral-pH spray cleaners designed to wipe away dust, grease, and fingerprints from high-gloss UV marble sheets and textured PU stone without degrading protective coatings.",
    specs: ["Streak-free formula", "Safe for daily cleaning", "No harsh abrasive solvents"],
  },
];

const galleryImages = [
  { src: brushes, title: "Brushed Metal Trim Profiles", category: "Edge Trims" },
  { src: hidden, title: "Hidden Stainless Clip Assembly", category: "Hardware" },
  { src: panel, title: "Panel Adhesive Application", category: "Installation" },
  { src: corner, title: "Corner Finishing Accents", category: "Architectural Details" },
  { src: custom, title: "Custom Curved Trim Joints", category: "Specialty Profiles" },
  { src: surface, title: "Surface Care Kit", category: "Maintenance" },
];

const services = [
  {
    icon: CustomCuttingIcon,
    title: "Custom Cut-to-Size",
    description: "Precision panel and sheet cutting services available prior to delivery to accelerate site installation.",
  },
  {
    icon: ConsultingIcon,
    title: "Technical Consultation",
    description: "Expert guidance on substrate preparation, load specifications, and adhesive compatibility.",
  },
  {
    icon: DeliveryIcon,
    title: "Direct Site Delivery",
    description: "Flexible, direct-to-site job delivery across Southern California with protective crating.",
  },
];

export function MiscellaneousPage() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    category: string;
  } | null>(null);

  return (
    <>
      <PageIntro
        eyebrow="Hardware & Specialty Solutions"
        title="Accessories & Installation Essentials"
        text="Complete your architectural project with our professional-grade adhesives, perimeter trims, hidden mounting hardware, and surface maintenance products."
      />

      {/* Featured Accessories Grid */}
      <section className="section-space">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Professional Hardware & Materials</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything required for a flawless finish
            </h2>
            <p className="mt-3 text-muted-foreground">
              From concealed clips that hide fasteners to color-matched trim profiles, our accessory collection ensures long-lasting structural integrity and refined visual details.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {accessoriesList.map((item) => (
              <div
                key={item.title}
                className="flex flex-col justify-between border border-border bg-card p-6 shadow-sm"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Key Features
                  </p>
                  <ul className="grid grid-cols-2 gap-1.5">
                    {item.specs.map((spec) => (
                      <li key={spec} className="flex items-center text-xs text-muted-foreground">
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Services Banner */}
      <section className="border-y border-border bg-muted/40 py-12">
        <div className="site-container">
          <div className="grid gap-8 sm:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="flex flex-col items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary mb-4">
                  <service.icon />
                </div>
                <h3 className="text-lg font-bold text-foreground">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware & Application Gallery */}
      <section className="section-space">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Component Gallery</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Trims, Clips & Installation Details
            </h2>
            <p className="mt-3 text-muted-foreground">
              Inspect our high-precision trim channels, concealed fasteners, and accessory applications up close.
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

// Simple Helper Icon Components
function CustomCuttingIcon() {
  return <Ruler className="h-6 w-6" />;
}
function ConsultingIcon() {
  return <Wrench className="h-6 w-6" />;
}
function DeliveryIcon() {
  return <Truck className="h-6 w-6" />;
}