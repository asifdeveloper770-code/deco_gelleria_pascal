import { CTA, PageIntro } from "@/components/content-blocks";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import showcaseImage from "@/assets/deco-galleria-logo.png";
import newer from "@/assets/uv-marble.jpg";
import heroImage from "@/assets/deco-hero.jpg";
import bedroomImage from "@/assets/wpc-bedroom.jpg";
import kitchenImage from "@/assets/wpc-kitchen.jpg";
import stoneImage from "@/assets/pu-stone.jpg";
import marbleImage from "@/assets/uv-marble.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Category =
    | "All"
    | "WPC Wall Panels"
    | "UV Marble Sheets"
    | "Outdoor Fencing"
    | "WPC Decking";

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

interface TransformationItem {
    id: string;
    title: string;
    location: string;
    material: string;
    beforeDesc: string;
    afterDesc: string;
    beforeImg: string;
    afterImg: string;
}

const categories: Category[] = [
    "All",
    "WPC Wall Panels",
    "UV Marble Sheets",
    "Outdoor Fencing",
    "WPC Decking",
];

const projects: ProjectItem[] = [
    {
        id: "proj-1",
        title: "Luxury Modern Living Accent Wall",
        category: "WPC Wall Panels",
        location: "Beverly Hills, CA",
        completionDate: "August 2026",
        sqft: "450 sq. ft.",
        image: showcaseImage,
        description:
            "Fluted walnut WPC wall panels paired with integrated warm LED strip channels to frame an ultra-thin TV mount setup.",
        highlights: [
            "Sound Dampening acoustic backing",
            "Hidden seam joint alignment",
            "Integrated LED channels",
        ],
    },
    {
        id: "proj-2",
        title: "Commercial Hotel Lobby Reception Feature",
        category: "UV Marble Sheets",
        location: "Downtown Los Angeles, CA",
        completionDate: "July 2026",
        sqft: "1,200 sq. ft.",
        image: showcaseImage,
        description:
            "High-gloss Calacatta Gold UV marble sheets seamlessly wrapped around curved reception desks and main backdrops.",
        highlights: [
            "Zero grout line maintenance",
            "Scratch-resistant UV cap",
            "Fire-retardant B1 rating",
        ],
    },
    {
        id: "proj-3",
        title: "Residential Poolside Patio Terrace",
        category: "WPC Decking",
        location: "Encino, CA",
        completionDate: "June 2026",
        sqft: "850 sq. ft.",
        image: showcaseImage,
        description:
            "Co-extruded composite decking in Teak with hidden fastener clip system and integrated step lighting.",
        highlights: [
            "Barefoot friendly & anti-slip",
            "Zero warping under high heat",
            "Sub-frame drainage system",
        ],
    },
    {
        id: "proj-4",
        title: "Modern Minimalist Perimeter Privacy Barrier",
        category: "Outdoor Fencing",
        location: "Pasadena, CA",
        completionDate: "August 2026",
        sqft: "180 Linear ft.",
        image: showcaseImage,
        description:
            "Charcoal Slate composite fencing with aluminum posts creating a clean, modern security enclosure.",
        highlights: [
            "Wind load rated up to 90mph",
            "Termite & rot proof",
            "Dual-sided finish",
        ],
    },
    {
        id: "proj-5",
        title: "Executive Conference Room Media Backdrop",
        category: "WPC Wall Panels",
        location: "Irvine, CA",
        completionDate: "May 2026",
        sqft: "320 sq. ft.",
        image: showcaseImage,
        description:
            "MDF acoustic slatted timber panels behind corporate teleconferencing displays for enhanced voice clarity.",
        highlights: [
            "NRC Sound Absorption Rating 0.85",
            "FSC-certified timber blend",
            "Fast tongue-and-groove install",
        ],
    },
    {
        id: "proj-6",
        title: "Spa & Wellness Wet Room Wall Cladding",
        category: "UV Marble Sheets",
        location: "Newport Beach, CA",
        completionDate: "June 2026",
        sqft: "600 sq. ft.",
        image: showcaseImage,
        description:
            "Nero Marquina black marble pattern UV sheets installed in high-humidity shower and steam room enclosures.",
        highlights: [
            "100% Waterproof seal",
            "Mildew & mold resistant",
            "Easiest steam-clean maintenance",
        ],
    },
];

