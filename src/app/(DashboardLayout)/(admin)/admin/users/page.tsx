import { UsersClient } from "../../_component/users-client";
import { getAdminUsers, type AdminUsersPage } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let data: AdminUsersPage = { users: [], total: 0, page: 1, limit: 20 };
  try {
    data = await getAdminUsers({ page: 1 });
  } catch {
    data = { users: [], total: 0, page: 1, limit: 20 };
  }

  return (
    <UsersClient
      initialUsers={data.users}
      initialTotal={data.total}
      initialLimit={data.limit}
    />
  );
}
