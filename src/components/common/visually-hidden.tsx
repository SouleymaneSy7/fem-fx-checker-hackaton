"use client";

import * as React from "react";
import type { VisuallyHiddenPropsType } from "@/types/ui.types";

const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  VisuallyHiddenPropsType
>(({ children, ...delegatedProps }, ref) => {
  const [forceShow, setForceShow] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Alt") setForceShow(true);
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt") setForceShow(false);
    };
    const handleBlur = () => setForceShow(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  if (forceShow) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return (
    <span ref={ref} className="sr-only" {...delegatedProps}>
      {children}
    </span>
  );
});

VisuallyHidden.displayName = "VisuallyHidden";

export default VisuallyHidden;
