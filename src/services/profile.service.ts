import axios from "axios";

import { ENDPOINT_SETTINGS_EMAIL } from "@/constants";

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error ?? fallback;
  }
  return fallback;
}

export async function requestEmailChange(newEmail: string): Promise<void> {
  try {
    await axios.post(ENDPOINT_SETTINGS_EMAIL, { newEmail });
  } catch (error) {
    throw new Error(extractErrorMessage(error, "Couldn't send a code."));
  }
}

export async function confirmEmailChange(otp: string): Promise<string> {
  try {
    const { data } = await axios.patch<{ email: string }>(
      ENDPOINT_SETTINGS_EMAIL,
      { otp },
    );
    return data.email;
  } catch (error) {
    throw new Error(extractErrorMessage(error, "That code didn't work."));
  }
}
