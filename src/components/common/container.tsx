import * as React from "react";
import type { ContainerPropsType, PolymorphicRef } from "@/types/ui.types";

type ContainerComponent = (<C extends React.ElementType = "div">(
  props: ContainerPropsType<C>,
) => React.ReactElement | null) & { displayName?: string };

function ContainerRenderFn<C extends React.ElementType = "div">(
  { as, children, ...delegatedProps }: ContainerPropsType<C>,
  ref: PolymorphicRef<C>,
) {
  const Component = as || "div";

  return (
    <Component ref={ref} {...delegatedProps}>
      {children}
    </Component>
  );
}

const Container = React.forwardRef(
  ContainerRenderFn as React.ForwardRefRenderFunction<
    unknown,
    ContainerPropsType<"div">
  >,
) as unknown as ContainerComponent;

Container.displayName = "Container";

export default Container;
