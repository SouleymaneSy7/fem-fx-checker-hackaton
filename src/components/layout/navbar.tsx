import Link from "next/link";

import Logo from "@/components/shared/logo";
import type { NavbarPropsType } from "@/types/ui.types";
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
        <p className="hidden text-neutral-200 sm:flex sm:items-center sm:gap-step-100">
          {isLoading ? <Spinner /> : <span>{availableCurrencies}</span>}{" "}
          Currencies <span> · EOD · ECB data</span>
        </p>

        <AuthPopover />
        <ThemeToggle />
      </div>
    </Container>
  );
};

export default Navbar;
