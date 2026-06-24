import type { MainPropsType } from "@/types/ui.types";

const Main = ({ children }: MainPropsType) => {
  return (
    <main className="container py-step-400 md:py-step-600 lg:py-step-600">
      {children}
    </main>
  );
};

export default Main;
