import type { IApplication, IRequirementWithScore } from "@/interfaces";
import { httpGet, httpPost } from "@/lib/http";

export interface BrowseRequirementsParams {
  role?: string;
  industry?: string;
  stage?: string;
  cursor?: { createdAt: string; id: string };
}

export interface BrowseRequirementsResult {
  data: IRequirementWithScore[];
  nextCursor: { createdAt: string; id: string } | null;
}

export const getBrowseRequirements = async (
  params: BrowseRequirementsParams = {}
): Promise<BrowseRequirementsResult> => {
  const query: Record<string, string> = {};
  if (params.role && params.role !== "all") query.role = params.role;
  if (params.industry && params.industry !== "all") {
    query.industry = params.industry;
  }
  if (params.stage && params.stage !== "all") query.stage = params.stage;
  if (params.cursor) query.cursor = JSON.stringify(params.cursor);

  const response = await httpGet<BrowseRequirementsResult>(
    "/requirements/browse",
    query
  );
  return response.data;
};

export const getRequirementDetails = async (
  id: string
): Promise<IRequirementWithScore> => {
  const response = await httpGet<IRequirementWithScore>(`/requirements/${id}`);
  return response.data;
};

export const getRequirementApplications = async (
  id: string
): Promise<IApplication[]> => {
  const response = await httpGet<IApplication[]>(
    `/requirements/${id}/applications`
  );
  return response.data;
};

export const applyToRequirement = async (id: string): Promise<void> => {
  await httpPost(`/requirements/${id}/apply`);
};
