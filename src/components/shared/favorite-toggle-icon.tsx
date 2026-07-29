import { cn } from "@/lib/utils";
import type { FavoritePropsType } from "@/types";
import { StarFilledIcon, StarIcon } from "../icons";
import {
  Button,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui";

const FavoriteToggleIcon = ({
  isFavorite,
  isSyncing,
  onToggle,
  label,
  disabled,
  className,
}: FavoritePropsType) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          size={"icon"}
          variant={"default"}
          aria-pressed={isFavorite}
          aria-label={label}
          disabled={disabled || isSyncing}
          onClick={onToggle}
          className={cn(
            "relative",
            isFavorite &&
              "border-primary hover:border-primary hover:bg-neutral-500",
            className,
          )}
        >
          {isFavorite ? (
            <StarFilledIcon className="text-primary" />
          ) : (
            <StarIcon className="text-foreground" />
          )}

          {isSyncing && (
            <Spinner
              aria-hidden="true"
              className="-right-0.5 -bottom-0.5 absolute size-2.5 text-neutral-100"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default FavoriteToggleIcon;
