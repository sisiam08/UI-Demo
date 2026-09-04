import { ProfileRole } from "./profile.interface";
import { IUser } from "./user.interface";

export type StartupStage =
  | "idea"
  | "prototype"
  | "mvp"
  | "launched"
  | "scaling";

export type StartupStatus = "open" | "closed";
export type RequirementStatus = "open" | "closed";

export interface ICofounderRequirement {
  id: string;
  startupIdea?: IStartupIdea;
  requiredRole: ProfileRole;
  requiredSkills: string[];
  requiredWeeklyCommitment: number;
  equityOffered: number;
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IStartupIdea {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  industries: string[];
  startupStage: StartupStage;
  status: StartupStatus;
  requirements?: ICofounderRequirement[];
  owner?: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IRequirementWithScore {
  requirement: ICofounderRequirement;
  compatibilityScore: number;
}
