"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AuthProvider } from "@/components/admin/AuthProvider";
import { AdminGuard } from "@/components/admin/AdminGuard";
import "../globals.css";

const STANDALONE_PATHS = ["/admin/login"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const standalone = STANDALONE_PATHS.includes(pathname);

  return (
    <AuthProvider>
      <AdminGuard>
        {standalone ? <>{children}</> : <AdminShell>{children}</AdminShell>}
      </AdminGuard>
    </AuthProvider>
  );
}
