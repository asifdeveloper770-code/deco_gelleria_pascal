import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import logoAsset from "@/assets/deco-galleria-logo.png";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { Field } from "@/components/site-shell";
import {  Loader2 } from "lucide-react";

type LinkItem = {
  to: string;
  label: string;
};

type ParentNavItem = {
  label: string;
  children: LinkItem[];
};

type NavItem = LinkItem | ParentNavItem;

const navItems: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  {
    label: "WPC Panels",
    children: [
      { to: "/wpc-panels", label: "WPC Panels" },
      { to: "/wpc-panels/indoor", label: "WPC Indoor Panels" },
      { to: "/wpc-panels/outdoor", label: "WPC Exterior Panels" },
      { to: "/wpc-panels/acoustic", label: "Acoustic Panels" },
    ],
  },
  { to: "/pu-stone", label: "Fencing" },
  { to: "/uv-marble", label: "UV Marble" },
  { to: "/wpc-decking", label: "Decking" },
  { to: "/miscellaneous", label: "Miscellaneous" },
  { to: "/gallery", label: "Gallery" },
  { to: "/why-us", label: "Why Choose Us" },
  // { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

type SiteShellProps = { children: ReactNode };

export function SiteShell({ children }: SiteShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-xl">
        <div className="site-container grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <Link to="/" className="flex min-w-0 items-center" aria-label="Deco Galleria home">
            <img src={logoAsset} alt="Deco Galleria" className="h-12 w-auto max-w-[190px] object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center xl:flex" aria-label="Main navigation">
            {navItems.map((item) => {
              if ("children" in item) {
                return (
                  <div key={item.label} className="group relative">
                    <button
                      type="button"
                      className={`nav-link flex items-center gap-1 ${
                        pathname.startsWith("/wpc-panels") ? "nav-link-active" : ""
                      }`}
                    >
                      {item.label} <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="invisible absolute left-0 top-full w-56 translate-y-2 border border-border bg-background p-2 opacity-0 shadow-soft transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary"
                          activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="nav-link"
                  activeProps={{ className: "nav-link nav-link-active" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              );
            })}

            <Button onClick={() => setQuoteOpen(true)} className="ml-2">
              <Calculator /> Quick quote
            </Button>
          </nav>

          {/* Mobile Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <nav className="border-t border-border bg-background px-4 py-4 xl:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-1">
              {navItems.map((item) => {
                if ("children" in item) {
                  return (
                    <div key={item.label} className="py-2">
                      <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </p>
                      <div className="mt-1 grid gap-1 pl-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className={`block rounded-md px-3 py-2 text-sm font-semibold ${
                              pathname === child.to ? "bg-secondary text-primary" : "text-foreground"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-3 text-base font-semibold ${
                      pathname === item.to ? "bg-secondary text-primary" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <Button
                className="mt-3 w-full"
                onClick={() => {
                  setMobileOpen(false);
                  setQuoteOpen(true);
                }}
              >
                <Calculator /> Quick quote
              </Button>
            </div>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-footer text-footer-foreground">
        <div className="site-container grid gap-10 py-14 md:grid-cols-[1.15fr_.85fr_.85fr]">
          <div>
            <img src={logoAsset} alt="Deco Galleria" className="h-16 w-auto object-contain" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-footer-muted">
              Styling your space, one panel at a time. Quality interior and exterior materials for homes and trade projects.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-footer-foreground">Visit our showroom</h2>
            <a
              className="mt-4 flex gap-3 text-sm leading-6 text-footer-muted hover:text-footer-foreground"
              href="https://maps.google.com/?q=12111+Bradford+St+Unit+C5+Sun+Valley+CA+91352"
              target="_blank"
              rel="noreferrer"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              12111 Bradford St. Unit C5
              <br />
              Sun Valley, CA 91352
            </a>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase text-footer-foreground">Talk with us</h2>
            <a className="mt-4 flex items-center gap-3 text-sm text-footer-muted hover:text-footer-foreground" href="tel:+18187300927">
              <Phone className="h-4 w-4" />
              818.730.0927
            </a>
            <a className="mt-3 flex items-center gap-3 break-all text-sm text-footer-muted hover:text-footer-foreground" href="mailto:pangelini@decogalleria.com">
              <Mail className="h-4 w-4 shrink-0" />
              pangelini@decogalleria.com
            </a>
          </div>
        </div>
        <div className="border-t border-footer-line py-5 text-center text-xs text-footer-muted">
          © 2026 Deco Galleria Inc. All rights reserved.
        </div>
      </footer>

      <a
        href="tel:+18187300927"
        className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lifted md:hidden"
        aria-label="Call Deco Galleria"
      >
        <Phone className="h-5 w-5" />
      </a>
      <QuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
    </div>
  );
}



interface Category {
  id: string;
  name: string;
  slug: string;
}

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuoteDialog({ open, onOpenChange }: QuoteDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form inputs
  const [userType, setUserType] = useState("Homeowner");
  const [categoryId, setCategoryId] = useState<string>("");
  const [area, setArea] = useState(120);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectNotes, setProjectNotes] = useState("");

  // Fetch categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (error) throw error;
      
      // Auto-select first category if available
      if (data && data.length > 0 && !categoryId) {
        setCategoryId(data[0].id);
      }
      
      return data as Category[];
    },
  });

  // Calculate pricing based on selected category name
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const getRate = (categoryName?: string) => {
    switch (categoryName) {
      case "PU Stone":
        return 11;
      case "UV Marble Sheets":
        return 9.5;
      case "WPC Panels":
      default:
        return 8.5;
    }
  };

  const estimate = area * getRate(selectedCategory?.name);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.from("quotes").insert([
        {
          user_type: userType,
          category_id: categoryId || null,
          area_sqft: area,
          estimated_price: estimate,
          name,
          email,
          project_notes: projectNotes || null,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to submit quote request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) setTimeout(() => setSubmitted(false), 200);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <DialogTitle className="mt-5 text-2xl">
              Your project is ready to review
            </DialogTitle>
            <DialogDescription className="mx-auto mt-3 max-w-sm leading-6">
              Your planning estimate is ${estimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}. We’ll follow up to confirm finishes, measurements, and availability.
            </DialogDescription>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <p className="eyebrow">Project planning</p>
              <DialogTitle className="text-2xl">
                Get a quick material estimate
              </DialogTitle>
              <DialogDescription>
                Share a few details. This planning range excludes installation, tax, and delivery.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="mt-2 grid gap-4">
              {errorMessage && (
                <div className="rounded border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="I am a">
                  <select
                    required
                    className="form-control"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="Homeowner">Homeowner</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Designer / Architect">Designer / Architect</option>
                    <option value="Property Manager">Property Manager</option>
                  </select>
                </Field>

                <Field label="Material">
                  <select
                    required
                    className="form-control"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label={`Approximate coverage: ${area} sq. ft.`}>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={area}
                  onChange={(event) => setArea(Number(event.target.value))}
                  className="w-full accent-primary"
                />
              </Field>

              <div className="border border-border bg-secondary p-4">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Planning estimate
                </p>
                <p className="mt-1 text-3xl font-bold text-primary">
                  ${estimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    className="form-control"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <input
                    className="form-control"
                    required
                    type="email"
                    maxLength={255}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Project notes (optional)">
                <textarea
                  className="form-control min-h-20"
                  maxLength={600}
                  placeholder="Room, finish, timing, or delivery details"
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                />
              </Field>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    Submitting... <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Request my quote <ArrowRight />
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      <span>{label}</span>
      {children}
    </label>
  );
}