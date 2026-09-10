import type { IUser, ISignupResponse, IUserSession } from "@/interfaces";
import { httpDelete, httpGet, httpPatch, httpPost } from "@/lib/http";

export const getCurrentUser = async (): Promise<IUser | null> => {
  const response = await httpGet<IUser>("/auth/me");
  if (!response || !response.success) return null;
  return response.data;
};

export const login = async (userInfo: {
  email: string;
  password: string;
}): Promise<IUser> => {
  const response = await httpPost<IUser>("/auth/login", userInfo);
  return response.data;
};

export const signup = async (userInfo: {
  fullName: string;
  email: string;
  password: string;
}): Promise<ISignupResponse> => {
  const response = await httpPost<ISignupResponse>("/auth/signup", userInfo);
  return response.data;
};

export const verifyOtp = async (data: {
  email: string;
  code: string;
}): Promise<IUser> => {
  const response = await httpPost<IUser>("/auth/signup/verify-otp", data);
  return response.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await httpPatch("/auth/change-password", data);
};

export const logout = async (): Promise<void> => {
  
  await httpPost("/auth/logout", {});
};

export const getActiveSessions = async (): Promise<IUserSession[]> => {
  const response = await httpGet<IUserSession[]>("/auth/active-sessions");
  return response.data;
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  await httpDelete(`/auth/sessions/${sessionId}`);
};
