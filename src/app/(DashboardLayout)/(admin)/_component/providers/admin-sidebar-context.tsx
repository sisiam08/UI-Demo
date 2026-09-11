"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminSidebarContextValue {
  isMobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(
  null
);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <AdminSidebarContext.Provider
      value={{
        isMobileOpen,
        openMobile: () => setIsMobileOpen(true),
        closeMobile: () => setIsMobileOpen(false),
        toggleMobile: () => setIsMobileOpen((prev) => !prev),
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) {
    throw new Error(
      "useAdminSidebar must be used within AdminSidebarProvider"
    );
  }
  return ctx;
}