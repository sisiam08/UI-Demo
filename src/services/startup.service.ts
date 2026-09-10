import type { IStartupIdea, ProfileRole, StartupStage } from "@/interfaces";
import { httpDelete, httpGet, httpPatch, httpPost } from "@/lib/http";

export interface StartupInput {
  title: string;
  shortDescription: string;
  fullDescription: string;
  industries: string[];
  startupStage: StartupStage;
}

export interface AddRequirementInput {
  requiredRole: ProfileRole;
  requiredSkills: string[];
  requiredWeeklyCommitment: number;
  equityOffered: number;
}

export const getMyStartups = async (): Promise<IStartupIdea[]> => {
  const response = await httpGet<IStartupIdea[]>("/startups/mine");
  return response.data;
};

export const getStartupById = async (id: string): Promise<IStartupIdea> => {
  const response = await httpGet<IStartupIdea>(`/startups/${id}`);
  return response.data;
};

export const createStartup = async (
  data: StartupInput
): Promise<IStartupIdea> => {
  const response = await httpPost<IStartupIdea>("/startups", data);
  return response.data;
};

export const updateStartup = async (
  id: string,
  data: StartupInput
): Promise<IStartupIdea> => {
  const response = await httpPatch<IStartupIdea>(`/startups/${id}`, data);
  return response.data;
};

export const deleteStartup = async (id: string): Promise<void> => {
  await httpDelete(`/startups/${id}`);
};

export const closeStartup = async (id: string): Promise<void> => {
  await httpPatch(`/startups/${id}/close`);
};

export const addRequirement = async (
  id: string,
  data: AddRequirementInput
): Promise<void> => {
  await httpPost(`/startups/${id}/requirements`, data);
};
