import type { MainPropsType } from "@/types/ui.types";
import Container from "../common/container";

const Main = ({ children }: MainPropsType) => {
  return (
    <Container
      as="main"
      className="container | py-step-400 md:py-step-600 lg:py-step-600"
    >
      {children}
    </Container>
  );
};

export default Main;
