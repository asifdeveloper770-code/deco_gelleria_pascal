import { CTA, PageIntro } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import projectImage from "@/assets/deco-galleria-logo.png";

export const Route = createFileRoute("/before-and-after")({
  head: () => ({
    meta: [
      {
        title: "Before & After Transformations | Deco Galleria",
      },
      {
        name: "description",
        content: "Explore real project transformations featuring WPC indoor panels, outdoor fencing, UV marble sheets, and composite decking.",
      },
      { property: "og:title", content: "Before & After Transformations | Deco Galleria" },
      { property: "og:description", content: "See how Deco Galleria architectural materials redefine residential and commercial spaces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BeforeAndAfterPage,
});

const transformations = [
  {
    id: "living-room-wpc",
    title: "Living Room Feature Wall Revamp",
    location: "Beverly Hills, CA",
    material: "WPC Indoor Panels (Walnut)",
    beforeDesc: "Dated, plain painted drywall with visible cables and dull ambient lighting.",
    afterDesc: "Warm, textured slatted wall with integrated LED accent lighting, hiding media cabling and adding architectural depth.",
    beforeImg: projectImage,
    afterImg: projectImage,
  },
  {
    id: "bathroom-uv-marble",
    title: "Master Suite Bathroom Remodel",
    location: "Pasadena, CA",
    material: "UV Marble Sheets (Calacatta Gold)",
    beforeDesc: "Strained grout lines, discolored ceramic tile, and moisture-damaged drywall corners.",
    afterDesc: "Seamless, high-gloss floor-to-ceiling marble visual with zero grout lines and 100% waterproof protection.",
    beforeImg: projectImage,
    afterImg: projectImage,
  },
  {
    id: "patio-wpc-fencing",
    title: "Perimeter Privacy Fence Upgrade",
    location: "Glendale, CA",
    material: "WPC Outdoor Fencing (Charcoal Slate)",
    beforeDesc: "Weathered, splintered natural wood fence requiring annual painting and termite treatment.",
    afterDesc: "Ultra-clean horizontal composite barrier engineered to withstand California heat without fading or splitting.",
    beforeImg: projectImage,
    afterImg: projectImage,
  },
  {
    id: "backyard-decking",
    title: "Poolside Terrace Transformation",
    location: "Encino, CA",
    material: "WPC Composite Decking (Teak)",
    beforeDesc: "Cracked concrete patio slab that absorbed sun heat and became slippery when wet.",
    afterDesc: "Barefoot-friendly, slip-resistant composite decking elevated with hidden stainless steel clips.",
    beforeImg: projectImage,
    afterImg: projectImage,
  },
];

export function BeforeAndAfterPage() {
  const [selectedTransformation, setSelectedTransformation] = useState<typeof transformations[0] | null>(null);

  return (
    <>
      <PageIntro
        eyebrow="Real Project Results"
        title="Before & After Transformations"
        text="Witness the incredible difference our WPC wall panels, UV marble sheets, fencing, and decking make in real-world residential and commercial projects."
      />

      {/* Featured Interactive Comparison Hero Section */}
      <section className="section-space">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Interactive Spotlight</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Drag to see the transformation
            </h2>
            <p className="mt-3 text-muted-foreground">
              Move the slider left or right to compare raw wall surfaces with finished Deco Galleria installations.
            </p>
          </div>

          <div className="mt-8">
            <BeforeAfterSlider
              beforeImage={projectImage}
              afterImage={projectImage}
              beforeAlt="Plain drywall living room wall before WPC installation"
              afterAlt="Finished WPC slatted accent wall with ambient lighting"
            />
          </div>
        </div>
      </section>

      {/* Grid of Projects */}
      <section className="section-space border-t border-border bg-secondary/30">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="eyebrow">Case Studies</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Proven results across Southern California
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explore how property owners elevated modern aesthetics while reducing long-term surface maintenance.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {transformations.map((item) => (
              <div
                key={item.id}
                className="flex flex-col border border-border bg-card shadow-sm overflow-hidden"
              >
                {/* Side-by-side thumbnail previews */}
                <div
                  className="grid grid-cols-2 gap-0.5 bg-border cursor-pointer group relative"
                  onClick={() => setSelectedTransformation(item)}
                >
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={item.beforeImg}
                      alt={`${item.title} Before`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={item.afterImg}
                      alt={`${item.title} After`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      After
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{item.location}</span>
                      <span className="font-semibold text-primary">{item.material}</span>
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground">
                      {item.title}
                    </h3>

                    <div className="mt-4 space-y-3 text-xs leading-relaxed">
                      <div className="p-2.5 rounded bg-muted/50 border border-border/50">
                        <span className="font-bold text-destructive uppercase tracking-wide block mb-0.5">
                          Original State:
                        </span>
                        <p className="text-muted-foreground">{item.beforeDesc}</p>
                      </div>
                      <div className="p-2.5 rounded bg-primary/5 border border-primary/20">
                        <span className="font-bold text-primary uppercase tracking-wide block mb-0.5">
                          The Result:
                        </span>
                        <p className="text-foreground">{item.afterDesc}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTransformation(item)}
                    className="mt-6 text-xs font-bold uppercase tracking-wider text-primary hover:underline text-left"
                  >
                    View High-Res Comparison →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedTransformation} onOpenChange={() => setSelectedTransformation(null)}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          {selectedTransformation && (
            <div>
              <div className="grid grid-cols-2 gap-1 bg-black">
                <div className="relative">
                  <img
                    src={selectedTransformation.beforeImg}
                    alt={`${selectedTransformation.title} Before`}
                    className="max-h-[60vh] w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-black/80 text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                    Before
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={selectedTransformation.afterImg}
                    alt={`${selectedTransformation.title} After`}
                    className="max-h-[60vh] w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold uppercase px-2.5 py-1 rounded">
                    After
                  </span>
                </div>
              </div>

              <div className="p-6 bg-background border-t border-border">
                <DialogTitle className="text-xl font-bold">
                  {selectedTransformation.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {selectedTransformation.location} • {selectedTransformation.material}
                </DialogDescription>
                <p className="mt-3 text-sm text-foreground">
                  {selectedTransformation.afterDesc}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CTA />
    </>
  );
}

// Reusable Before / After Slider Component
function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
}: {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg border border-border select-none">
      {/* After Image (Background) */}
      <img src={afterImage} alt={afterAlt} className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded shadow">
        After
      </span>

      {/* Before Image (Clipped Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img src={beforeImage} alt={beforeAlt} className="absolute inset-0 h-full w-full object-cover" />
        <span className="absolute top-4 left-4 bg-black/80 text-white text-xs font-bold uppercase px-3 py-1 rounded shadow">
          Before
        </span>
      </div>

      {/* Slider Control Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-md text-xs">
          ↔
        </div>
      </div>

      {/* Invisible Range Input Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
      />
    </div>
  );
}