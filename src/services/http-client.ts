import axios from "axios";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXCHANGE_API_BASE, // https://api.frankfurter.dev/v2
  timeout: 10_000,
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
