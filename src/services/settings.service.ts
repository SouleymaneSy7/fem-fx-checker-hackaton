import axios from "axios";

import { ENDPOINT_SETTINGS } from "@/constants";
import type { UpdateSettingsInputType, UserSettingsRowType } from "@/types";

// `null` means the signed-in user has never saved a custom setting yet —
// see app/api/settings/route.ts for why that's a meaningful value
// distinct from "every field happens to be null".
export async function fetchSettings(): Promise<UserSettingsRowType | null> {
  const { data } = await axios.get<UserSettingsRowType | null>(
    ENDPOINT_SETTINGS,
  );
  return data;
}

export async function updateSettings(
  input: UpdateSettingsInputType,
): Promise<UserSettingsRowType> {
  const { data } = await axios.patch<UserSettingsRowType>(
    ENDPOINT_SETTINGS,
    input,
  );
  return data;
}
