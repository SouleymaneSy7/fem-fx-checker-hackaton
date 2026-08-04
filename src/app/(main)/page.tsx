import Converter from "@/components/features/converter/converter";
import ConverterSections from "@/components/features/converter/converter-sections";
import { Footer, Main } from "@/components/layout";
import { ShortcutsHelp } from "@/components/shared";

export default function Home() {
  return (
    <Main>
      <Converter />
      <ConverterSections />
      <Footer />
      <ShortcutsHelp />
    </Main>
  );
}
