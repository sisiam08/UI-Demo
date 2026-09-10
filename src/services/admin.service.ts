import type { SystemRole } from "@/constants/user-role";
import type {
  AdminApplicationsPage,
  AdminApplicationStats,
  AdminOverview,
  AdminRequirementsPage,
  AdminRequirementStats,
  AdminSignupRow,
  AdminStartupsPage,
  AdminUserDetail,
  AdminUserQuery,
  AdminUsersPage,
  IUserSession,
  UserStatus,
} from "@/interfaces";
import { httpDelete, httpGet, httpPatch } from "@/lib/http";


export const getAdminOverview = async (): Promise<AdminOverview> => {
  const response = await httpGet<AdminOverview>("/admin/stats/overview");
  return response.data;
};

export const getAdminApplicationStats =
  async (): Promise<AdminApplicationStats> => {
    const response = await httpGet<AdminApplicationStats>(
      "/admin/stats/applications"
    );
    return response.data;
  };

export const getAdminRequirementStats =
  async (): Promise<AdminRequirementStats> => {
    const response = await httpGet<AdminRequirementStats>(
      "/admin/stats/requirements"
    );
    return response.data;
  };

export const getAdminUserSignups = async (): Promise<AdminSignupRow[]> => {
  const response = await httpGet<AdminSignupRow[]>("/admin/stats/users");
  return response.data;
};

export const getAdminUsers = async (
  params: AdminUserQuery = {}
): Promise<AdminUsersPage> => {
  const query: Record<string, string> = {};
  if (params.status && params.status !== "all") query.status = params.status;
  if (params.role && params.role !== "all") query.role = params.role;
  if (params.search) query.search = params.search;
  if (params.page) query.page = String(params.page);
  const response = await httpGet<AdminUsersPage>("/users", query);
  return response.data;
};

export const getAdminUserById = async (
  id: string
): Promise<AdminUserDetail> => {
  const response = await httpGet<AdminUserDetail>(`/users/${id}`);
  return response.data;
};

export const getAdminUserSessions = async (
  id: string
): Promise<IUserSession[]> => {
  const response = await httpGet<IUserSession[]>(`/users/${id}/sessions`);
  return response.data;
};

export const updateUserStatus = async (
  id: string,
  data: { status: UserStatus; reason?: string }
): Promise<void> => {
  await httpPatch(`/users/${id}/status`, data);
};

export const updateUserRole = async (
  id: string,
  role: SystemRole
): Promise<void> => {
  await httpPatch(`/users/${id}/role`, { systemRole: role });
};

export const revokeAdminSession = async (sessionId: string): Promise<void> => {
  await httpDelete(`/users/sessions/${sessionId}`);
};

export const revokeAllUserSessions = async (id: string): Promise<void> => {
  await httpDelete(`/users/${id}/sessions`);
};

export const getAdminApplications = async (params: {
  status?: string;
  requirementId?: string;
  candidateId?: string;
  page?: number;
}): Promise<AdminApplicationsPage> => {
  const query: Record<string, string> = {};
  if (params.status && params.status !== "all") query.status = params.status;
  if (params.requirementId) query.requirementId = params.requirementId;
  if (params.candidateId) query.candidateId = params.candidateId;
  if (params.page) query.page = String(params.page);
  const response = await httpGet<AdminApplicationsPage>(
    "/applications/list",
    query
  );
  return response.data;
};

export const getAdminRequirements = async (params: {
  status?: string;
  role?: string;
  page?: number;
}): Promise<AdminRequirementsPage> => {
  const query: Record<string, string> = {};
  if (params.status && params.status !== "all") query.status = params.status;
  if (params.role && params.role !== "all") query.role = params.role;
  if (params.page) query.page = String(params.page);
  const response = await httpGet<AdminRequirementsPage>(
    "/requirements/requirements-list",
    query
  );
  return response.data;
};

export const closeRequirement = async (id: string): Promise<void> => {
  await httpPatch(`/requirements/requirements/${id}/close`);
};

export const getAdminStartups = async (params: {
  status?: string;
  search?: string;
  page?: number;
}): Promise<AdminStartupsPage> => {
  const query: Record<string, string> = {};
  if (params.status && params.status !== "all") query.status = params.status;
  if (params.search) query.search = params.search;
  if (params.page) query.page = String(params.page);
  const response = await httpGet<AdminStartupsPage>("/startups/all", query);
  return response.data;
};
