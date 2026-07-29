import VisuallyHidden from "@/components/common/visually-hidden";
import { cn } from "@/lib/utils";
import type { TrendIndicatorPropsType } from "@/types";

/**
 * Direction arrow (▲/▼) plus a formatted value (e.g. "+2.34%"). The glyph
 * is decorative and hidden from assistive tech — direction is announced
 * as "Up"/"Down" via VisuallyHidden, while the value itself stays as
 * regular, readable text.
 */
const TrendIndicator = ({
  isPositive,
  value,
  className,
}: TrendIndicatorPropsType) => {
  return (
    <span className={cn("inline-flex items-center gap-step-050", className)}>
      <VisuallyHidden>{isPositive ? "Up" : "Down"}</VisuallyHidden>
      <span aria-hidden="true">{isPositive ? "▲" : "▼"}</span>
      <span>{value}</span>
    </span>
  );
};

TrendIndicator.displayName = "TrendIndicator";

export default TrendIndicator;
