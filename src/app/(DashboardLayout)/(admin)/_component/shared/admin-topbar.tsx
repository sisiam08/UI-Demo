"use client";

import { Shield } from "lucide-react";

import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AdminTopbar({ roleLabel }: { roleLabel: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        {/* <div className="flex size-8 items-center justify-center rounded-lg bg-admin-chrome-accent text-white">
          <Shield className="size-5" />
        </div>
        <span className="font-bold">Admin</span> */}
      </div>
      <div className="hidden items-center gap-2 lg:flex">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
          <Shield className="size-3" />
          Viewing as {roleLabel}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
