import type { LucideIcon } from "lucide-react";
import type * as React from "react";
import type { TickerPairType } from "./data.types";

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
  availableCurrencies: number | string;
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

export type TickerPropsType = {
  pairs: TickerPairType[];
};

/* ── Input ─────────────────────────────────────────────────── */

export interface SearchInputPropsType
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: IconSource;
}

/* ── HistoryStat ─────────────────────────────────────────────────── */

export type HistoryStatPropsType = {
  label: string;
  value: React.ReactNode;
  tone?: "positive" | "negative" | "neutral";
};
