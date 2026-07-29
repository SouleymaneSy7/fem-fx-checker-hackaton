import Converter from "@/components/features/converter/converter";
import ConverterSections from "@/components/features/converter/converter-sections";
import { Main } from "@/components/layout";

export default function Home() {
  return (
    <Main>
      <Converter />
      <ConverterSections />
    </Main>
  );
}
