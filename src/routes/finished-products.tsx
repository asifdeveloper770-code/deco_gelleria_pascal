import { CTA, PageIntro } from "@/components/content-blocks";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import showcaseImage from "@/assets/deco-galleria-logo.png";

type Category = "All" | "WPC Wall Panels" | "UV Marble Sheets" | "Outdoor Fencing" | "WPC Decking";

interface ProjectItem {
  id: string;
  title: string;
  category: Category;
  location: string;
  completionDate: string;
  sqft: string;
  image: string;
  description: string;
  highlights: string[];
}

const projects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Luxury Modern Living Accent Wall",
    category: "WPC Wall Panels",
    location: "Beverly Hills, CA",
    completionDate: "August 2026",
    sqft: "450 sq. ft.",
    image: showcaseImage,
    description: "Fluted walnut WPC wall panels paired with integrated warm LED strip channels to frame an ultra-thin TV mount setup.",
    highlights: ["Sound Dampening acoustic backing", "Hidden seam joint alignment", "Integrated LED channels"],
  },
  {
    id: "proj-2",
    title: "Commercial Hotel Lobby Reception Feature",
    category: "UV Marble Sheets",
    location: "Downtown Los Angeles, CA",
    completionDate: "July 2026",
    sqft: "1,200 sq. ft.",
    image: showcaseImage,
    description: "High-gloss Calacatta Gold UV marble sheets seamlessly wrapped around curved reception desks and main backdrops.",
    highlights: ["Zero grout line maintenance", "Scratch-resistant UV cap", "Fire-retardant B1 rating"],
  },
  {
    id: "proj-3",
    title: "Residential Poolside Patio Terrace",
    category: "WPC Decking",
    location: "Encino, CA",
    completionDate: "June 2026",
    sqft: "850 sq. ft.",
    image: showcaseImage,
    description: "Co-extruded composite decking in Teak with hidden fastener clip system and integrated step lighting.",
    highlights: ["Barefoot friendly & anti-slip", "Zero warping under high heat", "Sub-frame drainage system"],
  },
  {
    id: "proj-4",
    title: "Modern Minimalist Perimeter Privacy Barrier",
    category: "Outdoor Fencing",
    location: "Pasadena, CA",
    completionDate: "August 2026",
    sqft: "180 Linear ft.",
    image: showcaseImage,
    description: "Charcoal Slate composite fencing with aluminum posts creating a clean, modern security enclosure.",
    highlights: ["Wind load rated up to 90mph", "Termite & rot proof", "Dual-sided finish"],
  },
  {
    id: "proj-5",
    title: "Executive Conference Room Media Backdrop",
    category: "WPC Wall Panels",
    location: "Irvine, CA",
    completionDate: "May 2026",
    sqft: "320 sq. ft.",
    image: showcaseImage,
    description: "MDF acoustic slatted timber panels behind corporate teleconferencing displays for enhanced voice clarity.",
    highlights: ["NRC Sound Absorption Rating 0.85", "FSC-certified timber blend", "Fast tongue-and-groove install"],
  },
  {
    id: "proj-6",
    title: "Spa & Wellness Wet Room Wall Cladding",
    category: "UV Marble Sheets",
    location: "Newport Beach, CA",
    completionDate: "June 2026",
    sqft: "600 sq. ft.",
    image: showcaseImage,
    description: "Nero Marquina black marble pattern UV sheets installed in high-humidity shower and steam room enclosures.",
    highlights: ["100% Waterproof seal", "Mildew & mold resistant", "Easiest steam-clean maintenance"],
  },
];

const categories: Category[] = [
  "All",
  "WPC Wall Panels",
  "UV Marble Sheets",
  "Outdoor Fencing",
  "WPC Decking",
];

export const Route = createFileRoute("/finished-products")({
  head: () => ({
    meta: [
      {
        title: "Finished Installations Portfolio | Deco Galleria",
      },
      {
        name: "description",
        content: "Explore finished residential and commercial projects featuring WPC wall panels, UV marble sheets, outdoor fencing, and composite decking.",
      },
      { property: "og:title", content: "Finished Installations Portfolio | Deco Galleria" },
      { property: "og:description", content: "Explore completed projects showcasing Deco Galleria architectural materials in real spaces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinishedProductsPage,
});

// Private function component (no named export) allowing TanStack Router to split chunks properly
function FinishedProductsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <PageIntro
        eyebrow="Portfolio & Gallery"
        title="Finished Product Installations"
        text="Browse our gallery of completed residential and commercial spaces transformed using Deco Galleria WPC panels, UV marble sheets, composite fencing, and decking."
      />

      {/* Category Filter Tabs */}
      <section className="section-space">
        <div className="site-container">
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedProject(item)}
                className="group cursor-pointer overflow-hidden border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{item.location}</span>
                      <span className="font-semibold text-primary">{item.sqft}</span>
                    </div>
                    <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-border/50 bg-muted/20 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Completed {item.completionDate}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {selectedProject && (
            <div>
              <div className="relative bg-black">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="max-h-[60vh] w-full object-contain mx-auto"
                />
              </div>

              <div className="p-6 bg-background border-t border-border">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded">
                    {selectedProject.category}
                  </span>
                  <span>{selectedProject.location} • {selectedProject.sqft}</span>
                </div>

                <DialogTitle className="text-xl font-bold">
                  {selectedProject.title}
                </DialogTitle>

                <DialogDescription className="mt-3 text-sm text-foreground leading-relaxed">
                  {selectedProject.description}
                </DialogDescription>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Key Project Features
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground">
                    {selectedProject.highlights.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <CTA />
    </>
  );
}