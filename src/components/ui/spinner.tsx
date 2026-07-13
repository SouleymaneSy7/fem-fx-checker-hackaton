import * as React from "react";

import { cn } from "@/lib/utils";
import { LoaderIcon } from "../icons";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <React.Fragment>
      {/* biome-ignore lint/a11y/useSemanticElements: SVG spinner uses role="status" as a live region — <output> is semantically wrong */}
      <LoaderIcon
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
    </React.Fragment>
  );
}

export { Spinner };
