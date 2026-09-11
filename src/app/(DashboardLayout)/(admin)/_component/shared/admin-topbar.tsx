"use client";

import { Menu, Shield } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interfaces";
import { useAdminSidebar } from "../providers/admin-sidebar-context";

export default function AdminTopbar({ userInfo }: { userInfo: IUser | null }) {
  const { toggleMobile } = useAdminSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobile}
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
            <Shield className="size-3" />
            Viewing as{" "}
            {userInfo?.systemRole === "super_admin" ? "Super Admin" : "Admin"}
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
          <span className="text-sm font-medium">{userInfo?.fullName}</span>
          <p className="text-xs text-muted-foreground">{userInfo?.email}</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}