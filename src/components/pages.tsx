import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Droplets, Hammer, Leaf, MapPin, Phone, Recycle, Shield, Sparkles, Sun, Wrench } from "lucide-react";
import heroImage from "@/assets/deco-hero.jpg";
import bedroomImage from "@/assets/wpc-bedroom.jpg";
import kitchenImage from "@/assets/wpc-kitchen.jpg";
import stoneImage from "@/assets/pu-stone.jpg";
import marbleImage from "@/assets/uv-marble.jpg";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CTA, FeatureStrip, FinishSelector, PageIntro, ProductShowcase } from "@/components/content-blocks";
import { Field } from "@/components/site-shell";

const products = [
  { title: "WPC Panels", text: "Warm, dimensional slat walls for interiors and exterior-rated applications.", image: heroImage, to: "/wpc-panels" as const },
  { title: "PU Stone", text: "Lightweight stone character with easier handling and installation.", image: stoneImage, to: "/pu-stone" as const },
  { title: "UV Marble Sheets", text: "Large, seamless marble looks for polished modern interiors.", image: marbleImage, to: "/uv-marble" as const },
];

export function HomePage() {
  return <>
    <section className="relative min-h-[78vh] overflow-hidden">
      <img src={heroImage} alt="Bright living room with natural wood slat panel wall" width={1920} height={1200} className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="site-container relative flex min-h-[78vh] items-end py-14 sm:py-20">
        <div className="max-w-3xl animate-fade-in text-hero-foreground">
          <p className="mb-4 text-sm font-bold uppercase">Interior & exterior materials · Los Angeles</p>
          <h1 className="text-5xl font-bold leading-[1.02] sm:text-7xl">Styling your space,<br />one panel at a time.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-hero-muted sm:text-lg">High-quality wall panels, lightweight stone, and marble sheets for spaces designed to feel brighter, warmer, and distinctly yours.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/gallery">Explore projects <ArrowRight /></Link></Button><Button asChild size="lg" variant="secondary"><Link to="/contact">Visit our showroom</Link></Button></div>
        </div>
      </div>
    </section>
    <section className="border-b border-border">
      <FeatureStrip />
    </section>
    <section className="section-space">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="eyebrow">Material collection</p>
          <h2 className="mt-4 text-4xl font-bold sm:text-5xl">Surfaces made for real life</h2>
          <p className="mt-4 leading-7 text-muted-foreground">Explore versatile finishes for homes, hospitality, retail, and commercial projects.</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((product) =>
            <Link key={product.title} to={product.to} className="group block">
              <div className="overflow-hidden bg-muted">
                <img src={product.image} alt={product.title} loading="lazy" width={1400} height={1000} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="border border-t-0 border-border p-6">
                <h3 className="text-2xl font-bold">{product.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.text}</p>
                <span className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">View material <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>

    <section className="bg-secondary">
      <div className="site-container grid gap-px bg-border md:grid-cols-3">
        <Stat value="3" label="Signature material collections" />
        <Stat value="8" label="Performance qualities" />
        <Stat value="2" label="Counties served across Southern California" />
      </div>
    </section>
    <CTA title="Planning a larger project?" text="Ask about limited-time volume pricing for contractors, designers, residential developments, and commercial installations." />
  </>;
}

function Stat({ value, label }: { value: string; label: string }) {
  return <>
    <div className="bg-secondary p-8 sm:p-10">
      <p className="text-5xl font-bold text-primary">{value}</p>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">{label}</p>
    </div>;
  </>
}

export function AboutPage() {
  return <>
    <PageIntro eyebrow="Our story" title="Materials with warmth. Service with intention." text="Deco Galleria Inc. helps homeowners and trade professionals shape memorable interiors and exteriors with expressive, practical surface materials." />
    <section className="section-space">
      <div className="site-container grid items-center gap-12 lg:grid-cols-2">
        <img src={heroImage} alt="Natural wood panel installation" className="aspect-[4/3] w-full object-cover shadow-soft" />
        <div>
          <p className="eyebrow">Led by Pascal Angelini</p>
          <h2 className="mt-4 text-4xl font-bold">A hands-on approach to every project</h2>
          <p className="mt-5 leading-8 text-muted-foreground">From a single feature wall to a multi-room or commercial specification, Pascal and the Deco Galleria team help clients compare finishes, understand applications, and select materials with confidence.</p>
          <p className="mt-4 leading-8 text-muted-foreground">Based in Sun Valley, we serve Los Angeles, Orange County, and surrounding communities with local knowledge and a dependable source for modern surface solutions.</p>
          <Button asChild className="mt-7">
            <Link to="/contact">Meet us in Sun Valley <ArrowRight /></Link>
          </Button>
        </div>
      </div>
    </section>
    <FeatureStrip />
    <CTA />
  </>
    ;
}

export function StonePage() {
  return (
    <>
      <PageIntro
        eyebrow="Exterior & Boundary Solutions"
        title="WPC Fencing"
        text="A modern outdoor barrier made by blending recycled wood fibers with plastic polymers—delivering the natural warmth of timber with unmatched longevity."
      />

      <ProductShowcase
        eyebrow="Key Facts & Benefits"
        title="Low-maintenance fencing built for the elements"
        description="California experiences high heat, dry spells, and coastal moisture. While natural wood absorbs water and splits, WPC is completely waterproof, resists swelling or decay, and includes UV inhibitors to prevent fading under intense sun exposure."
        image={stoneImage}
        alt="Modern WPC outdoor privacy fence in natural wood finish"
        specs={[
          "15–20+ year expected lifespan",
          "Low maintenance (never needs painting or staining)",
          "Pest proof (resists rot, splitting, mold & termites)",
          "Eco-friendly recycled materials",
          "UV resistant & waterproof construction",
          "Easy cleanup with just soap & water",
        ]}
      />

      <FinishSelector title="Explore fence tones & finishes" />
      <CTA />
    </>
  );
}

export function MarblePage() {
  return (
    <>
      <PageIntro
        eyebrow="Seamless surfaces"
        title="UV Marble Sheets"
        text="A decorative panel made from PVC or acrylic, designed to mimic the appearance of real marble with a special UV-protective coating. A durable, cost-effective alternative to natural marble for feature walls, countertops, and interior surfaces."
      />

      <ProductShowcase
        eyebrow="Refined simplicity"
        title="A polished slab look, beautifully resolved" description="Resistant to scratches, moisture, and discoloration, UV marble sheets provide the luxurious visual flow of large-format stone with easier installation and minimal maintenance for homes and businesses."
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
      
      <CTA />
    </>
  );
}

const gallery = [
  { category: "Living Room", image: heroImage, title: "Oak double-height wall" },
  { category: "Bedroom", image: bedroomImage, title: "Soft ash headboard wall" },
  { category: "Kitchen", image: kitchenImage, title: "Fluted oak island" },
  { category: "Commercial", image: marbleImage, title: "Calacatta reception finish" },
  { category: "Exterior", image: stoneImage, title: "Warm stone entry wall" },
];
export function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? gallery : gallery.filter((item) => item.category === filter);
  return <>
    <PageIntro eyebrow="Portfolio" title="Materials in their best light." text="Browse bright, tactile spaces and see how panels, stone textures, and marble surfaces change the character of a room." />
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
              <figcaption className="flex items-center justify-between border border-t-0 border-border bg-background p-5">
                <div>
                  <p className="text-xs font-bold uppercase text-primary">
                    {item.category}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    {item.title}
                  </h2>
                </div>
                <ArrowRight />
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
    <CTA />
  </>;
}

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
  return <>
    <PageIntro eyebrow="Why Deco Galleria" title="Elevate Your Space. Elevate Your Style." text="At Deco Galleria, we believe every space deserves to look extraordinary. We bring together stylish,
