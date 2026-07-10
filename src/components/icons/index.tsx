import {
  ArrowDownUp,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpFromLine,
  Check,
  ChevronDown,
  Loader2Icon,
  Search,
  Star,
} from "lucide-react";

import { Icon } from "@/components/common/icon";
import type { IconPropsType } from "@/types/ui.types";
import { AdjustHalfSvg } from "./adjust-half-icon";
import { ChevronDownSvg } from "./chevron-down-icon";
import { DeleteFilledSvg } from "./delete-filled-icon";
import { DeleteSvg } from "./delete-icon";
import { LogoSvg } from "./logo-icon";
import { QuestionSvg } from "./question-icon";
import { StarFilledSvg } from "./star-filled-icon";

type IconComponentProps = Omit<IconPropsType, "icon">;

/* ── lucide-react ───────────────────────────────────────────────────── */

export const CheckIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={Check}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const StarIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={Star}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const ArrowLeftRightIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={ArrowLeftRight}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const ArrowDownUpIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={ArrowDownUp}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const SearchIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={Search}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const ArrowRightIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={ArrowRight}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const ChevronDown2Icon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={ChevronDown}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const ArrowUpFromLineIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={ArrowUpFromLine}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const LoaderIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={Loader2Icon}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);

/* ── local SVGs ─────────────────────────────────────────────────────── */

export const LogoIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={LogoSvg}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const StarFilledIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={StarFilledSvg}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const ChevronDownIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={ChevronDownSvg}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const DeleteIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={DeleteSvg}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const DeleteFilledIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={DeleteFilledSvg}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const AdjustHalfIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={AdjustHalfSvg}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
export const QuestionIcon = ({
  size,
  label,
  className,
  ...props
}: IconComponentProps) => (
  <Icon
    icon={QuestionSvg}
    size={size}
    label={label}
    className={className}
    {...props}
  />
);
