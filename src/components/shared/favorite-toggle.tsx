import { StarFilledIcon, StarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FavoritePropsType } from "@/types/ui.types";

const FavoriteToggle = ({
  isFavorite,
  onToggle,
  label,
  className,
}: FavoritePropsType) => {
  return (
    <Button
      type="button"
      variant={isFavorite ? "primary" : "default"}
      aria-pressed={isFavorite}
      aria-label={label}
      onClick={onToggle}
      className={cn(className)}
    >
      {isFavorite ? (
        <StarFilledIcon className="text-primary-foreground" />
      ) : (
        <StarIcon className="text-foreground" />
      )}
      {isFavorite ? "Favorited" : "Favorite"}
    </Button>
  );
};

export default FavoriteToggle;
