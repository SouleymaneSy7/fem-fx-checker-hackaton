import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import type {
  CompareChartPointType,
  RatePointType,
  RateRangeType,
  RecentPairType,
} from "./data.types";

/* ────────────────────────────────────────────────────────────────────────
 * Polymorphic component helpers
 * Shared by any component that supports a custom `as` prop while staying
 * fully typed against whatever element/component is passed.
 * ──────────────────────────────────────────────────────────────────────── */

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, Props> = keyof (AsProp<C> &
  Props);

export type PolymorphicProps<
  C extends React.ElementType,
  Props = Record<never, never>,
> = Props &
  AsProp<C> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>["ref"];

export type PolymorphicPropsWithRef<
  C extends React.ElementType,
  Props = Record<never, never>,
> = PolymorphicProps<C, Props> & { ref?: PolymorphicRef<C> };

/* ── Container ──────────────────────────────────────────────────────── */

export type ContainerPropsType<C extends React.ElementType> =
  PolymorphicPropsWithRef<C>;

/* ── List ───────────────────────────────────────────────────────────── */

export type ListPropsType<
  Item,
  As extends React.ElementType = "ul",
> = PolymorphicPropsWithRef<
  As,
  {
    items: Item[];
    renderItem: (item: Item, index: number) => React.ReactNode;
    keyExtractor?: (item: Item, index: number) => React.Key;
  }
>;

/* ── Title ──────────────────────────────────────────────────────────── */

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type TitlePropsType = {
  level?: HeadingLevel;
  as?: React.ElementType;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"h1">;

/* ── VisuallyHidden ─────────────────────────────────────────────────── */

export type VisuallyHiddenPropsType = React.ComponentPropsWithoutRef<"span">;

/* ── LoadingStatus ─────────────────────────────────────────────────── */

export type LoadingStatusPropsType = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

/* ── TruncateTooltip ─────────────────────────────────────────────────── */

export type TruncateTooltipPropsType = {
  children: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
};

/* ── Icon ─────────────────────────────────────────────────── */

export type IconSource =
  | LucideIcon
  | React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type IconPropsType = {
  icon: IconSource;
  size?: number | string;
  label?: string;
  className?: string;
} & Omit<React.SVGProps<SVGSVGElement>, "width" | "height">;

/* ── Navbar ─────────────────────────────────────────────────── */

export interface NavbarPropsType {
  availableCurrencies: number | undefined;
  isLoading: boolean;
}

/* ── Main Component ─────────────────────────────────────────────────── */

export type MainPropsType = {
  children: React.ReactNode;
};

/* ── Marquee ─────────────────────────────────────────────────── */

export type MarqueePropsType = {
  children: React.ReactNode;
  gap?: number;
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
};

/* ── Ticker ─────────────────────────────────────────────────── */

export type TickerPairType = {
  id: string;
  base: string;
  quote: string;
  rate: number;
  changePercent: number;
};

export type TickerPropsType = {
  pairs: TickerPairType[];
};

/* ── Input ─────────────────────────────────────────────────── */

export interface SearchInputPropsType
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconSource;
  keys?: { firstKey: string; secondKey: string };
}

export interface TextInputPropsType
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/* ── HistoryStat ─────────────────────────────────────────────────── */

export type HistoryStatPropsType = {
  label: string;
  value: React.ReactNode;
  tooltipContent?: string;
  tone?: "positive" | "negative" | "neutral";
};

/* ── TrendIndicator ─────────────────────────────────────────────────── */

export type TrendIndicatorPropsType = {
  isPositive: boolean;
  value: string;
  className?: string;
};

/* ── HistorySkeleton ─────────────────────────────────────────────────── */

export type HistorySkeletonPropsType = {
  pair: string;
};

/* ── Favorite ─────────────────────────────────────────────────── */

export type ButtonProps = {
  onToggle: () => void;
  label?: string;
  className?: string;
};

export type FavoritePropsType = {
  isFavorite: boolean;
  disabled?: boolean;
  isSyncing?: boolean;
} & ButtonProps;

export type DeleteButtonPropsType = {
  label?: string;
  className?: string;
} & React.ComponentProps<"button">;

/* ── Log ─────────────────────────────────────────────────── */

export type LogButtonPropsType = {
  isLogged: boolean;
  onToggle: () => void;
  disabled: boolean;
  isSyncing?: boolean;
  label?: string;
  className?: string;
};

/* ── RateRange ─────────────────────────────────────────────────── */

export type RangeSelectorPropsType = {
  value: RateRangeType;
  onValueChange: (range: RateRangeType) => void;
};

export type RateChartPropsType = {
  data: RatePointType[];
  pair: string;
  dateFormatter: (isoDate: string) => string;
};

export type CustomTooltipPropsType = {
  active?: boolean;
  payload?: { payload: RatePointType }[];
  pair: string;
  dateFormatter: (isoDate: string) => string;
};

/* ── CompareChart ─────────────────────────────────────────────────── */

export type CompareChartPropsType = {
  data: CompareChartPointType[];
  currencies: string[];
  dateFormatter: (isoDate: string) => string;
};

export type CompareChartTooltipPropsType = {
  active?: boolean;
  payload?: {
    dataKey: string;
    value: number;
    color: string;
    payload: CompareChartPointType;
  }[];
  label?: string;
  dateFormatter: (isoDate: string) => string;
};

/* ── CurrencyFlag ─────────────────────────────────────────────────── */

export type CurrencyFlagProps = {
  currencyCode: string;
  isLoading?: boolean;
  size?: number;
};

/* ── CurrencyPicker ─────────────────────────────────────────────────── */

export type CurrencyOptionType = {
  code: string;
  name: string;
  flag: string;
};

export type CurrencyPickerPropsType = {
  value: string;
  onValueChange: (code: string) => void;
  currencies: CurrencyOptionType[];
  popularCodes?: string[];
  recentPairs?: RecentPairType[];
  label: string;
  isLoading: boolean;
  className?: string;
  focusShortcutTarget?: "send" | "receive";
};

/* ── SWRProvider ─────────────────────────────────────────────────── */

export type SWRProviderPropsType = {
  children: React.ReactNode;
};

/* ── Auth ─────────────────────────────────────────────────── */

type onSuccess = {
  onSuccess: () => void;
};

export type SignUpFormPropsType = onSuccess;

export type SignInFormPropsType = onSuccess;

/* ── Alerts ─────────────────────────────────────────────────── */

export type AlertTogglePropsType = {
  fromCurrency: string;
  toCurrency: string;
  currentRate: number | undefined;
  label?: string;
  disabled?: boolean;
  className?: string;
};

/* ── ConfirmDialog ─────────────────────────────────────────────────── */

export type ConfirmDialogPropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  confirmVariant?: "destructive" | "primary";
};

/* ── StaggerItem ─────────────────────────────────────────────────── */

export type StaggerItemPropsType = {
  children: React.ReactNode;
  index: number;
  shouldReduceMotion: boolean | null;
};
