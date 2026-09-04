"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Navbar from "./_component/shared/navbar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/onboarding";

  return (
    <div className="flex min-h-screen flex-col">
      {!isOnboarding && <Navbar />}
      <main
        className={cn(
          "mx-auto w-full flex-1",
          !isOnboarding && "max-w-7xl px-4 py-6 sm:px-6 sm:py-8"
        )}
      >
        {children}
      </main>
    </div>
  );
}
