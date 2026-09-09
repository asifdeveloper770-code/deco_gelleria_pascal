import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin-layout";
import { Loader2, Mail, MessageSquare, Trash2, Eye, X } from "lucide-react";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContactsPage,
});

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message?: string;
  created_at: string;
}

function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Fetch Contact Inquiries from Supabase
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin_contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ContactInquiry[];
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
                  <h4 className="truncate text-sm font-bold text-white">{c.subject}</h4>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {c.name} • <span className="text-slate-500">{c.email}</span>
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
                  <h3 className="text-base font-bold text-white">{selectedInquiry.subject}</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    From {selectedInquiry.name} ({selectedInquiry.email})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="my-6 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Message Body
                </span>
                <p className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-4 text-xs leading-relaxed text-slate-300">
                  {selectedInquiry.message || "No message body provided."}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(
                    selectedInquiry.subject
                  )}`}
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