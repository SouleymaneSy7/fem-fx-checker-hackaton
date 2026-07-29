import * as React from "react";
import type { HeadingLevel, TitlePropsType } from "@/types";

const HEADING_TAGS = new Set<HeadingLevel>([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

const Title = React.forwardRef<HTMLHeadingElement, TitlePropsType>(
  ({ level = "h1", children, as, ...delegatedProps }, ref) => {
    const Component = as || level;
    const isNativeHeading =
      typeof Component === "string" &&
      HEADING_TAGS.has(Component as HeadingLevel);
    const numericLevel = Number(level[1]);

    return (
      <Component
        ref={ref}
        {...(!isNativeHeading && {
          role: "heading",
          "aria-level": numericLevel,
        })}
        {...delegatedProps}
      >
        {children}
      </Component>
    );
  },
);

Title.displayName = "Title";

export default Title;
