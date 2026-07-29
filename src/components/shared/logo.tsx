import { Title } from "../common";
import { LogoIcon } from "../icons";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon size={26} className="text-primary" />
      <Title level="h3" className="preset-3-bold uppercase">
        Fx_checker
      </Title>
    </div>
  );
};

export default Logo;
