import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { LogButtonPropsType } from "@/types/ui.types";
import { CheckIcon } from "../icons";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const LogButton = ({
  disabled,
  isLogged,
  isSyncing,
  onToggle,
  label,
  className,
  ...delegatedProps
}: LogButtonPropsType) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={isLogged ? "primary" : "outline"}
          aria-pressed={isLogged}
          aria-busy={isSyncing}
          aria-label={label}
          onClick={onToggle}
          className={cn(isLogged && "capitalize", className)}
          disabled={disabled || isSyncing}
          {...delegatedProps}
        >
          {isSyncing ? (
            <Spinner aria-hidden="true" className="text-foreground" />
          ) : isLogged ? (
            <CheckIcon className="text-primary-foreground" />
          ) : null}
          {isSyncing ? "Logging..." : isLogged ? "Logged" : "Log Conversion"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default LogButton;