const transformations: TransformationItem[] = [
    {
        id: "living-room-wpc",
        title: "Living Room Feature Wall Revamp",
        location: "Beverly Hills, CA",
        material: "WPC Indoor Panels (Walnut)",
        beforeDesc:
            "Dated, plain painted drywall with visible cables and dull ambient lighting.",
        afterDesc:
            "Warm, textured slatted wall with integrated LED accent lighting, hiding media cabling and adding architectural depth.",
        beforeImg: showcaseImage,
        afterImg: showcaseImage,
    },
    {
        id: "bathroom-uv-marble",
        title: "Master Suite Bathroom Remodel",
        location: "Pasadena, CA",
        material: "UV Marble Sheets (Calacatta Gold)",
        beforeDesc:
            "Strained grout lines, discolored ceramic tile, and moisture-damaged drywall corners.",
        afterDesc:
            "Seamless, high-gloss floor-to-ceiling marble visual with zero grout lines and 100% waterproof protection.",
        beforeImg: showcaseImage,
        afterImg: showcaseImage,
    },
    {
        id: "patio-wpc-fencing",
        title: "Perimeter Privacy Fence Upgrade",
        location: "Glendale, CA",
        material: "WPC Outdoor Fencing (Charcoal Slate)",
        beforeDesc:
            "Weathered, splintered natural wood fence requiring annual painting and termite treatment.",
        afterDesc:
            "Ultra-clean horizontal composite barrier engineered to withstand California heat without fading or splitting.",
        beforeImg: showcaseImage,
        afterImg: showcaseImage,
    },
    {
        id: "backyard-decking",
        title: "Poolside Terrace Transformation",
        location: "Encino, CA",
        material: "WPC Composite Decking (Teak)",
        beforeDesc:
            "Cracked concrete patio slab that absorbed sun heat and became slippery when wet.",
        afterDesc:
            "Barefoot-friendly, slip-resistant composite decking elevated with hidden stainless steel clips.",
        beforeImg: showcaseImage,
        afterImg: showcaseImage,
    },
];

const gallery = [
    { category: "Living Room", image: heroImage, title: "Oak double-height wall" },
    { category: "Bedroom", image: bedroomImage, title: "Soft ash headboard wall" },
    { category: "Kitchen", image: kitchenImage, title: "Fluted oak island" },
    { category: "Commercial", image: marbleImage, title: "Calacatta reception finish" },
    { category: "Exterior", image: stoneImage, title: "Warm stone entry wall" },
];

export const Route = createFileRoute("/gallery")({
    head: () => ({
        meta: [
            { title: "Project Gallery & Transformations | Deco Galleria" },
            {
                name: "description",
                content:
                    "Browse finished installations and before-and-after transformations featuring WPC wall panels, UV marble sheets, fencing, and decking.",
            },
            {
                property: "og:title",
                content: "Project Gallery & Transformations | Deco Galleria",
            },
            {
                property: "og:description",
                content:
                    "See modern surface materials in bright finished spaces and real-world project case studies.",
            },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
        ],
    }),
    component: GalleryPage,
});

