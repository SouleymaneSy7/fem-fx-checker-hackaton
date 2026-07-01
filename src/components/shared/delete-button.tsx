import type * as React from "react";
import { cn } from "@/lib/utils";

import { DeleteFilledIcon, DeleteIcon } from "../icons";
import { Button } from "../ui/button";

type DeleteButtonPropsType = {
  label?: string;
  className?: string;
} & React.ComponentProps<"button">;

const DeleteButton = ({
  label = "Delete",
  className,
  ...delegatedProps
}: DeleteButtonPropsType) => {
  return (
    <Button
      type="button"
      variant="default"
      size="icon"
      aria-label={label}
      className={cn("group", className)}
      {...delegatedProps}
    >
      <span className="relative h-step-200 w-step-200">
        <DeleteIcon
          className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
          size={16}
        />
        <DeleteFilledIcon
          className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          size={16}
        />
      </span>
    </Button>
  );
};

export default DeleteButton;
