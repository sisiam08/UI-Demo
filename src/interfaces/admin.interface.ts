import type { SystemRole } from "@/constants/user-role";
import type {
  IApplication,
  ICofounderRequirement,
  IStartupIdea,
  IUser,
  UserStatus,
} from "@/interfaces";

export interface AdminOverview {
  users: number;
  startups: number;
  requirements: { open: number; closed: number };
  applications: Record<string, number>;
  messages: number;
  activeSessions: number;
}

export interface AdminApplicationStats {
  byStatus: Record<string, number>;
  averageCompatibilityScore: number;
}

export interface AdminRequirementStats {
  open: number;
  closed: number;
  byRole: Record<string, number>;
}

export interface AdminSignupRow {
  date: string;
  count: string;
}

export interface AdminUsersPage {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminStartupsPage {
  startups: IStartupIdea[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminRequirementsPage {
  requirements: ICofounderRequirement[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminApplicationsPage {
  applications: IApplication[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUserDetail {
  id: string;
  email: string;
  fullName: string;
  systemRole: SystemRole;
  status: UserStatus;
  suspendedReason: string | null;
  createdAt: string;
  profile?: unknown;
  startupIdeas?: IStartupIdea[];
  activeSessionsCount: number;
}

export interface AdminUserQuery {
  status?: string;
  role?: string;
  search?: string;
  page?: number;
}