import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/admin/login" });
      } else {
        setUserEmail(session.user.email ?? "Administrator");
      }
      setAuthChecking(false);
    }
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 font-mono text-xs text-slate-400">
        Verifying admin session credentials...
      </div>
    );
  }

  const navItems = [
    { label: "Overview", path: "/admin", icon: "📊" },
    { label: "Products", path: "/admin/products", icon: "📦" },
    { label: "Gallery", path: "/admin/gallery", icon: "🖼️" },
    { label: "Quotes", path: "/admin/quotes", icon: "📑" },
    { label: "Contacts", path: "/admin/contacts", icon: "💬" },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Navigation Sidebar */}
      <aside className="flex w-64 flex-col justify-between border-r border-slate-800 bg-slate-900/50 p-4">
        <div>
          <div className="mb-6 border-b border-slate-800/80 px-3 py-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
              Deco Galleria
            </span>
            <h2 className="text-base font-bold text-white">Admin Control</h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.path === "/admin"
                  ? currentPath === "/admin" || currentPath === "/admin/"
                  : currentPath.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <span>{item.icon}</span> {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800/80 px-2 pt-4">
          <div className="mb-3 px-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Signed in as
            </p>
            <p className="truncate text-xs font-medium text-slate-300">
              {userEmail}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 py-2 text-xs font-bold text-red-400 transition-all hover:bg-red-500/20"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Section Beside Sidebar */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        {children}
      </main>
    </div>
  );
}