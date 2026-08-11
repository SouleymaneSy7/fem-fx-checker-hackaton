import { Container, List, VisuallyHidden } from "@/components/common";
import { PillIndicator } from "@/components/shared";
import {
  Marquee,
  MarqueeContent,
  MarqueeHeader,
  MarqueeTitle,
} from "@/components/ui";
import type { TickerPropsType } from "@/types";
import TickerItem from "./ticker-item";

const Ticker = ({ pairs, durationSeconds }: TickerPropsType) => {
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

        <MarqueeContent duration={durationSeconds}>
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
