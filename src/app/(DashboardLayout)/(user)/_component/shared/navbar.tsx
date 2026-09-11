"use client";

import { useEffect, useRef, useState } from "react";

import {
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  MonitorSmartphone,
  Plus,
  Search,
  Settings,
  User,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { IUser } from "@/interfaces";
import { getApiErrorMessage } from "@/lib/api-error";
import { getCurrentUser, logout } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { initials } from "@/helpers/string-utils";

const NAV_LINKS = [
  { href: "/requirements/browse", label: "Browse", icon: Search },
  { href: "/applications/mine", label: "My Applications", icon: FileText },
  { href: "/applications/received", label: "Applicants", icon: UsersRound },
  { href: "/startups/mine", label: "My Startups", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

function isActive(pathname: string, href: string) {
  if (href === "/requirements/browse") {
    return pathname.startsWith("/requirements");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const USER_MENU = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/sessions", label: "Sessions", icon: MonitorSmartphone },
  { href: "/change-password", label: "Change Password", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((currentUser) => {
      if (active) setUser(currentUser);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Logo asLink={false} showText={false} iconSize={28} />
            <span className="hidden text-lg font-bold tracking-tight sm:block">
              FounderLink
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive(pathname, link.href) && "bg-muted text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            size="sm"
            nativeButton={false}
            className="hidden md:flex"
            render={<Link href="/startups/new" />}
          >
            <Plus className="size-4" />
            New Startup
          </Button>
          <ThemeToggle />

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <Avatar className="size-9">
                <AvatarFallback className="text-sm">
                  {user ? initials(user.fullName) : "?"}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
              >
                <div className="px-2.5 py-2">
                  <p className="truncate text-sm font-medium">
                    {user?.fullName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <div className="my-1 h-px bg-border" />
                {USER_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <item.icon className="size-4 text-muted-foreground" />
                    {item.label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm text-destructive transition-colors hover:bg-muted"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/20 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 top-16 z-40 border-b border-border bg-card px-4 pt-2 pb-4 shadow-lg md:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <Link
                href="/startups/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
              >
                <Plus className="size-4" />
                New Startup
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
