import type {
  ConverterSectionValueType,
  SettingsSectionValueType,
} from "@/types";

export const CONVERTER_SECTIONS: {
  value: ConverterSectionValueType;
  label: string;
}[] = [
  { value: "history", label: "History" },
  { value: "compare", label: "Compare" },
  { value: "heatmap", label: "Heatmap" },
  { value: "historicalRates", label: "Historical Rates" },
  { value: "favorites", label: "Favorites" },
  { value: "alerts", label: "Alerts" },
  { value: "log", label: "Log" },
];

export const SETTINGS_SECTIONS: {
  value: SettingsSectionValueType;
  label: string;
}[] = [
  { value: "profile", label: "Profile" },
  { value: "preferences", label: "Preferences" },
  { value: "interface", label: "Interface" },
  { value: "danger", label: "Danger Zone" },
];