function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
        null
    );
    const [selectedTransformation, setSelectedTransformation] =
        useState<TransformationItem | null>(null);

    const filteredProjects = useMemo(() => {
        if (activeCategory === "All") return projects;
        return projects.filter((p) => p.category === activeCategory);
    }, [activeCategory]);

    const [filter, setFilter] = useState("All");
    const visible = filter === "All" ? gallery : gallery.filter((item) => item.category === filter);


    return (
        <>
            <PageIntro
                eyebrow="Portfolio & Case Studies"
                title="Project Gallery & Transformations"
                text="Explore completed installations and witness real-world transformations using Deco Galleria WPC panels, UV marble sheets, composite fencing, and decking."
            />

            {/* SECTION 1: FINISHED INSTALLATIONS SHOWCASE */}
            <section className="section-space">
                <div className="site-container">
                    <div className="mb-8">
                        <p className="eyebrow">Finished Work</p>
                        <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                            Completed Installations
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Filter through our recent residential and commercial project releases.
                        </p>
                    </div>

                    {/* Category Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-start gap-2 border-b border-border pb-6">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-md ${activeCategory === cat
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Animated Project Grid */}
                    <motion.div
                        layout
                        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <AnimatePresence>
                            {filteredProjects.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    onClick={() => setSelectedProject(item)}
                                    className="group cursor-pointer overflow-hidden border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <span className="absolute top-3 left-3 bg-black/75 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                                                {item.category}
                                            </span>
                                        </div>

                                        <div className="p-5">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                <span>{item.location}</span>
                                                <span className="font-semibold text-primary">
                                                    {item.sqft}
                                                </span>
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
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: INTERACTIVE BEFORE & AFTER COMPARISON */}
            <section className="section-space border-t border-border bg-secondary/10">
                <div className="site-container">
                    <div className="max-w-2xl">
                        <p className="eyebrow">Interactive Spotlight</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Drag to see the transformation
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Move the slider left or right to compare raw wall surfaces with
                            finished Deco Galleria installations.
                        </p>
                    </div>

                    <div className="mt-8">
                        <BeforeAfterSlider
                            beforeImage={newer}
                            afterImage={showcaseImage}
                            beforeAlt="Plain drywall living room wall before WPC installation"
                            afterAlt="Finished WPC slatted accent wall with ambient lighting"
                        />
                    </div>
                </div>
            </section>

            <section className="section-space">
                <div className="site-container">
                    <div className="flex gap-2 overflow-x-auto pb-3">
                        {["All", "Living Room", "Bedroom", "Kitchen", "Exterior", "Commercial"].map((item) =>
                            <Button key={item} variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)}>{item}</Button>)}
                    </div>
                    <div className="mt-8 grid gap-5 md:grid-cols-2">
                        {visible.map((item, index) =>
                            <figure key={item.title} className={`${index === 0 && visible.length > 2 ? "md:col-span-2" : ""} group overflow-hidden bg-muted`}>
                                <div className="overflow-hidden"><img src={item.image} alt={item.title} loading="lazy" className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${index === 0 && visible.length > 2 ? "aspect-[2/1]" : "aspect-[4/3]"}`} /></div>
                                {/* <figcaption className="flex items-center justify-between border border-t-0 border-border bg-background p-5">
                                    {/* <div>
                                        <p className="text-xs font-bold uppercase text-primary">
                                            {item.category}
                                        </p>
                                        <h2 className="mt-1 text-xl font-bold">
                                            {item.title}
                                        </h2>
                                    </div> */}
                                    {/* <ArrowRight /> 
                                </figcaption> */}
                            </figure>
                        )}
                    </div>
                </div>
            </section>

            {/* SECTION 3: BEFORE & AFTER CASE STUDIES GRID */}
            <section className="section-space border-t border-border bg-secondary/30">
                <div className="site-container">
                    <div className="max-w-2xl">
                        <p className="eyebrow">Case Studies</p>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Proven results across Southern California
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Explore how property owners elevated modern aesthetics while
                            reducing long-term surface maintenance.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-8 md:grid-cols-2">
                        {transformations.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col border border-border bg-card shadow-sm overflow-hidden"
                            >
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

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                            <span>{item.location}</span>
                                            <span className="font-semibold text-primary">
                                                {item.material}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-card-foreground">
                                            {item.title}
                                        </h3>

                                        <div className="mt-4 space-y-3 text-xs leading-relaxed">
                                            <div className="p-2.5 rounded bg-muted/50 border border-border/50">
                                                <span className="font-bold text-destructive uppercase tracking-wide block mb-0.5">
                                                    Original State:
                                                </span>
                                                <p className="text-muted-foreground">
                                                    {item.beforeDesc}
                                                </p>
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
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIGHTBOX DIALOG: PROJECT DETAILS */}
            <Dialog
                open={!!selectedProject}
                onOpenChange={() => setSelectedProject(null)}
            >
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
                                    <span>
                                        {selectedProject.location} • {selectedProject.sqft}
                                    </span>
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

            {/* LIGHTBOX DIALOG: TRANSFORMATION COMPARISON */}
            <Dialog
                open={!!selectedTransformation}
                onOpenChange={() => setSelectedTransformation(null)}
            >
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
                                    {selectedTransformation.location} •{" "}
                                    {selectedTransformation.material}
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

// Reusable Interactive Before/After Slider Component
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
            <img
                src={afterImage}
                alt={afterAlt}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded shadow">
                After
            </span>

            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
                <img
                    src={beforeImage}
                    alt={beforeAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-black/80 text-white text-xs font-bold uppercase px-3 py-1 rounded shadow">
                    Before
                </span>
            </div>

            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-md text-xs">
                    ↔
                </div>
            </div>

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