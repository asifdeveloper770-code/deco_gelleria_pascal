import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin-layout";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

const mockStats = {
  totalProducts: 48,
  pendingQuotes: 12,
  contactSubmissions: 34,
  monthlyViews: "14.2K",
};

const mockQuotes = [
  { id: "Q-104", client: "Apex Developments", product: "WPC Wall Panels", area: "1,200 sq. ft.", date: "Today", status: "Pending" },
  { id: "Q-103", client: "Stratos Architecture", product: "UV Marble Sheets", area: "650 sq. ft.", date: "Yesterday", status: "Approved" },
  { id: "Q-102", client: "LIRA Luxury Homes", product: "WPC Decking", area: "2,100 sq. ft.", date: "Sep 7, 2026", status: "In Review" },
];

function AdminDashboardPage() {
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
              {mockStats.totalProducts}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium text-slate-400">Pending Quotes</p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-400">
              {mockStats.pendingQuotes}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium text-slate-400">Contact Requests</p>
            <p className="mt-2 text-3xl font-extrabold text-white">
              {mockStats.contactSubmissions}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-medium text-slate-400">Monthly Pageviews</p>
            <p className="mt-2 text-3xl font-extrabold text-blue-400">
              {mockStats.monthlyViews}
            </p>
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
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {mockQuotes.map((q) => (
                  <tr key={q.id}>
                    <td className="py-3 font-mono text-emerald-400">{q.id}</td>
                    <td className="py-3 font-semibold text-slate-200">{q.client}</td>
                    <td className="py-3">{q.product}</td>
                    <td className="py-3">
                      <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}