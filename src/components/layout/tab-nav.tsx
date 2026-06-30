import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabNavPropsType = {
  favoritesCount?: number;
  logCount?: number;
};

const SECTIONS = [
  { id: crypto.randomUUID(), value: "history", label: "History" },
  { id: crypto.randomUUID(), value: "compare", label: "Compare" },
  { id: crypto.randomUUID(), value: "favorites", label: "Favorites" },
  { id: crypto.randomUUID(), value: "log", label: "Log" },
] as const;

const TabNav = ({ favoritesCount = 0, logCount = 0 }: TabNavPropsType) => {
  const countByValue: Partial<Record<string, number>> = {
    favorites: favoritesCount,
    log: logCount,
  };

  return (
    <TabsList aria-label="Converter sections">
      {SECTIONS.map((section) => {
        const count = countByValue[section.value];

        return (
          <TabsTrigger key={section.id} value={section.value}>
            {section.label}
            {count !== undefined && <Badge>{count}</Badge>}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default TabNav;
