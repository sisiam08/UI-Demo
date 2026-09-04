import { IUser } from "./user.interface";

export type ProfileRole =
  | "technical"
  | "product"
  | "design"
  | "marketing"
  | "business";

export type UserStatus = "active" | "suspended" | "banned";

export interface IProfile {
  id: string;
  bio: string | null;
  role: ProfileRole;
  skills: string[];
  interestedIndustries: string[];
  availableWeeklyCommitment: number;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  location: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
}

export interface IProfileFormValues {
  role: ProfileRole;
  skills: string[];
  interestedIndustries: string[];
  availableWeeklyCommitment: number;
  bio?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  location?: string;
  photoUrl?: string | null;
}
