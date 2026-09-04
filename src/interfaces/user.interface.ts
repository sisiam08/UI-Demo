import { SystemRole } from "@/constants/user-role";

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  systemRole: SystemRole;
  status: string;
  createdAt: Date;
}
