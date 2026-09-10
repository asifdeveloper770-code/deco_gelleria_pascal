import { createFileRoute } from "@tanstack/react-router";
import { 
  Droplets, 
  Shield, 
  Sparkles, 
  Recycle, 
  Wrench, 
  Hammer, 
  Leaf, 
  Sun,
  Eye,
  Layout,
  DollarSign,
  HeartHandshake,
  Palette,
  Smile
} from "lucide-react";
import { PageIntro } from "@/components/pages";
import { CTA } from "@/components/pages";

// Company Value Propositions
const whyUsReasons = [
  {
    icon: Eye,
    title: "Quality You Can See",
    text: "We carefully select stylish, high-quality wall panels and home décor products designed to elevate your space.",
  },
  {
    icon: Layout,
    title: "Transform Your Space",
    text: "From WPC panels and UV marble to acoustic panels and decorative finishes, we offer solutions that turn ordinary walls into stunning focal points.",
  },
  {
    icon: DollarSign,
    title: "Luxury Without the Price",
    text: "Get the sophisticated look you want without the high cost and heavy maintenance of traditional materials.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Service",
    text: "We take the time to understand your vision and help you find the right products for your home or commercial project.",
  },
  {
    icon: Palette,
    title: "Designs for Every Style",
    text: "Whether your style is modern, elegant, contemporary, or bold, we have options to help bring your vision to life.",
  },
  {
    icon: Smile,
    title: "Your Satisfaction Matters",
    text: "We believe in building relationships with our customers—not just making a sale. Your project and satisfaction are our priority.",
  },
];

// Product Material Qualities
const qualities = [
  { icon: Droplets, title: "Waterproof", text: "Designed to resist moisture in demanding everyday settings." },
  { icon: Shield, title: "Termite proof", text: "Composite options that do not invite termite damage." },
  { icon: Sparkles, title: "Scratch resistant", text: "Hard-wearing surfaces made for active spaces." },
  { icon: Recycle, title: "Environmentally friendly", text: "Thoughtful material options with long useful lives." },
  { icon: Wrench, title: "Low maintenance", text: "Easy-care finishes that keep upkeep straightforward." },
  { icon: Hammer, title: "Durable", text: "Reliable surface performance for residential and trade use." },
  { icon: Leaf, title: "Mold resistant", text: "Moisture-aware materials that support cleaner spaces." },
  { icon: Sun, title: "Anti-corrosive", text: "Surface options suited to changing conditions." },
];

export function WhyPage() {
  return (
    <>
      <PageIntro 
        eyebrow="Why Deco Galleria" 
        title="Elevate Your Space. Elevate Your Style." 
        text="At Deco Galleria, we believe every space deserves to look extraordinary. We bring together stylish, quality wall panels and décor solutions that make it easier to create the space you've always envisioned." 
      />

      {/* Why Choose Us - Core Pillars */}
      <section className="section-space border-b border-border bg-card/50">
        <div className="site-container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Why Choose Deco Galleria?</h2>
            <p className="mt-3 text-sm text-muted-foreground font-medium uppercase tracking-wider">
              Quality Products • Stylish Designs • Personalized Service • Exceptional Value
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUsReasons.map(({ icon: ReasonIcon, title, text }) => (
              <article key={title} className="rounded-xl border border-border bg-card p-7 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ReasonIcon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Material & Product Performance Qualities */}
      <section className="section-space">
        <div className="site-container">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold">Built for Performance & Elegance</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Engineered material characteristics across our full catalog.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {qualities.map(({ icon: FeatureIcon, title, text }) => (
              <article key={title} className="rounded-lg border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1">
                <FeatureIcon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Slogan Banner */}
      <section className="border-y border-border bg-primary/5 py-12 text-center">
        <div className="site-container">
          <blockquote className="text-xl font-semibold text-foreground md:text-2xl">
            “Deco Galleria — Styling Your Space, One Panel at a Time.”
          </blockquote>
        </div>
      </section>

      <CTA />
    </>
  );
}

export const Route = createFileRoute("/why-us")({
  head: () => ({
    meta: [
      { title: "Why Choose Us | Deco Galleria" },
      {
        name: "description",
        content:
          "Discover why Deco Galleria is the premier choice for wall panels and home décor—offering quality products, stylish designs, personalized service, and exceptional value.",
      },
      { property: "og:title", content: "Why Choose Deco Galleria | Elevate Your Space" },
      {
        property: "og:description",
        content:
          "Styling Your Space, One Panel at a Time. High-quality WPC, UV marble, and acoustic panel solutions for residential and commercial spaces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WhyPage,
});