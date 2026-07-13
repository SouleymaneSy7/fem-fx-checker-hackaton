import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { DeleteButtonPropsType } from "@/types/ui.types";
import { DeleteFilledIcon, DeleteIcon } from "../icons";
import { Button } from "../ui/button";

const DeleteButton = ({
  label = "Delete",
  className,
  ...delegatedProps
}: DeleteButtonPropsType) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>

      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default DeleteButton;
