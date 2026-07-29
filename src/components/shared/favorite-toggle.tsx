import { StarFilledIcon, StarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { FavoritePropsType } from "@/types";

const FavoriteToggle = ({
  isFavorite,
  isSyncing,
  onToggle,
  label,
  disabled,
  className,
}: FavoritePropsType) => {
  return (
    <Button
      type="button"
      variant={isFavorite ? "primary" : "default"}
      aria-pressed={isFavorite}
      aria-label={label}
      disabled={disabled || isSyncing}
      onClick={onToggle}
      className={cn(className)}
    >
      {isFavorite ? (
        <StarFilledIcon className="text-primary-foreground" />
      ) : (
        <StarIcon className="text-foreground" />
      )}
      {isFavorite ? "Favorited" : "Favorite"}
      {isSyncing && (
        <Spinner
          aria-hidden="true"
          className={isFavorite ? "text-primary-foreground" : "text-foreground"}
        />
      )}
    </Button>
  );
};

export default FavoriteToggle;
