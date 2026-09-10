import { notFound } from "next/navigation";

import { UserDetailClient } from "../../../_component/user-detail-client";
import { SystemRole } from "@/constants/user-role";
import type { IUserSession } from "@/interfaces";
import {
  getAdminUserById,
  getAdminUserSessions,
  type AdminUserDetail,
} from "@/services/admin.service";
import { getCurrentUser } from "@/service/auth.services";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let user: AdminUserDetail | null = null;
  let sessions: IUserSession[] = [];
  let isSuperAdmin = false;

  try {
    const [userRes, sessionsRes, current] = await Promise.all([
      getAdminUserById(id),
      getAdminUserSessions(id),
      getCurrentUser(),
    ]);
    user = userRes;
    sessions = sessionsRes;
    isSuperAdmin = current?.systemRole === SystemRole.SUPER_ADMIN;
  } catch {
    user = null;
  }

  if (!user) {
    notFound();
  }

  return (
    <UserDetailClient
      user={user}
      sessions={sessions}
      isSuperAdmin={isSuperAdmin}
    />
  );
}
