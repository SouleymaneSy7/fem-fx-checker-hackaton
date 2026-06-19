import {
  ArrowDownUp,
  ArrowLeftRight,
  ArrowRight,
  Check,
  Search,
  Star,
} from "lucide-react";

import { Icon } from "@/components/common/icon";
import { IconPropsType } from "@/types/ui.types";

import { ChevronDownSvg } from "./chevron-down-icon";
import { DeleteFilledSvg } from "./delete-filled-icon";
import { DeleteSvg } from "./delete-icon";
import { LogoSvg } from "./logo-icon";
import { StarFilledSvg } from "./star-filled-icon";

type IconComponentProps = Omit<IconPropsType, "icon">;

/* ── lucide-react ───────────────────────────────────────────────────── */

export const CheckIcon = (props: IconComponentProps) => (
  <Icon icon={Check} {...props} />
);
export const StarIcon = (props: IconComponentProps) => (
  <Icon icon={Star} {...props} />
);
export const ArrowLeftRightIcon = (props: IconComponentProps) => (
  <Icon icon={ArrowLeftRight} {...props} />
);
export const ArrowDownUpIcon = (props: IconComponentProps) => (
  <Icon icon={ArrowDownUp} {...props} />
);
export const SearchIcon = (props: IconComponentProps) => (
  <Icon icon={Search} {...props} />
);
export const ArrowRightIcon = (props: IconComponentProps) => (
  <Icon icon={ArrowRight} {...props} />
);

/* ── local SVGs ─────────────────────────────────────────────────────── */

export const LogoIcon = (props: IconComponentProps) => (
  <Icon icon={LogoSvg} {...props} />
);
export const StarFilledIcon = (props: IconComponentProps) => (
  <Icon icon={StarFilledSvg} {...props} />
);
export const ChevronDownIcon = (props: IconComponentProps) => (
  <Icon icon={ChevronDownSvg} {...props} />
);
export const DeleteIcon = (props: IconComponentProps) => (
  <Icon icon={DeleteSvg} {...props} />
);
export const DeleteFilledIcon = (props: IconComponentProps) => (
  <Icon icon={DeleteFilledSvg} {...props} />
);
