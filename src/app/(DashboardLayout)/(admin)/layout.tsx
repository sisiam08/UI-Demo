import { AdminSidebarProvider } from "./_component/providers/admin-sidebar-context";
import AdminSidebar from "./_component/shared/admin-sidebar";
import AdminTopbar from "./_component/shared/admin-topbar";
import { getCurrentUser } from "@/services/auth.service";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <AdminSidebarProvider>
      <div className="admin-panel flex min-h-screen bg-muted/50">
        <AdminSidebar />

        <div className="flex flex-1 flex-col lg:pl-64">
          <AdminTopbar userInfo={user} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminSidebarProvider>
  );
}
