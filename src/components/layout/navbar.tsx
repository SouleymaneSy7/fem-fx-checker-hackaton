import Link from "next/link";
import Logo from "@/components/shared/logo";

const availableCurrencies = 55;

const Navbar = () => {
  return (
    <div className="container-header | flex justify-between items-center">
      <Link href={"/"}>
        <Logo />
      </Link>

      <p className="text-neutral-200">
        <span>{availableCurrencies}</span> Currencies · EOD · ECB data
      </p>
    </div>
  );
};

export default Navbar;
