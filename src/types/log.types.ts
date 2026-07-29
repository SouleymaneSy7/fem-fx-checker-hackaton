export type LogEntryType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  rate: number;
  createdAt: number;
};

export type LogStoreType = {
  entries: LogEntryType[];
  addEntry: (entry: Omit<LogEntryType, "id" | "createdAt">) => void;
  addLoggedEntry: (entry: LogEntryType) => void;
  removeEntry: (id: string) => void;
  removeEntriesForPair: (fromCurrency: string, toCurrency: string) => void;
  clearLog: () => void;
  replaceEntries: (entries: LogEntryType[]) => void;
};
