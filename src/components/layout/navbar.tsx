import Link from "next/link";

import Logo from "@/components/shared/logo";
import TextTooltip from "@/components/shared/text-tooltip";
import { Separator } from "@/components/ui/separator";
import type { NavbarPropsType } from "@/types";
import Container from "../common/container";
import AuthPopover from "../features/auth/auth-popover";
import { Spinner } from "../ui/spinner";
import ThemeToggle from "./theme-toggle";

const Navbar = ({ availableCurrencies, isLoading }: NavbarPropsType) => {
  return (
    <Container className="container-header | flex flex-wrap gap-step-100 justify-between items-center py-step-250">
      <Link href={"/"}>
        <Logo />
      </Link>

      <div className="flex items-center gap-step-200">
        <p className="hidden text-neutral-200 md:flex md:items-center md:gap-step-100">
          {isLoading ? <Spinner /> : <span>{availableCurrencies}</span>}{" "}
          Currencies{" "}
          <TextTooltip content="End-of-day rates from the European Central Bank.">
            · EOD · ECB data
          </TextTooltip>
        </p>

        <Separator orientation="vertical" className="hidden md:inline-block" />
        <AuthPopover />

        <Separator orientation="vertical" />
        <ThemeToggle />
      </div>
    </Container>
  );
};

export default Navbar;
