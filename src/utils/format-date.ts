import { differenceInHours, differenceInMinutes, format } from "date-fns";

export const formatRelativeTime = (isoDate: string) => {
  const loggedDate = new Date(isoDate);
  const now = new Date();

  const diffMinutes = differenceInMinutes(now, loggedDate);

  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = differenceInHours(now, loggedDate);
  if (diffHours < 24) return `${diffHours}h`;

  return format(loggedDate, "d MMM");
};
