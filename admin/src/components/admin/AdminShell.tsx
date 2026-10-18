"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-scope h-screen flex overflow-hidden bg-bg-subtle">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block shrink-0">
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative">
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
