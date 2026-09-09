import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Leaf, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const finishes = [
  { name: "Natural Oak", className: "bg-finish-oak" },
  { name: "Soft Ash", className: "bg-finish-ash" },
  { name: "Warm Walnut", className: "bg-finish-walnut" },
  { name: "Charcoal", className: "bg-finish-charcoal" },
  { name: "Calacatta", className: "bg-finish-marble" },
  { name: "Limestone", className: "bg-finish-stone" },
] as const;

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="bg-secondary">
      <div className="site-container py-16 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{text}</p>
      </div>
    </section>
  );
}

export function ProductShowcase({ eyebrow, title, description, image, alt, specs, reverse = false }: { eyebrow: string; title: string; description: string; image: string; alt: string; specs: string[]; reverse?: boolean }) {
  return (
    <section className="section-space">
      <div className={`site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div className="overflow-hidden bg-muted shadow-soft">
          <img src={image} alt={alt} loading="lazy" width={1400} height={1000} className="aspect-[7/5] h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
        </div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">{title}</h2>
          <p className="mt-5 leading-8 text-muted-foreground">{description}</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {specs.map((spec) => <li key={spec} className="flex items-center gap-3 text-sm font-semibold"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"><Check className="h-3.5 w-3.5" /></span>{spec}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function FinishSelector({ title = "Find your finish" }: { title?: string }) {
  return (
    <section className="bg-secondary py-12">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Material library</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h2></div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">Colors are representative. Visit our Sun Valley showroom to see texture, sheen, and tone in person.</p>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {finishes.map((finish) => <button type="button" key={finish.name} className="group text-left"><span className={`block aspect-square border-2 border-background shadow-soft transition-transform group-hover:-translate-y-1 ${finish.className}`} /><span className="mt-2 block text-xs font-semibold">{finish.name}</span></button>)}
        </div>
      </div>
    </section>
  );
}

export function CTA({ title = "Bring your project to life", text = "Get material guidance, finish recommendations, and trade-friendly pricing from our Sun Valley team." }: { title?: string; text?: string }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="site-container flex flex-col justify-between gap-7 py-12 md:flex-row md:items-center">
        <div><h2 className="text-3xl font-bold">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/80">{text}</p></div>
        <Button asChild variant="secondary" size="lg"><Link to="/contact">Start a conversation <ArrowRight /></Link></Button>
      </div>
    </section>
  );
}

export function FeatureStrip() {
  const items: Array<{ icon: ReactNode; title: string; text: string }> = [
    { icon: <Leaf />, title: "Considered materials", text: "Practical, enduring finishes selected for modern spaces." },
    { icon: <ShieldCheck />, title: "Built to perform", text: "Moisture, mold, scratch, and termite-resistant options." },
    { icon: <Sparkles />, title: "Designer impact", text: "Natural textures that transform a room without visual clutter." },
    { icon: <Wrench />, title: "Project support", text: "Helpful guidance for homeowners, designers, and contractors." },
  ];
  return <div className="site-container grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{items.map((item) => <div key={item.title} className="bg-background p-7"><div className="text-primary">{item.icon}</div><h3 className="mt-4 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p></div>)}</div>;
}