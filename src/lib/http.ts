import api from "./api-client";
import { IApiResponse } from "@/interfaces";

export const httpGet = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<IApiResponse<T>> => {
  const response = await api.get<IApiResponse<T>>(endpoint, {
    params,
  });

  return response.data;
};

export const httpPost = async <T>(
  endpoint: string,
  data?: any,
  params?: Record<string, any>
): Promise<IApiResponse<T>> => {
  const response = await api.post<IApiResponse<T>>(endpoint, data, {
    params,
  });

  return response.data;
};

export const httpPatch = async <T>(
  endpoint: string,
  data?: any,
  params?: Record<string, any>
): Promise<IApiResponse<T>> => {
  const response = await api.patch<IApiResponse<T>>(endpoint, data, {
    params,
  });

  return response.data;
};

export const httpDelete = async <T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<IApiResponse<T>> => {
  const response = await api.delete<IApiResponse<T>>(endpoint, {
    params,
  });

  return response.data;
};

export const httpUpload = async <T>(
  endpoint: string,
  formData: FormData
): Promise<IApiResponse<T>> => {
  const response = await api.post<IApiResponse<T>>(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
