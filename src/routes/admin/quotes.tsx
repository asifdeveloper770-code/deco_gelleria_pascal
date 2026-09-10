import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin-layout";
import { Loader2, FileText, Trash2, Eye, X, Mail, Tag, User } from "lucide-react";

export const Route = createFileRoute("/admin/quotes")({
  component: AdminQuotesPage,
});

interface Quote {
  id: string;
  created_at: string;
  user_type: string;
  category_id: string | null;
  area_sqft: number;
  estimated_price: number;
  name: string;
  email: string;
  project_notes: string | null;
  status?: "Pending" | "In Review" | "Approved" | "Rejected";
  categories: {
    name: string;
  } | null;
}

function AdminQuotesPage() {
  const queryClient = useQueryClient();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Fetch Quotes with joined Category data from Supabase
  const { data: quotes, isLoading, error } = useQuery({
  queryKey: ["admin_quotes"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select(`
        id,
        created_at,
        user_type,
        category_id,
        area_sqft,
        estimated_price,
        name,
        email,
        project_notes,
        categories (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching quotes:", error);
      throw error;
    }
    return data as unknown as Quote[];
  },
});

  // Update Quote Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: NonNullable<Quote["status"]>;
    }) => {
      const { error } = await supabase
        .from("quotes")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_quotes"] });
    },
  });

  // Delete Quote Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("quotes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_quotes"] });
      if (selectedQuote?.id) {
        setSelectedQuote(null);
      }
    },
  });

  const getStatusBadge = (status: Quote["status"] = "Pending") => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In Review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quote Requests</h1>
          <p className="mt-1 text-xs text-slate-400">
            Review contractor and homeowner square-footage estimate requests.
          </p>
        </div>

        {/* Quotes Table */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
          ) : quotes?.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
              <FileText className="h-8 w-8 text-slate-600" />
              <p className="mt-2 text-xs text-slate-400">No quote requests found.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900 text-[10px] uppercase text-slate-400">
                <tr>
                  <th className="p-4">Quote ID</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Material</th>
                  <th className="p-4">Coverage</th>
                  <th className="p-4">Est. Price</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {quotes?.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-slate-800/30">
                    <td className="p-4 font-mono text-emerald-400">
                      {q.id.substring(0, 8)}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      <div>{q.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{q.email}</div>
                    </td>
                    <td className="p-4 text-slate-400">{q.user_type}</td>
                    <td className="p-4">
                      {q.categories?.name ? (
                        <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
                          {q.categories.name}
                        </span>
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-300">{q.area_sqft} sq ft</td>
                    <td className="p-4 font-mono font-semibold text-emerald-400">
                      ${q.estimated_price.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={q.status || "Pending"}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: q.id,
                            status: e.target.value as NonNullable<Quote["status"]>,
                          })
                        }
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold bg-slate-950 focus:outline-none ${getStatusBadge(
                          q.status
                        )}`}
                      >
                        <option value="Pending" className="bg-slate-900 text-slate-100">
                          Pending
                        </option>
                        <option value="In Review" className="bg-slate-900 text-slate-100">
                          In Review
                        </option>
                        <option value="Approved" className="bg-slate-900 text-slate-100">
                          Approved
                        </option>
                        <option value="Rejected" className="bg-slate-900 text-slate-100">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(q.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete Quote"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quote Details Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedQuote.name}</h3>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-700">
                      {selectedQuote.user_type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{selectedQuote.email}</p>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="my-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Material
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <Tag className="h-3 w-3" />
                      {selectedQuote.categories?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Coverage
                    </span>
                    <span className="mt-1 block text-xs font-mono font-semibold text-white">
                      {selectedQuote.area_sqft} sq. ft.
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Estimated Price
                    </span>
                    <span className="mt-1 block text-sm font-mono font-bold text-emerald-400">
                      ${selectedQuote.estimated_price.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Submission Date
                    </span>
                    <span className="mt-1 block text-xs font-mono text-slate-300">
                      {new Date(selectedQuote.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                    Project Notes
                  </span>
                  <p className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {selectedQuote.project_notes || "No notes provided."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
                <a
                  href={`mailto:${selectedQuote.email}?subject=Deco Galleria - Your Quote Estimate (#${selectedQuote.id.substring(0, 8)})`}
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