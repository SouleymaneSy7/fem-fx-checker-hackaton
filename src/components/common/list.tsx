import * as React from "react";
import type { ListPropsType, PolymorphicRef } from "@/types/ui.types";

type ListComponent = (<Item, As extends React.ElementType = "ul">(
  props: ListPropsType<Item, As>,
) => React.ReactElement | null) & { displayName?: string };

function ListRenderFn<Item, As extends React.ElementType = "ul">(
  {
    items,
    renderItem,
    as,
    keyExtractor,
    ...delegatedProps
  }: ListPropsType<Item, As>,
  ref: PolymorphicRef<As>,
) {
  const Component = as ?? "ul";

  return (
    // biome-ignore lint/a11y/useSemanticElements: polymorphic component — default is <ul>, but consumers can pass <div>, <ol>, etc.
    <Component ref={ref} role="list" {...delegatedProps}>
      {items.map((item, index) => {
        const key = keyExtractor?.(item, index) ?? index;
        return (
          <React.Fragment key={key}>{renderItem(item, index)}</React.Fragment>
        );
      })}
    </Component>
  );
}

const List = React.forwardRef(
  ListRenderFn as React.ForwardRefRenderFunction<
    unknown,
    ListPropsType<unknown, "ul">
  >,
) as unknown as ListComponent;

List.displayName = "List";

export default List;
