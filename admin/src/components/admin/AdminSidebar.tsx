"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, BookOpen, Users, FolderOpen,
  Star, HelpCircle, Timer, ClipboardList, Image as ImageIcon,
  Settings, ChevronLeft, LogOut, PenLine, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const groups: NavGroup[] = [
  {
    title: "",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { label: "Content", href: "/admin/content", icon: FileText },
      { label: "Courses", href: "/admin/courses", icon: BookOpen },
      { label: "Faculty", href: "/admin/teachers", icon: Users },
      { label: "Resources", href: "/admin/resources", icon: FolderOpen },
      { label: "Blog", href: "/admin/blog", icon: PenLine },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    title: "Leads",
    items: [
      { label: "Registrations", href: "/admin/registrations", icon: ClipboardList },
      { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
    ],
  },
  {
    title: "Exam Tools",
    items: [
      { label: "Exam Timers", href: "/admin/exam-timers", icon: Timer },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const initials = (user?.email ?? "AD")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col bg-bg border-r border-border w-[240px]">
      {/* Brand */}
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex items-center gap-2.5 h-14 px-5 border-b border-border shrink-0"
      >
        <div className="w-7 h-7 rounded-[6px] bg-accent flex items-center justify-center text-white font-bold text-[13px]">
          T
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold text-ink">TAG Admin</span>
          <span className="text-[10px] text-ink-faint">Ark Global Educators</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                {group.title}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-[13px] transition-colors",
                      active
                        ? "bg-accent-soft text-accent-ink font-medium"
                        : "text-ink-soft hover:bg-bg-muted",
                    )}
                  >
                    <Icon size={16} className={active ? "text-accent" : "text-ink-muted"} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-bg-muted flex items-center justify-center text-[11px] font-semibold text-ink-soft">
            {initials}
          </div>
          <div className="flex flex-col leading-tight min-w-0 flex-1">
            <span className="text-[12px] font-medium text-ink truncate">
              {user?.email ?? "Admin"}
            </span>
            <span className="text-[10px] text-ink-faint truncate">Signed in</span>
          </div>
          <button
            onClick={() => signOut()}
            title="Sign out"
            className="p-1.5 rounded-[6px] text-ink-muted hover:bg-bg-muted hover:text-ink transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
