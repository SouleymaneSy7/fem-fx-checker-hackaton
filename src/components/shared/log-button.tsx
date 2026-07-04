import { cn } from "@/lib/utils";
import type { LogButtonPropsType } from "@/types/ui.types";
import { CheckIcon } from "../icons";
import { Button } from "../ui/button";

const LogButton = ({
  disabled,
  isLogged,
  onToggle,
  label,
  className,
  ...delegatedProps
}: LogButtonPropsType) => {
  return (
    <Button
      type="button"
      variant={isLogged ? "primary" : "outline"}
      aria-pressed={isLogged}
      aria-label={label}
      onClick={onToggle}
      className={cn(isLogged && "capitalize", className)}
      disabled={disabled}
      {...delegatedProps}
    >
      {isLogged ? <CheckIcon className="text-primary-foreground" /> : null}
      {isLogged ? "Logged" : "Log Conversion"}
    </Button>
  );
};

export default LogButton;
