import Link from "next/link";

import Logo from "@/components/shared/logo";
import type { NavbarPropsType } from "@/types/ui.types";
import Container from "../common/container";

const Navbar = ({ availableCurrencies }: NavbarPropsType) => {
  return (
    <Container className="container-header | flex justify-between items-center py-step-250">
      <Link href={"/"}>
        <Logo />
      </Link>

      <p className="text-neutral-200">
        <span>{availableCurrencies}</span> Currencies · EOD · ECB data
      </p>
    </Container>
  );
};

export default Navbar;
