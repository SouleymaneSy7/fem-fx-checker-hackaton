import { cn } from "@/lib/utils";
import type { IconPropsType } from "@/types/ui.types";

/**
 * Anything renderable by this wrapper: a lucide-react icon, or a local SVG
 * converted into a plain React component (see components/icons/*).
 * Both shapes render to a real <svg>, so they're interchangeable here.
 */

export function Icon({
  icon: IconComponent,
  size = 20,
  label,
  className,
  ...delegatedProps
}: IconPropsType) {
  if (!IconComponent) return null;

  return (
    <IconComponent
      width={size}
      height={size}
      focusable="false"
      className={cn("shrink-0", className)}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
      {...delegatedProps}
    />
  );
}

Icon.displayName = "Icon";
