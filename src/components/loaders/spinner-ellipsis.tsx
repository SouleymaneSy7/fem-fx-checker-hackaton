import * as React from "react";
import { cn } from "@/lib/utils";

type SpinnerEllipsisPropsType = {
  className?: string;
};

export default function SpinnerEllipsis({
  className,
  ...delegatedProps
}: SpinnerEllipsisPropsType) {
  return (
    <React.Fragment>
      <style>{`
        .spinner-ellipsis-dot {
          animation: spinner-ellipsis 1s ease-in-out infinite;
        }
        @keyframes spinner-ellipsis {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="flex items-center gap-1.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span
            key={i}
            className={cn(
              "size-2 rounded-full bg-primary spinner-ellipsis-dot",
              className,
            )}
            style={{ animationDelay: `${delay}s` }}
            {...delegatedProps}
          />
        ))}
      </div>
    </React.Fragment>
  );
}
