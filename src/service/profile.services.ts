import type { IProfile, IProfileFormValues } from "@/interfaces";
import { httpGet, httpPatch, httpPost, httpUpload } from "@/lib/http";

export const getMyProfile = async (): Promise<IProfile> => {
  const response = await httpGet<IProfile>("/profile/me");
  return response.data;
};

export const getProfileById = async (userId: string): Promise<IProfile> => {
  const response = await httpGet<IProfile>(`/profile/${userId}`);
  return response.data;
};

export const createProfile = async (
  data: Partial<IProfileFormValues>
): Promise<IProfile> => {
  const response = await httpPost<IProfile>("/profile", data);
  return response.data;
};

export const updateProfile = async (
  data: Partial<IProfileFormValues>
): Promise<IProfile> => {
  const response = await httpPatch<IProfile>("/profile/me", data);
  return response.data;
};

export const uploadProfilePhoto = async (
  formData: FormData
): Promise<{ photoUrl: string }> => {
  const response = await httpUpload<{ photoUrl: string }>(
    "/profile/photo",
    formData
  );
  return response.data;
};
