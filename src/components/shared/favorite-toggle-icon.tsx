import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { FavoritePropsType } from "@/types";
import { StarFilledIcon, StarIcon } from "../icons";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

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
              className="absolute -right-0.5 -bottom-0.5 size-2.5 text-neutral-100"
            />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default FavoriteToggleIcon;
