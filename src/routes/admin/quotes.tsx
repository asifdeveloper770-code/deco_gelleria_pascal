import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin-layout";
import { Loader2, FileText, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/quotes")({
  component: AdminQuotesPage,
});

interface Quote {
  id: string;
  client_name: string;
  product_name: string;
  coverage_area: string;
  status: "Pending" | "In Review" | "Approved" | "Rejected";
  created_at: string;
}

function AdminQuotesPage() {
  const queryClient = useQueryClient();

  // Fetch Quotes from Supabase
  const { data: quotes, isLoading } = useQuery({
    queryKey: ["admin_quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Quote[];
    },
  });

  // Update Quote Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Quote["status"];
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
    },
  });

  const getStatusBadge = (status: Quote["status"]) => {
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
                  <th className="p-4">Requested Material</th>
                  <th className="p-4">Coverage Area</th>
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
                    <td className="p-4 font-semibold text-white">{q.client_name}</td>
                    <td className="p-4">{q.product_name}</td>
                    <td className="p-4 font-mono">{q.coverage_area}</td>
                    <td className="p-4 text-slate-500">
                      {new Date(q.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={q.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: q.id,
                            status: e.target.value as Quote["status"],
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
                      <button
                        onClick={() => deleteMutation.mutate(q.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Delete Quote"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}