import axios from "axios";
import { HTTP_TIMEOUT_MS } from "@/constants";
import { env } from "@/env";

export const httpClient = axios.create({
  baseURL: env.NEXT_PUBLIC_EXCHANGE_API_BASE, // https://api.frankfurter.dev/v2
  timeout: HTTP_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Network request failed";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);
