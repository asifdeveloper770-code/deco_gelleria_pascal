import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase"; // Adjust path to your Supabase client
import { AdminLayout } from "@/components/admin-layout";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

interface RecentQuote {
  id: string;
  created_at: string;
  name: string;
  email: string;
  area_sqft: number;
  categories: {
    name: string;
  } | null;
}

export function AdminDashboardPage() {
  // Fetch count of total products
  const { data: totalProducts = 0, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["dashboard_products_count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch count of total quotes
  const { data: totalQuotes = 0, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ["dashboard_quotes_count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch count of contact submissions
  const { data: contactSubmissions = 0, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["dashboard_contacts_count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  // Fetch recent quotes with joined category name
  const { data: recentQuotes = [], isLoading: isLoadingRecentQuotes } = useQuery({
    queryKey: ["dashboard_recent_quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          id,
          created_at,
          name,
          email,
          area_sqft,
          categories (
            name
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as unknown as RecentQuote[];
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="mt-1 text-xs text-slate-400">
            Real-time inventory and client inquiry statistics.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium text-slate-400">Total Products</p>
            <p className="mt-2 text-3xl font-extrabold text-white">
              {isLoadingProducts ? "..." : totalProducts}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium text-slate-400">Total Quotes</p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-400">
              {isLoadingQuotes ? "..." : totalQuotes}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium text-slate-400">Contact Requests</p>
            <p className="mt-2 text-3xl font-extrabold text-white">
              {isLoadingContacts ? "..." : contactSubmissions}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium text-slate-400">Monthly Pageviews</p>
            <p className="mt-2 text-3xl font-extrabold text-blue-400">14.2K</p>
          </div>
        </div>

        {/* Recent Quotes Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="mb-4 text-sm font-bold text-white">
            Recent Quote Submissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[10px] uppercase text-slate-500">
                <tr>
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Area (sqft)</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {isLoadingRecentQuotes ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500">
                      Loading recent quotes...
                    </td>
                  </tr>
                ) : recentQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-slate-500">
                      No recent quotes found.
                    </td>
                  </tr>
                ) : (
                  recentQuotes.map((q) => (
                    <tr key={q.id}>
                      <td className="py-3 font-mono text-emerald-400">
                        {q.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 font-semibold text-slate-200">
                        {q.name}
                        <span className="block text-[10px] font-normal text-slate-500">
                          {q.email}
                        </span>
                      </td>
                      <td className="py-3">
                        {q.categories?.name ?? "Uncategorized"}
                      </td>
                      <td className="py-3">{q.area_sqft} sq. ft.</td>
                      <td className="py-3 text-slate-400">
                        {new Date(q.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}