quality wall panels and décor solutions that make it easier to create the space you've always envisioned" />
    <section className="section-space">
      <div className="site-container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {qualities.map(({ icon: FeatureIcon, title, text }) =>
          <article key={title} className="border border-border bg-card p-7 shadow-soft transition-transform hover:-translate-y-1">
            <FeatureIcon className="h-7 w-7 text-primary" />
            <h2 className="mt-5 text-xl font-bold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
          </article>
        )}
      </div>
    </section>
    <CTA />
  </>
    ;
}

export function BulkPage() {
  return <>
    <PageIntro eyebrow="Trade program" title="Better material planning for projects at scale." text="Dedicated support and volume-minded pricing for contractors, designers, builders, property managers, and ambitious residential projects." />
    <section className="section-space">
      <div className="site-container grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <h2 className="text-4xl font-bold">Built for the way trade teams work</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Volume pricing", "Finish coordination", "Material guidance", "Local pickup planning"].map((item) =>
              <div key={item} className="flex items-center gap-3 border border-border p-5 font-bold">
                <CheckCircle2 className="text-primary" />
                {item}
              </div>
            )}
          </div>
          <p className="mt-8 leading-8 text-muted-foreground">Share your material, coverage, timing, and pickup or delivery needs. We’ll help clarify the right products and available project pricing.</p>
        </div>
        <div className="bg-primary p-8 text-primary-foreground shadow-lifted sm:p-10">
          <p className="text-sm font-bold uppercase">
            Limited-time opportunity
          </p>
          <h2 className="mt-3 text-3xl font-bold">Ask about bulk order discounts.</h2>
          <p className="mt-4 leading-7 text-primary-foreground/80">Available terms vary by product, finish, quantity, and availability.</p>
          <Button asChild variant="secondary" size="lg" className="mt-7">
            <Link to="/contact">
              Request trade pricing
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  </>
    ;
}

