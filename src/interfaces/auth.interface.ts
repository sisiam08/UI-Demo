import { SystemRole } from "@/constants/user-role";
import { IUser } from "./user.interface";
import { InternalAxiosRequestConfig } from "axios";

export interface IAuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ISignupResponse {
  message: string;
  expiresAt: string;
}

export interface IAuthRouteRule {
  match: (pathname: string) => boolean;
  allowedRoles: SystemRole[];
}

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
