import { format } from "date-fns";
import type { LogEntryType } from "@/types";

const CSV_HEADERS = [
  "Date",
  "From",
  "To",
  "Amount Sent",
  "Amount Received",
  "Rate",
];

// Wraps a field in quotes and escapes embedded quotes if it contains a
// character that would otherwise break the CSV structure (comma, quote,
// or newline). None of the current fields need this, but it keeps the
// export safe if richer data (e.g. currency names) is added later.
function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildCsvContent(entries: LogEntryType[]): string {
  const rows = entries.map((entry) => [
    format(new Date(entry.createdAt), "yyyy-MM-dd HH:mm"),
    entry.fromCurrency,
    entry.toCurrency,
    entry.sendAmount.toFixed(2),
    entry.receiveAmount.toFixed(2),
    entry.rate.toFixed(4),
  ]);

  return [CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n");
}

// Triggers a browser download of the conversion log as a CSV file.
// Entries are sorted oldest-first so the file reads chronologically,
// even though the log UI itself lists newest-first.
export function exportLogToCsv(entries: LogEntryType[]): void {
  if (entries.length === 0) return;

  const chronological = [...entries].sort((a, b) => a.createdAt - b.createdAt);
  const csvContent = buildCsvContent(chronological);

  // Leading BOM so Excel opens the UTF-8 file without mangling characters.
  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `fx-checker-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