const faqs = [
  ["Can I install these materials myself?", "Some experienced homeowners can complete smaller installations, but correct preparation and fastening matter. We recommend discussing your wall condition, product, and scope with our team first."],
  ["How do I maintain the surfaces?", "Most finishes need only gentle dusting or a soft damp cloth. Avoid abrasive pads and harsh chemicals; care guidance may vary by collection."],
  ["Are WPC panels suitable outdoors?", "Selected WPC profiles are intended for exterior applications. Confirm the exact product, exposure conditions, and installation method before ordering."],
  ["Do you offer samples?", "Contact us or visit our Sun Valley showroom to compare representative colors and textures before final selection."],
  ["Can I pick up my order locally?", "Local pickup can be coordinated at 12111 Bradford St. Unit C5 in Sun Valley. Please confirm availability and pickup timing in advance."],
  ["Do you ship or deliver?", "Delivery and shipping options depend on material, quantity, and destination. Share your ZIP code and project details for current options."],
];
export function FaqPage() {
  return (
    <>
      <PageIntro
        eyebrow="Helpful answers"
        title="Plan your material selection with confidence."
        text="Start with the essentials on installation, care, outdoor use, samples, and order collection."
      />
      <section className="section-space">
        <div className="site-container max-w-3xl">
          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map(([question, answer], index) => (
              <AccordionItem key={question} value={`item-${index}`}>
                <AccordionTrigger className="py-6 text-left text-lg">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-7 text-muted-foreground">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 border border-border bg-secondary p-7">
            <h2 className="text-2xl font-bold">Still deciding?</h2>
            <p className="mt-2 text-muted-foreground">
              Tell us about your space and we’ll point you toward the right collection.
            </p>
            <Button asChild className="mt-5">
              <Link to="/contact">Ask a question</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Let’s talk about your space."
        text="Visit our Sun Valley showroom, call directly, or send project details and we’ll help you take the next step."
      />
      <section className="section-space">
        <div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <aside>
            <h2 className="text-2xl font-bold">Deco Galleria Inc.</h2>
            <div className="mt-7 grid gap-5 text-sm">
              <a
                className="flex gap-3"
                href="https://maps.google.com/?q=12111+Bradford+St+Unit+C5+Sun+Valley+CA+91352"
                target="_blank"
                rel="noreferrer"
              >
                <MapPin className="shrink-0 text-primary" />
                12111 Bradford St. Unit C5
                <br />
                Sun Valley, CA 91352
              </a>
              <a className="flex gap-3" href="tel:+18187300927">
                <Phone className="text-primary" />
                818.730.0927
              </a>
              <a className="flex gap-3" href="mailto:pangelini@decogalleria.com">
                pangelini@decogalleria.com
              </a>
            </div>
            <div className="mt-8 border-l-2 border-primary pl-5">
              <p className="font-bold">Business hours</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Please call ahead for current showroom hours and material availability.
              </p>
            </div>
          </aside>

          {sent ? (
            <div className="grid min-h-80 place-items-center border border-border bg-secondary p-8 text-center">
              <div>
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-5 text-3xl font-bold">Message received</h2>
                <p className="mt-3 text-muted-foreground">
                  Thank you. The Deco Galleria team will be in touch.
                </p>
                <Button className="mt-6" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="grid gap-5 border border-border bg-card p-6 shadow-soft sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    required
                    maxLength={100}
                    autoComplete="name"
                    className="form-control"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    maxLength={255}
                    autoComplete="email"
                    className="form-control"
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone">
                  <input
                    type="tel"
                    maxLength={30}
                    autoComplete="tel"
                    className="form-control"
                  />
                </Field>
                <Field label="Material interest">
                  <select className="form-control">
                    <option>WPC Panels</option>
                    <option>PU Stone</option>
                    <option>UV Marble Sheets</option>
                    <option>Bulk / Trade Order</option>
                    <option>Not sure yet</option>
                  </select>
                </Field>
              </div>

              <Field label="Project details">
                <textarea
                  required
                  minLength={10}
                  maxLength={1000}
                  className="form-control min-h-36"
                  placeholder="Tell us about your space, approximate size, location, and timing."
                />
              </Field>

              <Button type="submit" size="lg">
                Send message <ArrowRight />
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export { PageIntro, CTA };
