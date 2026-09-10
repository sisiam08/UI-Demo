import type { IApplication } from "@/interfaces";
import { httpGet, httpPatch } from "@/lib/http";

export const getMyApplications = async (): Promise<IApplication[]> => {
  const response = await httpGet<IApplication[]>("/applications/mine");
  return response.data;
};

export const getReceivedApplications = async (): Promise<IApplication[]> => {
  const response = await httpGet<IApplication[]>("/applications/received");
  return response.data;
};

export const withdrawApplication = async (id: string): Promise<void> => {
  await httpPatch(`/applications/${id}/withdraw`);
};

export const acceptApplication = async (id: string): Promise<void> => {
  await httpPatch(`/applications/${id}/accept`);
};

export const rejectApplication = async (id: string): Promise<void> => {
  await httpPatch(`/applications/${id}/reject`);
};
