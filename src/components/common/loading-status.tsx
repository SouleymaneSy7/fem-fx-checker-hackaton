import type { LoadingStatusPropsType } from "@/types/ui.types";
import VisuallyHidden from "./visually-hidden";

/**
 * Accessible wrapper for any loading UI (skeleton or spinner). The visual
 * content is purely decorative and hidden from assistive tech — `label`
 * is the only thing announced, through the native `role="status"` live
 * region (implicit `aria-live="polite"`).
 *
 * The inner wrapper uses `display: contents` so it doesn't affect layout
 * (flex/grid gap on the outer element still applies directly to
 * `children`), while `aria-hidden` still removes its subtree from the
 * accessibility tree.
 */
const LoadingStatus = ({
  label,
  children,
  className,
}: LoadingStatusPropsType) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: <div role="status"> is the standard React pattern for accessible live regions — <output> is semantically wrong for loading state
    <div role="status" className={className}>
      <VisuallyHidden>{label}</VisuallyHidden>

      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </div>
  );
};

LoadingStatus.displayName = "LoadingStatus";

export default LoadingStatus;
