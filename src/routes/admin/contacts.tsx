import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin-layout";
import { Loader2, Mail, MessageSquare, Trash2, Eye, X, Phone, Tag } from "lucide-react";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContactsPage,
});

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category_id: string | null;
  project_details: string;
  created_at: string;
  categories: {
    name: string;
  } | null;
}

function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Fetch Contact Inquiries with Joined Category details from Supabase
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select(`
          id,
          name,
          email,
          phone,
          category_id,
          project_details,
          created_at,
          categories (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as ContactInquiry[];
    },
  });

  // Delete Inquiry Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_contacts"] });
      if (selectedInquiry?.id) {
        setSelectedInquiry(null);
      }
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Inquiries</h1>
          <p className="mt-1 text-xs text-slate-400">
            Direct inquiries submitted from the website contact form.
          </p>
        </div>

        {/* Contacts List */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
          </div>
        ) : contacts?.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center">
            <MessageSquare className="h-8 w-8 text-slate-600" />
            <p className="mt-2 text-xs text-slate-400">No contact inquiries found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts?.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-4 transition-colors hover:border-slate-700"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-bold text-white">{c.name}</h4>
                    {c.categories?.name && (
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                        {c.categories.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {c.email} {c.phone && `• ${c.phone}`}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] text-slate-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedInquiry(c)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(c.id)}
                      disabled={deleteMutation.isPending}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Details Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedInquiry.name}</h3>
                  <p className="mt-1 text-xs text-slate-400 flex items-center gap-2">
                    <span>{selectedInquiry.email}</span>
                    {selectedInquiry.phone && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Phone className="h-3 w-3 text-emerald-400" /> {selectedInquiry.phone}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="my-5 space-y-4">
                {selectedInquiry.categories?.name && (
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                      Material Interest
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-slate-700">
                      <Tag className="h-3 w-3" />
                      {selectedInquiry.categories.name}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Project Details
                  </span>
                  <p className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {selectedInquiry.project_details || "No project details provided."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Project Inquiry - Deco Galleria`}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                >
                  <Mail className="h-4 w-4" /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}