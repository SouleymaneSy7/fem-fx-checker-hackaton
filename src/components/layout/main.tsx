import { Container } from "@/components/common";
import type { MainPropsType } from "@/types";

const Main = ({ children }: MainPropsType) => {
  return (
    <Container
      as="main"
      className="| container flex flex-col gap-step-400 py-step-400 md:py-step-600 lg:py-step-600"
    >
      {children}
    </Container>
  );
};

export default Main;
