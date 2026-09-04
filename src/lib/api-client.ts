import { envConfig } from "@/env";
import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { IApiResponse } from "@/interfaces";

const API_URL = envConfig.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

const getServerCookieHeader = async (): Promise<string> => {
  if (typeof window !== "undefined") {
    return "";
  }

  try {
    const { cookies, headers } = await import("next/headers");

    try {
      const cookieStore = await cookies();
      const cookieList = cookieStore.getAll();
      return cookieList
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");
    } catch {
      const requestHeaders = await headers();
      return requestHeaders.get("cookie") ?? "";
    }
  } catch {
    return "";
  }
};

const createApiClient = (cookieHeader?: string) =>
  axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 30_000,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

export const api = createApiClient();

export const getServerApiClient = async () => {
  const cookieHeader = await getServerCookieHeader();
  return createApiClient(cookieHeader);
};

let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = async (client = api): Promise<void> => {
  await client.post<IApiResponse<void>>(
    "/auth/refresh",
    {},
    { withCredentials: true }
  );
};

const getRefreshPromise = (client = api) => {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken(client).finally(() => {
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
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        await getRefreshPromise(api);
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

    return Promise.reject(error);
  }
);

export default api;
