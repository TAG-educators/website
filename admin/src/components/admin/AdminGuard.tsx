"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_ADMIN_PATHS.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/admin/login");
    }
    if (!loading && user && isPublic) {
      router.replace("/admin");
    }
  }, [user, loading, isPublic, router]);

  // While resolving session, show a minimal loader (but not on login page)
  if (loading && !isPublic) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-subtle">
        <div className="text-[13px] text-ink-faint">Loading…</div>
      </div>
    );
  }

  // If unauthenticated and on a protected route, render nothing (redirect pending)
  if (!user && !isPublic) return null;

  return <>{children}</>;
}