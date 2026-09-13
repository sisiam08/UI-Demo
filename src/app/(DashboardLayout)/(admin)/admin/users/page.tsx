import type { AdminUsersPage } from "@/interfaces";
import UsersClient from "../../_component/user/users-client";
import { getAdminUsers } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  let data: AdminUsersPage = { users: [], total: 0, page: 1, limit: 20 };
  let initialError: string | undefined;
  try {
    data = await getAdminUsers({ page: 1 });
  } catch {
    initialError = "Unable to load users.";
  }

  return (
    <UsersClient
      initialUsers={data.users}
      initialTotal={data.total}
      initialLimit={data.limit}
      initialError={initialError}
    />
  );
}
