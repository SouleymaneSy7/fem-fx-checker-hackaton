import axios from "axios";

import { ENDPOINT_ALERTS } from "@/constants";
import type { AlertRowType, UpdateAlertInputType } from "@/types/api.types";
import type { RateAlertType } from "@/types/data.types";

function toRateAlertType(row: AlertRowType): RateAlertType {
  return {
    ...row,
    condition: row.condition as RateAlertType["condition"],
    createdAt: new Date(row.createdAt).getTime(),
    triggeredAt: row.triggeredAt ? new Date(row.triggeredAt).getTime() : null,
  };
}

export async function fetchAlerts(): Promise<RateAlertType[]> {
  const { data } = await axios.get<AlertRowType[]>(ENDPOINT_ALERTS);
  return data.map(toRateAlertType);
}

export async function createAlert(
  fromCurrency: string,
  toCurrency: string,
  condition: RateAlertType["condition"],
  threshold: number,
): Promise<RateAlertType> {
  const { data } = await axios.post<AlertRowType>(ENDPOINT_ALERTS, {
    fromCurrency,
    toCurrency,
    condition,
    threshold,
  });
  return toRateAlertType(data);
}

export async function updateAlert(
  id: string,
  input: UpdateAlertInputType,
): Promise<void> {
  await axios.patch(`${ENDPOINT_ALERTS}/${id}`, input);
}

export async function deleteAlert(id: string): Promise<void> {
  await axios.delete(`${ENDPOINT_ALERTS}/${id}`);
}
