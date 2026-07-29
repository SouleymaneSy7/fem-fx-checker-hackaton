import Container from "@/components/common/container";
import List from "@/components/common/list";
import VisuallyHidden from "@/components/common/visually-hidden";
import { PillIndicator } from "@/components/shared/pill-indicator";
import {
  Marquee,
  MarqueeContent,
  MarqueeHeader,
  MarqueeTitle,
} from "@/components/ui/marquee";
import type { TickerPropsType } from "@/types";
import TickerItem from "./ticker-item";

const Ticker = ({ pairs }: TickerPropsType) => {
  if (pairs.length === 0) return null;

  return (
    <Container
      as="section"
      className="container-ticker"
      aria-label="Live markets"
    >
      <Marquee>
        <MarqueeHeader>
          <PillIndicator />
          <MarqueeTitle>Live Markets</MarqueeTitle>
        </MarqueeHeader>

        <MarqueeContent>
          <List
            as="div"
            items={pairs}
            keyExtractor={(pair) => pair.id}
            renderItem={(pair) => <TickerItem pair={pair} />}
            className="flex items-center"
          />
        </MarqueeContent>
      </Marquee>

      <VisuallyHidden>
        Live markets:{" "}
        {pairs
          .map(
            (pair) =>
              `${pair.base}/${pair.quote} ${pair.rate}, ${
                pair.changePercent >= 0 ? "up" : "down"
              } ${Math.abs(pair.changePercent)}%`,
          )
          .join(", ")}
      </VisuallyHidden>
    </Container>
  );
};

export default Ticker;
