import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/content-blocks";
import { ArrowRight, CheckCircle2, Loader2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/site-shell";
import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Deco Galleria | Sun Valley CA" },
      {
        name: "description",
        content:
          "Contact Deco Galleria at our Sun Valley showroom for samples, material guidance, and quotes.",
      },
      { property: "og:title", content: "Contact Deco Galleria" },
      {
        property: "og:description",
        content: "Visit, call, or send details about your next project.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch real categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category_id: "",
    project_details: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.from("contacts").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          category_id: formData.category_id || null,
          project_details: formData.project_details,
        },
      ]);

      if (error) throw error;

      setSent(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category_id: "",
        project_details: "",
      });
    } catch (err: any) {
      setErrorMessage(
        err.message || "Failed to submit your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
              {errorMessage && (
                <div className="rounded border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    autoComplete="name"
                    className="form-control"
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={255}
                    autoComplete="email"
                    className="form-control"
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Phone">
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={30}
                    autoComplete="tel"
                    className="form-control"
                  />
                </Field>
                <Field label="Material interest">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Project details">
                <textarea
                  required
                  name="project_details"
                  value={formData.project_details}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={1000}
                  className="form-control min-h-36"
                  placeholder="Tell us about your space, approximate size, location, and timing."
                />
              </Field>

              <Button type="submit" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    Sending... <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send message <ArrowRight />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}