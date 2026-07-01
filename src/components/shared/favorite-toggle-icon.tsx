import { cn } from "@/lib/utils";
import type { FavoritePropsType } from "@/types/ui.types";
import { StarFilledIcon, StarIcon } from "../icons";
import { Button } from "../ui/button";

const FavoriteToggleIcon = ({
  isFavorite,
  onToggle,
  label,
  className,
}: FavoritePropsType) => {
  return (
    <Button
      type="button"
      size={"icon"}
      variant={"default"}
      aria-pressed={isFavorite}
      aria-label={label}
      onClick={onToggle}
      className={cn(isFavorite && "border-primary hover:border-primary hover:bg-neutral-500", className)}
    >
      {isFavorite ? (
        <StarFilledIcon className="text-primary" />
      ) : (
        <StarIcon className="text-foreground" />
      )}
    </Button>
  );
};

export default FavoriteToggleIcon;
