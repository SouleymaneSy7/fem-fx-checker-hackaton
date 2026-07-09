import axios from "axios";

import type {
  CreateLogEntryInputType,
  LogEntryRowType,
} from "@/types/api.types";
import type { LogEntryType } from "@/types/data.types";

// The API returns `createdAt` as an ISO string (Date serializes that way
// through JSON) — LogEntryType expects a number (Date.now()-style), same
// as the client-generated entries in log-store.ts.
function toLogEntryType(row: LogEntryRowType): LogEntryType {
  return { ...row, createdAt: new Date(row.createdAt).getTime() };
}

export async function fetchLogEntries(): Promise<LogEntryType[]> {
  const { data } = await axios.get<LogEntryRowType[]>("/api/logs");
  return data.map(toLogEntryType);
}

export async function createLogEntry(
  entry: CreateLogEntryInputType,
): Promise<LogEntryType> {
  const { data } = await axios.post<LogEntryRowType>("/api/logs", entry);
  return toLogEntryType(data);
}

export async function deleteLogEntry(id: string): Promise<void> {
  await axios.delete(`/api/logs/${id}`);
}

export async function deleteLogEntriesForPair(
  fromCurrency: string,
  toCurrency: string,
): Promise<void> {
  await axios.delete("/api/logs", {
    params: { from: fromCurrency, to: toCurrency },
  });
}

export async function deleteAllLogEntries(): Promise<void> {
  await axios.delete("/api/logs");
}
