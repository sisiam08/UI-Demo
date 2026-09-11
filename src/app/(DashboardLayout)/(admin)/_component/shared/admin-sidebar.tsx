"use client";

import {
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Megaphone,
  Rocket,
  ScrollText,
  Shield,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { logout } from "@/services/auth.service";
import { useAdminSidebar } from "../providers/admin-sidebar-context";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/startups", label: "Startups", icon: Rocket },
  { href: "/admin/requirements", label: "Requirements", icon: ListChecks },
  { href: "/admin/applications", label: "Applications", icon: FileText },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
  { href: "/admin/broadcast", label: "Broadcast", icon: Megaphone },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      toast.add({ type: "error", description: getApiErrorMessage(error) });
    } finally {
      router.push("/login");
    }
  }

  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-admin-chrome-border px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-admin-chrome-accent text-white">
          <Shield className="size-5" />
        </div>
        <span className="text-lg font-bold tracking-tight">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin/dashboard"
              ? pathname === "/admin/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-admin-chrome-active text-admin-chrome-fg"
                  : "text-admin-chrome-fg-muted hover:bg-admin-chrome-active hover:text-admin-chrome-fg"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-admin-chrome-border p-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const { isMobileOpen, closeMobile } = useAdminSidebar();

  return (
    <>
      {/* Desktop — age jemon chilo temon-i */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-admin-chrome-border bg-admin-chrome-bg text-admin-chrome-fg lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-admin-chrome-border bg-admin-chrome-bg text-admin-chrome-fg lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <X className="size-5" />
            </Button>
            <SidebarContent onNavigate={closeMobile} />
          </aside>
        </>
      )}
    </>
  );
}