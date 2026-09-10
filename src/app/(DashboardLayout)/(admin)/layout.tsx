import AdminSidebar from "./_component/shared/admin-sidebar";
import AdminTopbar from "./_component/shared/admin-topbar";
import { getCurrentUser } from "@/services/auth.service";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const roleLabel =
    user?.systemRole === "super_admin" ? "Super Admin" : "Admin";

  return (
    <div className="admin-panel flex min-h-screen bg-muted/50">
      <AdminSidebar />

      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminTopbar roleLabel={roleLabel} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
