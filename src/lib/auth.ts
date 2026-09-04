import { IUser } from "@/interfaces/user.interface";
import { httpGet } from "./http";

export const getCurrentUser = async (): Promise<IUser | null> => {
  try {
    const response = await httpGet<IUser>("/auth/me");

    if (!response || !response.success) {
      return null;
    }

    return response.data;
  } catch (error) {
    return null;
  }
};
