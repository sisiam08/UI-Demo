import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { CustomAxiosRequestConfig, IApiResponse } from "@/interfaces";
import { envConfig } from "@/env";

const API_URL = envConfig.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

export const getServerCookieHeader = async (): Promise<string> => {
  if (typeof window !== "undefined") {
    return "";
  }

  try {
    const { cookies } = await import("next/headers");

    const cookieStore = await cookies();

    return cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  } catch {
    return "";
  }
};

export const createApiClient = (cookieHeader?: string) =>
  axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader
        ? {
            Cookie: cookieHeader,
          }
        : {}),
    },
  });

const api = createApiClient();

const refreshClient = createApiClient();

const refreshAccessToken = async (): Promise<void> => {
  await refreshClient.post<IApiResponse<void>>("/auth/refresh", {});
};

let refreshPromise: Promise<void> | null = null;

const getRefreshPromise = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    const cookieHeader = await getServerCookieHeader();

    if (cookieHeader) {
      config.headers = config.headers ?? new AxiosHeaders();

      config.headers.set("Cookie", cookieHeader);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await getRefreshPromise();

      return api(originalRequest);
    } catch (refreshError) {
      if (typeof window !== "undefined") {
        const isLoginPage = window.location.pathname === "/login";

        if (!isLoginPage) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
